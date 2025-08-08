// store/useToothStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getAllPatients,
  getPatientById,
  updatePatientProcedures,
} from '../api/patientApi';
import { validateProcedure } from '../utils/procedureRules';

export interface Procedure {
  type: string;
  createdAt?: string;
  notes?: string;
  dentistId?: string;
  dentistName?: string;
  x?: number;
  y?: number;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  dentitionType?: 'adult' | 'child' | 'mixed';
  teethData?: Record<string, Procedure[]>;
}

type ToothType = 'adult' | 'milk';
type BridgeDraft = { startTooth: number; color: string } | null;

// Adult positions that can have pedo counterparts (FDI)
const PEDO_CAPABLE_ADULTS = [
  15, 14, 13, 12, 11, 21, 22, 23, 24, 25,
  35, 34, 33, 32, 31, 41, 42, 43, 44, 45,
];

const ADULT_TO_PEDO_MAP: Record<number, number> = {
  15: 55, 14: 54, 13: 53, 12: 52, 11: 51,
  21: 61, 22: 62, 23: 63, 24: 64, 25: 65,
  31: 71, 32: 72, 33: 73, 34: 74, 35: 75,
  41: 81, 42: 82, 43: 83, 44: 84, 45: 85,
};

function buildDefaultToothTypes(dentitionType?: Patient['dentitionType']): Record<string, ToothType> {
  if (dentitionType === 'child') {
    const map: Record<string, ToothType> = {};
    PEDO_CAPABLE_ADULTS.forEach((adult) => {
      map[adult.toString()] = 'milk';
    });
    return map;
  }
  return {};
}

interface ToothStore {
  // data
  teethData: Record<string, Procedure[]>;
  patientId: string | null;
  patients: Patient[];

  // ui state for patient loading
  isLoadingPatient: boolean;
  patientError: string | null;

  // tooth type toggles
  toothTypes: Record<string, ToothType>;
  toggleToothType: (number: number) => void;
  getActiveToothNumber: (tooth: number) => number;

  // selection (click-to-apply)
  selectedProcedureForAdd: (Procedure & { color?: string }) | null;
  selectProcedureForAdd: (proc: Procedure & { color?: string }) => void;
  clearSelectedForAdd: () => void;

  // overlay selection (existing)
  selectedProcedure: {
    proc: Procedure;
    toothNumber: string;
    displayTooth: string;
  } | null;
  setSelectedProcedure: (proc: Procedure, toothNumber: string) => void;
  clearSelectedProcedure: () => void;

  // draft + modal
  draftProcedure: { proc: Procedure; toothNumber: string } | null;
  noteModalVisible: boolean;
  hasModalOpen: boolean;

  showTable: boolean;
  toggleTable: () => void;

  setDraftProcedure: (proc: Procedure, toothNumber: string) => { allowed: boolean; reason?: string };
  clearDraftProcedure: () => void;
  showNoteModal: () => void;
  hideNoteModal: () => void;

  saveNoteAndAddProcedure: (note: string) => Promise<{ allowed: boolean; reason?: string }>;

  // persistence helpers
  addProcedureToTooth: (number: string, item: Procedure) => Promise<void>;
  removeProcedureFromTooth: (number: string, index: number) => Promise<void>;
  updateProcedureNote: (toothNumber: string, index: number, note: string) => Promise<void>;

  // patient
  setPatientId: (id: string) => void;
  loadPatientData: () => Promise<void>;
  fetchPatients: () => Promise<void>;
  addPatient: (patient: Patient) => void;

  // bridge 2-step
  bridgeDraft: BridgeDraft;
  startBridgeDraft: (startTooth: number, color: string) => void;
  cancelBridgeDraft: () => void;
  finalizeBridge: (endTooth: number) => { ok: true } | { ok: false; reason: string };

  // main click handler
  applySelectedToTooth: (toothNumber: string) => { ok: boolean; reason?: string };
}

