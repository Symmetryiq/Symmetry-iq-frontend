import { RoutineID } from '@/types/routine.types';
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

type RoutineCompletionState = {
  /** dateKey → list of completed routine IDs */
  completions: Record<string, string[]>;
};

type RoutineCompletionActions = {
  markCompleted: (routineId: RoutineID) => void;
  isCompletedToday: (routineId: RoutineID) => boolean;
  isCompletedOnDate: (routineId: RoutineID, dateKey: string) => boolean;
  getCompletedDates: () => Set<string>;
  reset: () => void;
};

const INITIAL: RoutineCompletionState = {
  completions: {},
};

export const useRoutineStore = create<
  RoutineCompletionState & RoutineCompletionActions
>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      markCompleted: (routineId) => {
        const key = todayKey();
        set((s) => {
          const existing = s.completions[key] ?? [];
          if (existing.includes(routineId)) return s;
          return {
            completions: {
              ...s.completions,
              [key]: [...existing, routineId],
            },
          };
        });
      },

      isCompletedToday: (routineId) => {
        const key = todayKey();
        const list = get().completions[key] ?? [];
        return list.includes(routineId);
      },

      isCompletedOnDate: (routineId, dateKey) => {
        const list = get().completions[dateKey] ?? [];
        return list.includes(routineId);
      },

      getCompletedDates: () => {
        return new Set(Object.keys(get().completions));
      },

      reset: () => set(INITIAL),
    }),
    {
      name: 'symmetryiq.routine-completions',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
