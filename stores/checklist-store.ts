import {
  ChecklistTask,
  getChecklist,
  saveChecklist,
} from '@/services/api/checklist.api';
import { create } from 'zustand';

interface ChecklistState {
  tasks: ChecklistTask[];
  loading: boolean;
  error: string | null;
  currentDate: string; // YYYY-MM-DD

  // Actions
  fetchChecklist: (date: string) => Promise<void>;
  updateTask: (index: number, completed: boolean) => void;
  saveToBackend: () => Promise<void>;
  clearError: () => void;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  currentDate: formatDate(new Date()),

  fetchChecklist: async (date) => {
    set({ loading: true, error: null, currentDate: date });
    try {
      const result = await getChecklist(date);
      set({ tasks: result.checklist.tasks, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateTask: (index, completed) => {
    set((state) => {
      const updatedTasks = [...state.tasks];
      if (updatedTasks[index]) {
        updatedTasks[index] = { ...updatedTasks[index], completed };
      }
      return { tasks: updatedTasks };
    });

    // Auto-save after update
    setTimeout(() => get().saveToBackend(), 500);
  },

  saveToBackend: async () => {
    const { tasks, currentDate } = get();
    try {
      await saveChecklist(currentDate, tasks);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  clearError: () => set({ error: null }),
}));
