import { zustandStorage } from '@/utils/storage.util';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

type TaskState = {
  /** dateKey → list of completed task IDs */
  completions: Record<string, string[]>;
};

type TaskActions = {
  toggleTask: (taskId: string) => void;
  isCompletedToday: (taskId: string) => boolean;
  getTodaysCompletedIds: () => Set<string>;
  reset: () => void;
};

const INITIAL: TaskState = {
  completions: {},
};

export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      toggleTask: (taskId) => {
        const key = todayKey();
        set((s) => {
          const existing = s.completions[key] ?? [];
          const isCompleted = existing.includes(taskId);
          return {
            completions: {
              ...s.completions,
              [key]: isCompleted
                ? existing.filter((id) => id !== taskId)
                : [...existing, taskId],
            },
          };
        });
      },

      isCompletedToday: (taskId) => {
        const key = todayKey();
        const list = get().completions[key] ?? [];
        return list.includes(taskId);
      },

      getTodaysCompletedIds: () => {
        const key = todayKey();
        return new Set(get().completions[key] ?? []);
      },

      reset: () => set(INITIAL),
    }),
    {
      name: 'symmetryiq.task-completions',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
