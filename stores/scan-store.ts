import { getScans, saveScan } from '@/services/api/scan.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Landmark } from 'react-native-mediapipe';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Scan {
  id: string;
  _id: string;
  scores: {
    overallSymmetry: number;
    eyeAlignment: number;
    noseCentering: number;
    facialPuffiness: number;
    skinClarity: number;
    chinAlignment: number;
    facialThirds: number;
    jawlineSymmetry: number;
    cheekboneBalance: number;
    eyebrowSymmetry: number;
  };
  scanDate: string;
}

interface ScanState {
  scans: Scan[];
  latestScan: Scan | null;
  loading: boolean;
  error: string | null;

  // Actions
  saveScanData: (landmarks: Landmark[], scores: any) => Promise<Scan | null>;
  fetchScans: () => Promise<void>;
  clearError: () => void;
  hasScannedToday: () => boolean;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set, get) => ({
      scans: [],
      latestScan: null,
      loading: false,
      error: null,

      saveScanData: async (landmarks, scores) => {
        set({ loading: true, error: null });
        try {
          const result = await saveScan({ landmarks, scores });

          const newScan = result.scan;

          if (!newScan || !newScan.id) {
            throw new Error('Invalid response from server - no scan ID');
          }

          set((state) => ({
            scans: [newScan, ...state.scans],
            latestScan: newScan,
            loading: false,
          }));

          return newScan;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return null;
        }
      },

      fetchScans: async () => {
        set({ loading: true, error: null });
        try {
          const result = await getScans();
          set({ scans: result.scans, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
