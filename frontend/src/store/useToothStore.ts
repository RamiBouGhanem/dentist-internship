// ✅ useToothStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getAllPatients,
  getPatientById,
  updatePatientProcedures,
} from '../api/patientApi';

// Types
export interface Procedure {
  type: string;
  createdAt?: string;
  notes?: string;
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

interface ToothStore {
  teethData: Record<string, Procedure[]>;
  patientId: string | null;
  patients: Patient[];

  selectedProcedure: { proc: Procedure; toothNumber: string } | null;
  draftProcedure: { proc: Procedure; toothNumber: string } | null;
  noteModalVisible: boolean;

  // New UI state for showing/hiding the history table
  showTable: boolean;
  toggleTable: () => void;

  setDraftProcedure: (proc: Procedure, toothNumber: string) => void;
  clearDraftProcedure: () => void;
  showNoteModal: () => void;
  hideNoteModal: () => void;

  saveNoteAndAddProcedure: (note: string) => Promise<void>;

  setSelectedProcedure: (proc: Procedure, toothNumber: string) => void;
  clearSelectedProcedure: () => void;

  addProcedureToTooth: (number: string, item: Procedure) => Promise<void>;
  removeProcedureFromTooth: (number: string, index: number) => Promise<void>;

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

      selectedProcedure: null,
      draftProcedure: null,
      noteModalVisible: false,

      // New UI state
      showTable: true,
      toggleTable: () => set((state) => ({ showTable: !state.showTable })),

      setDraftProcedure: (proc, toothNumber) =>
        set({ draftProcedure: { proc, toothNumber } }),
      clearDraftProcedure: () => set({ draftProcedure: null }),
      showNoteModal: () => set({ noteModalVisible: true }),
      hideNoteModal: () => set({ noteModalVisible: false }),

      saveNoteAndAddProcedure: async (note) => {
        const state = get();
        const draft = state.draftProcedure;
        if (!draft) return;

        const now = new Date().toISOString();

        const newProcedure: Procedure = {
          ...draft.proc,
          createdAt: now,
          notes: note,
        };

        const existing = state.teethData[draft.toothNumber] || [];
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
      },

      setSelectedProcedure: (proc, toothNumber) =>
        set({ selectedProcedure: { proc, toothNumber } }),
      clearSelectedProcedure: () => set({ selectedProcedure: null }),

      addProcedureToTooth: async (number, item) => {
        const now = new Date().toISOString();
        const newProcedure = { ...item, createdAt: now, notes: '' };

        const state = get();
        const existing = state.teethData[number] || [];
        const updatedTeethData = {
          ...state.teethData,
          [number]: [...existing, newProcedure],
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

      removeProcedureFromTooth: async (number, index) => {
        const state = get();
        const updated = [...(state.teethData[number] || [])];
        updated.splice(index, 1);

        const updatedTeethData = {
          ...state.teethData,
          [number]: updated,
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
