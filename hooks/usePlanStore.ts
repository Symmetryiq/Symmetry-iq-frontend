import { ScanScores } from '@/hooks/useScanStore';
import { MonthlyPlan } from '@/types/plan.types';
import { generateMonthlyPlan } from '@/utils/planner.util';
import { zustandStorage } from '@/utils/storage.util';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type PlanState = {
  plan: MonthlyPlan | null;
};

type PlanActions = {
  regenerate: (scores: ScanScores, scanId: string) => void;
  reset: () => void;
};

const INITIAL: PlanState = {
  plan: null,
};

export const usePlanStore = create<PlanState & PlanActions>()(
  persist(
    (set) => ({
      ...INITIAL,

      regenerate: (scores, scanId) => {
        set({ plan: generateMonthlyPlan(scores, scanId) });
      },

      reset: () => set(INITIAL),
    }),
    {
      name: 'symmetryiq.plan',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
