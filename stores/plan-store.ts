import { RoutineId } from '@/data/routines';
import {
  generatePlan,
  getCurrentPlan,
  markRoutineComplete,
} from '@/services/api/plan.api';
import { create } from 'zustand';

interface DailyRoutine {
  date: string;
  routineId: RoutineId;
  completed: boolean;
  completedAt?: string;
}

interface Plan {
  _id: string;
  userId: string;
  scanId: string;
  startDate: string;
  endDate: string;
  dailyRoutines: DailyRoutine[];
  bonusRoutines: RoutineId[];
}

interface PlanState {
  currentPlan: Plan | null;
  loading: boolean;
  error: string | null;
  selectedDate: Date;

  // Actions
  fetchCurrentPlan: () => Promise<void>;
  generateNewPlan: (scanId: string) => Promise<void>;
  selectDate: (date: Date) => void;
  completeRoutine: (routineId: RoutineId, date?: Date) => Promise<void>;
  clearError: () => void;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  currentPlan: null,
  loading: false,
  error: null,
  selectedDate: new Date(),

  fetchCurrentPlan: async () => {
    set({ loading: true, error: null });
    try {
      const result = await getCurrentPlan();
      set({ currentPlan: result.plan, loading: false });
    } catch (error: any) {
      // No active plan is not an error worth showing
      if (error.message.includes('No active plan')) {
        set({ currentPlan: null, loading: false });
      } else {
        set({ error: error.message, loading: false });
      }
    }
  },

  generateNewPlan: async (scanId) => {
    set({ loading: true, error: null });
    try {
      const result = await generatePlan(scanId);
      set({ currentPlan: result.plan, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  selectDate: (date) => {
    set({ selectedDate: date });
  },

  completeRoutine: async (routineId, date) => {
    const { currentPlan } = get();
    if (!currentPlan) return;

    set({ loading: true, error: null });
    try {
      // If date is provided, use it. Otherwise use today.
      const targetDateStr = date
        ? date.toISOString()
        : new Date().toISOString(); // Note: This might need format adjustment based on how 'date' string is stored in DB

      // The backend expects full ISO or parsable string.
      // Our local `dr.date` is likely a string from JSON.

      await markRoutineComplete(currentPlan._id, routineId, targetDateStr);

      // Update local state
      set((state) => {
        if (!state.currentPlan) return state;

        const updatedRoutines = state.currentPlan.dailyRoutines.map((dr) => {
          // Check if this is the routine we want to complete
          const isSameRoutine = dr.routineId === routineId;

          // Check date if provided.
          // We need to compare just the day part usually.
          const drDate = new Date(dr.date);
          drDate.setHours(0, 0, 0, 0);

          const target = new Date(targetDateStr);
          target.setHours(0, 0, 0, 0);

          const isSameDate = drDate.getTime() === target.getTime();

          if (isSameRoutine && isSameDate) {
            return {
              ...dr,
              completed: true,
              completedAt: new Date().toISOString(),
            };
          }
          return dr;
        });

        return {
          currentPlan: {
            ...state.currentPlan,
            dailyRoutines: updatedRoutines,
          },
          loading: false,
        };
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