export const useToothStore = create<ToothStore>()(
  persist(
    (set, get) => ({
      teethData: {},
      patientId: null,
      patients: [],

      isLoadingPatient: false,
      patientError: null,

      toothTypes: {},
      toggleToothType: (number) => {
        set((state) => {
          const current = state.toothTypes[number.toString()] || 'adult';
          return {
            toothTypes: {
              ...state.toothTypes,
              [number.toString()]: current === 'adult' ? 'milk' : 'adult',
            },
          };
        });
      },

      getActiveToothNumber: (tooth) => {
        const { toothTypes } = get();
        if (toothTypes[tooth.toString()] === 'milk') {
          return ADULT_TO_PEDO_MAP[tooth] ?? tooth;
        }
        return tooth;
      },

      // === Selection (click-to-apply) ===
      selectedProcedureForAdd: null,
      selectProcedureForAdd: (proc) => set({ selectedProcedureForAdd: proc }),
      clearSelectedForAdd: () => set({ selectedProcedureForAdd: null }),

      // === Overlay selection (existing ones) ===
      selectedProcedure: null,
      setSelectedProcedure: (proc, toothNumber) => {
        const state = get();
        const active = state.getActiveToothNumber(Number(toothNumber));
        set({ selectedProcedure: { proc, toothNumber: active.toString(), displayTooth: active.toString() } });
      },
      clearSelectedProcedure: () => set({ selectedProcedure: null }),

      // === Draft + modal ===
      draftProcedure: null,
      noteModalVisible: false,
      hasModalOpen: false,

      showTable: true,
      toggleTable: () => set((state) => ({ showTable: !state.showTable })),

      setDraftProcedure: (proc, toothNumber) => {
        const state = get();
        const activeTooth = state.getActiveToothNumber(Number(toothNumber)).toString();
        const existing = state.teethData[activeTooth] || [];
        const result = validateProcedure(existing, proc);
        if (!result.allowed) return result;
        set({ draftProcedure: { proc, toothNumber: activeTooth } });
        return { allowed: true };
      },

      clearDraftProcedure: () => set({ draftProcedure: null }),

      showNoteModal: () => set({ noteModalVisible: true, hasModalOpen: true }),
      hideNoteModal: () => set({ noteModalVisible: false, hasModalOpen: false }),

      saveNoteAndAddProcedure: async (note) => {
        const state = get();
        const draft = state.draftProcedure;
        if (!draft) return { allowed: false, reason: 'No draft procedure selected.' };

        const existing = state.teethData[draft.toothNumber] || [];
        const result = validateProcedure(existing, draft.proc);
        if (!result.allowed) return result;

        const dentistId = localStorage.getItem('dentistId') || '';
        const dentistName = localStorage.getItem('dentistName') || 'Unknown';
        const now = new Date().toISOString();

        const newProcedure: Procedure = {
          ...draft.proc,
          createdAt: now,
          notes: note,
          dentistId,
          dentistName,
        };

        const updatedTeethData = {
          ...state.teethData,
          [draft.toothNumber]: [...existing, newProcedure],
        };

        set({
          teethData: updatedTeethData,
          draftProcedure: null,
          noteModalVisible: false,
          hasModalOpen: false,
        });

        if (state.patientId) {
          try {
            await updatePatientProcedures(state.patientId, updatedTeethData);
          } catch (err) {
            console.error('Failed to save procedure:', err);
          }
        }

        return { allowed: true };
      },

      addProcedureToTooth: async (tooth, item) => {
        const state = get();
        const activeTooth = state.getActiveToothNumber(Number(tooth)).toString();

        const dentistId = localStorage.getItem('dentistId') || '';
        const dentistName = localStorage.getItem('dentistName') || 'Unknown';
        const now = new Date().toISOString();

        const newProcedure: Procedure = {
          ...item,
          createdAt: now,
          notes: item.notes ?? '',
          dentistId,
          dentistName,
        };

        const existing = state.teethData[activeTooth] || [];
        const updatedTeethData = {
          ...state.teethData,
          [activeTooth]: [...existing, newProcedure],
        };

        set({ teethData: updatedTeethData });

        if (state.patientId) {
          try {
            await updatePatientProcedures(state.patientId, updatedTeethData);
          } catch (err) {
            console.error('Failed to save procedure:', err);
          }
        }
      },

      removeProcedureFromTooth: async (tooth, index) => {
        const state = get();
        const activeTooth = state.getActiveToothNumber(Number(tooth)).toString();
        const updated = [...(state.teethData[activeTooth] || [])];
        updated.splice(index, 1);

        const updatedTeethData = {
          ...state.teethData,
          [activeTooth]: updated,
        };

        set({ teethData: updatedTeethData });

        if (state.patientId) {
          try {
            await updatePatientProcedures(state.patientId, updatedTeethData);
          } catch (err) {
            console.error('Failed to update procedures:', err);
          }
        }
      },

      updateProcedureNote: async (toothNumber, index, note) => {
        const state = get();
        const updated = [...(state.teethData[toothNumber] || [])];
        if (updated[index]) {
          updated[index] = { ...updated[index], notes: note };
        }

        const updatedTeethData = {
          ...state.teethData,
          [toothNumber]: updated,
        };

        set({ teethData: updatedTeethData });

        if (state.patientId) {
          try {
            await updatePatientProcedures(state.patientId, updatedTeethData);
          } catch (err) {
            console.error('Failed to update procedure note:', err);
          }
        }
      },

      // --- Patient switching: initialize toothTypes for child and reset ephemeral UI ---
      setPatientId: (id) => {
        const { patients } = get();
        const patient = patients.find((p) => p._id === id);
        const defaults = buildDefaultToothTypes(patient?.dentitionType);
        set({
          patientId: id,
          toothTypes: defaults,
          selectedProcedureForAdd: null,
          selectedProcedure: null,
          draftProcedure: null,
          bridgeDraft: null,
          // don't clear teethData here; loadPatientData will replace it
        });
      },

      // Load teeth for the selected patient, with loading & error signals
      loadPatientData: async () => {
        const { patientId } = get();
        if (!patientId) return;

        set({ isLoadingPatient: true, patientError: null });
        try {
          const res = await getPatientById(patientId);
          const patient = res.data as Patient;

          const defaults = buildDefaultToothTypes(patient?.dentitionType);
          set({
            teethData: patient.teethData || {},
            toothTypes: defaults,
            isLoadingPatient: false,
            patientError: null,
          });
        } catch (err: any) {
          console.error('Failed to load patient data:', err);
          set({
            isLoadingPatient: false,
            patientError: 'Unable to reach the server. Please ensure the backend is running.',
          });
        }
      },

      fetchPatients: async () => {
        try {
          const res = await getAllPatients();
          set({ patients: res.data });
        } catch (err) {
          console.error('Error fetching patients:', err);
        }
      },

      addPatient: (patient) =>
        set((state) => {
          const nextPatients = [...state.patients, patient];
          const defaults =
            patient._id === state.patientId
              ? buildDefaultToothTypes(patient.dentitionType)
              : state.toothTypes;

          return {
            patients: nextPatients,
            toothTypes: defaults,
          };
        }),

      // ===== Bridge 2-step =====
      bridgeDraft: null,
      startBridgeDraft: (startTooth, color) => {
        set(() => ({ bridgeDraft: { startTooth, color } }));
      },
      cancelBridgeDraft: () => set(() => ({ bridgeDraft: null })),

      finalizeBridge: (endTooth) => {
        const { bridgeDraft, addProcedureToTooth } = get();
        if (!bridgeDraft) return { ok: false, reason: 'No bridge in progress.' };

        const { startTooth, color } = bridgeDraft;

        const upperRow = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
        const lowerRow = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

        const idx = (t: number, row: number[]) => row.indexOf(t);
        const su = idx(startTooth, upperRow), eu = idx(endTooth, upperRow);
        const sl = idx(startTooth, lowerRow), el = idx(endTooth, lowerRow);

        let row: number[] | null = null;
        let i1 = -1, i2 = -1;

        if (su !== -1 && eu !== -1) { row = upperRow; i1 = su; i2 = eu; }
        else if (sl !== -1 && el !== -1) { row = lowerRow; i1 = sl; i2 = el; }
        else {
          set(() => ({ bridgeDraft: null }));
          return { ok: false, reason: 'Bridge must stay on the same arch (upper or lower).' };
        }

        const [from, to] = i1 <= i2 ? [i1, i2] : [i2, i1];
        const span = row.slice(from, to + 1);

        const noteLabel = `Bridge ${row[from]}–${row[to]}`;
        span.forEach((tooth) => {
          // @ts-ignore color passthrough allowed
          addProcedureToTooth(tooth.toString(), { type: 'Bridge', notes: noteLabel, color });
        });

        set(() => ({ bridgeDraft: null }));
        return { ok: true };
      },

      // === Main click apply ===
      applySelectedToTooth: (toothNumber) => {
        const state = get();
        const sel = state.selectedProcedureForAdd;
        if (!sel) return { ok: false, reason: 'No procedure selected.' };

        if (sel.type === 'Bridge') {
          if (!state.bridgeDraft) {
            const color = (sel as any).color || '#A0522D';
            state.startBridgeDraft(Number(toothNumber), color);
            return { ok: true };
          }
          if (state.bridgeDraft.startTooth === Number(toothNumber)) {
            return { ok: false, reason: 'Choose a different tooth to finish the bridge.' };
          }
          const res = state.finalizeBridge(Number(toothNumber));
          if (res.ok) state.clearSelectedForAdd();
          return res.ok ? { ok: true } : { ok: false, reason: res.reason };
        }

        const result = state.setDraftProcedure(sel, toothNumber);
        if (!result.allowed) return { ok: false, reason: result.reason };
        state.showNoteModal();
        state.clearSelectedForAdd();
        return { ok: true };
      },
    }),
    { name: 'teeth-storage' }
  )
);
