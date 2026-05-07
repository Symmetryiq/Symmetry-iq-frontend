import { FeatureID } from '@/types/feature.types';
import { zustandStorage } from '@/utils/storage.util';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ScanScores = Record<FeatureID, number>;

export type ScanRecord = {
  id: string;
  imageUri: string;
  scores: ScanScores;
  createdAt: string;
};

type ScanState = {
  currentScan: ScanRecord | null;
  history: ScanRecord[];
};

type ScanActions = {
  saveScan: (imageUri: string, scores: ScanScores) => void;
  clearCurrentScan: () => void;
  reset: () => void;
};

function generateScanId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const INITIAL: ScanState = {
  currentScan: null,
  history: [],
};

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getScanDates(history: ScanRecord[]): Set<string> {
  return new Set(history.map((s) => s.createdAt.slice(0, 10)));
}

export function getScanForDate(
  history: ScanRecord[],
  dateKey: string,
): ScanRecord | null {
  return history.find((s) => s.createdAt.startsWith(dateKey)) ?? null;
}

export function hasScannedToday(history: ScanRecord[]): boolean {
  const todayKey = toDateKey(new Date());
  return history.some((s) => s.createdAt.startsWith(todayKey));
}

export function getTodaysScan(history: ScanRecord[]): ScanRecord | null {
  const todayKey = toDateKey(new Date());
  return history.find((s) => s.createdAt.startsWith(todayKey)) ?? null;
}

export const useScanStore = create<ScanState & ScanActions>()(
  persist(
    (set) => ({
      ...INITIAL,

      saveScan: (imageUri, scores) => {
        const record: ScanRecord = {
          id: generateScanId(),
          imageUri,
          scores,
          createdAt: new Date().toISOString(),
        };

        set((s) => ({
          currentScan: record,
          history: [record, ...s.history],
        }));
      },

      clearCurrentScan: () => set({ currentScan: null }),

      reset: () => set(INITIAL),
    }),
    {
      name: 'symmetryiq.scans',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
