import { zustandStorage } from '@/lib/mmkv';
import { getScans, saveScan, type Scores } from '@/services/api/scan.api';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Scan {
  id: string;
  scores: Scores;
  scanDate: string;
}

interface ScanState {
  scans: Scan[];
  latestScan: Scan | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;

  // Actions
  saveScanData: (scores: Scores) => Promise<Scan | null>;
  fetchScans: () => Promise<void>;
  clearError: () => void;
  hasScannedToday: () => boolean;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set, get) => ({
      scans: [],
      latestScan: null,
      status: 'idle',
      error: null,

      saveScanData: async (scores) => {
        set({ status: 'loading', error: null });
        try {
          const result = await saveScan({ scores });

          const newScan = result.scan;

          if (!newScan || !newScan.id) {
            throw new Error('Invalid response from server - no scan ID');
          }

          set((state) => ({
            scans: [newScan, ...state.scans],
            latestScan: newScan,
            status: 'success',
          }));

          return newScan;
        } catch (error: any) {
          set({ status: 'error', error: error.message });
          return null;
        }
      },

      fetchScans: async () => {
        set({ status: 'loading', error: null });
        try {
          const result = await getScans();
          set({ scans: result.scans, status: 'success' });
        } catch (error: any) {
          set({ status: 'error', error: error.message });
        }
      },

      clearError: () => set({ error: null }),

      hasScannedToday: () => {
        const scans = get().scans;
        if (!scans || scans.length === 0) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return scans.some((s) => {
          const d = new Date(s.scanDate);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        });
      },
    }),
    {
      name: 'scan-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
