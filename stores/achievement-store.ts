import { zustandStorage } from '@/lib/mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AchievementState {
  unlockedIds: string[];
  unlockedAt: Record<string, string>; // { "first_scan": "2026-03-15T10:30:00Z" }
  newlyUnlocked: string[]; // IDs of achievements the user hasn't seen yet

  // Actions
  unlock: (id: string) => void;
  acknowledge: (id: string) => void;
  isUnlocked: (id: string) => boolean;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedIds: [],
      unlockedAt: {},
      newlyUnlocked: [],

      unlock: (id) => {
        const { unlockedIds, unlockedAt } = get();
        if (unlockedIds.includes(id)) return;

        set({
          unlockedIds: [...unlockedIds, id],
          unlockedAt: { ...unlockedAt, [id]: new Date().toISOString() },
          newlyUnlocked: [...get().newlyUnlocked, id],
        });
      },

      acknowledge: (id) => {
        set((state) => ({
          newlyUnlocked: state.newlyUnlocked.filter((i) => i !== id),
        }));
      },

      isUnlocked: (id) => get().unlockedIds.includes(id),
    }),
    {
      name: 'achievement-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
