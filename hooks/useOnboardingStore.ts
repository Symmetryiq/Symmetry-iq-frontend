import { QUESTIONS } from '@/constants/questions';
import { zustandStorage } from '@/utils/storage.util';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Answers = Record<string, string | string[]>;

type OnboardingState = {
  currentIndex: number;
  answers: Answers;
  completed: boolean;
};

type OnboardingActions = {
  setAnswer: (id: string, value: string | string[]) => void;
  next: () => void;
  back: () => void;
  reset: () => void;
  canContinue: () => boolean;
  completeOnboarding: () => void;
};

const INITIAL: OnboardingState = {
  currentIndex: 0,
  answers: {},
  completed: false,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      ...INITIAL,

      setAnswer: (id, value) =>
        set((s) => ({ answers: { ...s.answers, [id]: value } })),

      next: () =>
        set((s) => {
          const isLast = s.currentIndex >= QUESTIONS.length - 1;
          return isLast ? {} : { currentIndex: s.currentIndex + 1 };
        }),

      completeOnboarding: () => set({ completed: true }),

      back: () =>
        set((s) => ({
          currentIndex: Math.max(0, s.currentIndex - 1),
        })),

      reset: () => set(INITIAL),

      canContinue: () => {
        const { currentIndex, answers } = get();
        const step = QUESTIONS[currentIndex];
        const answer = answers[step.id];

        if (step.type === 'text') {
          return typeof answer === 'string' && answer.trim().length > 0;
        }
        // single or multi
        if (Array.isArray(answer)) return answer.length > 0;
        return typeof answer === 'string' && answer.length > 0;
      },
    }),
    {
      name: 'symmetryiq.onboarding',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
