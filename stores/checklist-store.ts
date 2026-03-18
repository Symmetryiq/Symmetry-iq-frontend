import { zustandStorage } from '@/lib/mmkv';
import { getChecklist, saveChecklist } from '@/services/api/checklist.api';
import { DailyChecklistTasks, type ChecklistTaskDef } from '@/data/checklist';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ChecklistTask extends ChecklistTaskDef {
  completed: boolean;
}

interface ChecklistState {
  tasks: ChecklistTask[];
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  currentDate: string;

  // Actions
  fetchChecklist: (date: string) => Promise<void>;
  updateTask: (taskId: string, completed: boolean) => void;
  saveToBackend: () => Promise<void>;
  clearError: () => void;
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      tasks: DailyChecklistTasks.map((t) => ({ ...t, completed: false })),
      status: 'idle',
      error: null,
      currentDate: formatDate(new Date()),

      fetchChecklist: async (date) => {
        set({ status: 'loading', error: null, currentDate: date });
        try {
          const result = await getChecklist(date);
          const completedTaskIds: string[] =
            result.checklist?.completedTaskIds || [];

          set({
            tasks: DailyChecklistTasks.map((t) => ({
              ...t,
              completed: completedTaskIds.includes(t.id),
            })),
            status: 'success',
          });
        } catch (error: any) {
          set({ status: 'error', error: error.message });
        }
      },

      updateTask: (taskId, completed) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, completed } : t,
          ),
        }));

        // Auto-save after update (debounced)
        setTimeout(() => get().saveToBackend(), 500);
      },

      saveToBackend: async () => {
        const { tasks, currentDate } = get();
        try {
          const completedTaskIds = tasks
            .filter((t) => t.completed)
            .map((t) => t.id);
          await saveChecklist(currentDate, completedTaskIds);
        } catch (error: any) {
          // Silent fail — data is persisted locally via MMKV
          set({ error: error.message });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'checklist-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        currentDate: state.currentDate,
      }),
    },
  ),
);
