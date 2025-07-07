// src/store/useToothStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useToothStore = create(persist(
  (set) => ({
    teethData: {},
    addProcedureToTooth: (number, item) =>
      set((state) => {
        const existing = state.teethData[number] || [];
        return {
          teethData: {
            ...state.teethData,
            [number]: [...existing, item]
          }
        };
      }),
    removeProcedureFromTooth: (number, index) =>
      set((state) => {
        const updated = [...(state.teethData[number] || [])];
        updated.splice(index, 1);
        return {
          teethData: {
            ...state.teethData,
            [number]: updated
          }
        };
      })
  }),
  {
    name: 'teeth-storage'
  }
));