import { zustandStorage } from '@/lib/mmkv';
import { generatePlan, type GeneratedPlan, type Scores } from '@/lib/plan-engine';
import { fetchRemotePlan, syncPlan, syncRoutineComplete } from '@/services/api/plan.api';
import { RoutineId } from '@/data/routines';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Plan extends GeneratedPlan {
  id: string;
  scanId: string;
  status: 'active' | 'completed' | 'replaced';
}

interface PlanState {
  currentPlan: Plan | null;
  /** IDs of routines completed for each date: { "2026-03-15": ["hard-mewing-hold"] } */
  completedRoutines: Record<string, string[]>;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;

  // Actions
  generateNewPlan: (scanId: string, scores: Scores) => Plan;
  fetchCurrentPlan: () => Promise<void>;
  completeRoutine: (routineId: RoutineId, date: string, durationSeconds?: number) => void;
  getRoutinesForDate: (date: string) => { assigned: string[]; completed: string[] };
  clearError: () => void;
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      completedRoutines: {},
      status: 'idle',
      error: null,

      /**
       * Generate a new plan locally from scan scores.
       * The plan is created instantly on-device and synced to backend in background.
       */
      generateNewPlan: (scanId, scores) => {
        const generated = generatePlan(scores);
        const plan: Plan = {
          ...generated,
          id: `plan_${Date.now()}`, // Temporary local ID, replaced by backend on sync
          scanId,
          status: 'active',
        };

        set({ currentPlan: plan, completedRoutines: {}, status: 'success', error: null });

        // Background sync — don't block UI
        syncPlan({ scanId, ...generated }).catch(() => {
          // Will retry on next sync cycle
        });

        return plan;
      },

      /**
       * Hydrate plan from backend (e.g. after reinstall or MMKV wipe).
       * Only needed if local storage is empty.
       */
      fetchCurrentPlan: async () => {
        set({ status: 'loading', error: null });
        try {
          const result = await fetchRemotePlan();
          if (result.plan) {
            set({
              currentPlan: {
                ...result.plan,
                schedule: result.plan.schedule || {},
              },
              status: 'success',
            });
          } else {
            set({ currentPlan: null, status: 'success' });
          }
        } catch (error: any) {
          // No plan is fine — not an error
          if (error.message?.includes('No active plan') || error.message?.includes('404')) {
            set({ currentPlan: null, status: 'idle' });
          } else {
            set({ status: 'error', error: error.message });
          }
        }
      },

      /**
       * Mark a routine as completed. Updates local state instantly,
       * syncs to backend in background.
       */
      completeRoutine: (routineId, date, durationSeconds) => {
        const { currentPlan, completedRoutines } = get();

        // Update local state immediately
        const dayCompleted = completedRoutines[date] || [];
        if (!dayCompleted.includes(routineId)) {
          set({
            completedRoutines: {
              ...completedRoutines,
              [date]: [...dayCompleted, routineId],
            },
          });
        }

        // Background sync
        if (currentPlan) {
          syncRoutineComplete(currentPlan.id, routineId, date, durationSeconds).catch(() => {
            // Will retry on next sync cycle
          });
        }
      },

      /**
       * Get the assigned and completed routines for a specific date.
       */
      getRoutinesForDate: (date) => {
        const { currentPlan, completedRoutines } = get();
        const assigned = currentPlan?.schedule[date] || [];
        const completed = completedRoutines[date] || [];
        return { assigned, completed };
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'plan-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        currentPlan: state.currentPlan,
        completedRoutines: state.completedRoutines,
      }),
    },
  ),
);
