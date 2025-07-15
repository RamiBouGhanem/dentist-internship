import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getAllPatients,
  getPatientById,
  updatePatientProcedures
} from '../api/patientApi';

// Types
export interface Procedure {
  type: string;
  color: string;
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

// Zustand Store Interface
interface ToothStore {
  teethData: Record<string, Procedure[]>;
  patientId: string | null;
  patients: Patient[];

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

      addProcedureToTooth: async (number, item) => {
        const state = get();
        const existing = state.teethData[number] || [];
        const updatedTeethData = {
          ...state.teethData,
          [number]: [...existing, item],
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
