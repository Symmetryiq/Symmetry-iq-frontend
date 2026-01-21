import { useUser } from '@clerk/clerk-expo';
import { create } from 'zustand';

type AuthState = {
  loading: boolean;
  error: string | null;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  loading: false,
  error: null,

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      console.log('Reset password for', email);
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },

  updateDisplayName: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const { user } = useUser();

      if (user) {
        await user.update({
          firstName: name,
        });
      }
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
