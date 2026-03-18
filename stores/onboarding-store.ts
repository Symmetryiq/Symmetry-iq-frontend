import { zustandStorage } from '@/lib/mmkv';
import { Landmark } from 'react-native-mediapipe';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Gender = 'male' | 'female' | null;
export type SleepPosition = 'back' | 'side' | 'stomach' | null;
export type DietType = 'mostly-junky' | 'mixed' | 'clean' | null;
export type ChewingSide = 'left' | 'right' | 'balanced' | null;
export type ConfidenceLevel =
  | 'love-it'
  | 'like-it'
  | 'dislike-it'
  | 'avoid-photos'
  | null;
export type CommitmentLevel =
  | 'yes-committed'
  | 'no-surgery'
  | 'no-stay-uneven'
  | null;

export interface OnboardingState {
  // Personal info
  name: string;
  age: string;
  gender: Gender;

  // Goals and preferences
  goals: number[]; // Indices of selected goals
  sleepPosition: SleepPosition;
  dietType: DietType;
  chewingSide: ChewingSide;

  // Psychological factors
  confidenceLevel: ConfidenceLevel;
  impactFactors: number[]; // Indices of selected impact factors
  commitmentLevel: CommitmentLevel;

  // Rating
  rating: number | null;

  onboardingCompleted: boolean;

  // Demo scan data
  demoLandmarks: Landmark[] | null;
  demoScores: any | null;
  demoImage: string | null;

  // Actions
  setName: (name: string) => void;
  setAge: (age: string) => void;
  setGender: (gender: Gender) => void;
  setGoals: (goals: number[]) => void;
  setSleepPosition: (position: SleepPosition) => void;
  setDietType: (diet: DietType) => void;
  setChewingSide: (side: ChewingSide) => void;
  setConfidenceLevel: (level: ConfidenceLevel) => void;
  setImpactFactors: (factors: number[]) => void;
  setCommitmentLevel: (level: CommitmentLevel) => void;
  setRating: (rating: number | null) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setDemoScan: (
    landmarks: Landmark[] | null,
    scores: any | null,
    image: string | null,
  ) => void;
  reset: () => void;
}

const initialState = {
  name: '',
  age: '',
  gender: null as Gender,
  goals: [] as number[],
  sleepPosition: null as SleepPosition,
  dietType: null as DietType,
  chewingSide: null as ChewingSide,
  confidenceLevel: null as ConfidenceLevel,
  impactFactors: [] as number[],
  commitmentLevel: null as CommitmentLevel,
  rating: null as number | null,
  onboardingCompleted: false,
  demoLandmarks: null as Landmark[] | null,
  demoScores: null as any | null,
  demoImage: null as string | null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setName: (name) => set({ name }),
      setAge: (age) => set({ age }),
      setGender: (gender) => set({ gender }),
      setGoals: (goals) => set({ goals }),
      setSleepPosition: (sleepPosition) => set({ sleepPosition }),
      setDietType: (dietType) => set({ dietType }),
      setChewingSide: (chewingSide) => set({ chewingSide }),
      setConfidenceLevel: (confidenceLevel) => set({ confidenceLevel }),
      setImpactFactors: (impactFactors) => set({ impactFactors }),
      setCommitmentLevel: (commitmentLevel) => set({ commitmentLevel }),
      setRating: (rating) => set({ rating }),
      setOnboardingCompleted: (onboardingCompleted) =>
        set({ onboardingCompleted }),
      setDemoScan: (demoLandmarks, demoScores, demoImage) =>
        set({ demoLandmarks, demoScores, demoImage }),
      reset: () => set(initialState),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        name: state.name,
        age: state.age,
        gender: state.gender,
        goals: state.goals,
        sleepPosition: state.sleepPosition,
        dietType: state.dietType,
        chewingSide: state.chewingSide,
        confidenceLevel: state.confidenceLevel,
        impactFactors: state.impactFactors,
        commitmentLevel: state.commitmentLevel,
        rating: state.rating,
        onboardingCompleted: state.onboardingCompleted,
        demoLandmarks: state.demoLandmarks,
        demoScores: state.demoScores,
        demoImage: state.demoImage,
      }),
    },
  ),
);
