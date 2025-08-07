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
  teethData?: Record<string, Procedure[]>;
}

type ToothType = 'adult' | 'milk';

interface ToothStore {
  teethData: Record<string, Procedure[]>;
  patientId: string | null;
  patients: Patient[];

  toothTypes: Record<string, ToothType>;
  toggleToothType: (number: number) => void;
  getActiveToothNumber: (tooth: number) => number;

  selectedProcedure: {
    proc: Procedure;
    toothNumber: string;
    displayTooth: string;
  } | null;
  draftProcedure: { proc: Procedure; toothNumber: string } | null;
  noteModalVisible: boolean;

  showTable: boolean;
  toggleTable: () => void;

  setDraftProcedure: (proc: Procedure, toothNumber: string) => { allowed: boolean; reason?: string };
  clearDraftProcedure: () => void;
  showNoteModal: () => void;
  hideNoteModal: () => void;

  saveNoteAndAddProcedure: (note: string) => Promise<{ allowed: boolean; reason?: string }>;

  setSelectedProcedure: (proc: Procedure, toothNumber: string) => void;
  clearSelectedProcedure: () => void;

  addProcedureToTooth: (number: string, item: Procedure) => Promise<void>;
  removeProcedureFromTooth: (number: string, index: number) => Promise<void>;
  updateProcedureNote: (
    toothNumber: string,
    index: number,
    note: string
  ) => Promise<void>;

  setPatientId: (id: string) => void;

  loadPatientData: () => Promise<void>;
  fetchPatients: () => Promise<void>;

  addPatient: (patient: Patient) => void;
}

export const useToothStore = create<ToothStore>()(
  persist(
    (set, get) => ({
      teethData: {},
      patientId: null,
      patients: [],

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
          const map: Record<number, number> = {
            15: 51, 14: 52, 13: 53, 12: 54, 11: 55,
            21: 61, 22: 62, 23: 63, 24: 64, 25: 65,
            35: 71, 34: 72, 33: 73, 32: 74, 31: 75,
            41: 81, 42: 82, 43: 83, 44: 84, 45: 85,
          };

          return map[tooth] || tooth;
        }
        return tooth;
      },

      selectedProcedure: null,
      draftProcedure: null,
      noteModalVisible: false,

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
      showNoteModal: () => set({ noteModalVisible: true }),
      hideNoteModal: () => set({ noteModalVisible: false }),

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

      setSelectedProcedure: (proc, toothNumber) => {
        const state = get();
        const active = state.getActiveToothNumber(Number(toothNumber));
        const isMilk = active >= 51 && active <= 85;
        const map: Record<number, string> = {
          55: 'A', 54: 'B', 53: 'C', 52: 'D', 51: 'E',
          61: 'F', 62: 'G', 63: 'H', 64: 'I', 65: 'J',
          75: 'K', 74: 'L', 73: 'M', 72: 'N', 71: 'O',
          81: 'P', 82: 'Q', 83: 'R', 84: 'S', 85: 'T',
        };

        const displayTooth = isMilk ? map[active] || toothNumber : toothNumber;
        set({ selectedProcedure: { proc, toothNumber: active.toString(), displayTooth } });
      },

      clearSelectedProcedure: () => set({ selectedProcedure: null }),

      addProcedureToTooth: async (tooth, item) => {
        const state = get();
        const activeTooth = state.getActiveToothNumber(Number(tooth)).toString();

        const dentistId = localStorage.getItem('dentistId') || '';
        const dentistName = localStorage.getItem('dentistName') || 'Unknown';
        const now = new Date().toISOString();

        const newProcedure = {
          ...item,
          createdAt: now,
          notes: '',
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

      setPatientId: (id) => set({ patientId: id }),

      loadPatientData: async () => {
        const { patientId } = get();
        if (!patientId) return;

        try {
          const res = await getPatientById(patientId);
          const patient = res.data;
          set({ teethData: patient.teethData || {} });
        } catch (err) {
          console.error('Failed to load patient data:', err);
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
        set((state) => ({
          patients: [...state.patients, patient],
        })),
    }),
    {
      name: 'teeth-storage',
    }
  )
);
