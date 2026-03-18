import { create } from 'zustand';

interface AuthState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;

  updateDisplayName: (user: any, name: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'idle',
  error: null,

  /**
   * Update the user's display name via Clerk.
   * The `user` object must be passed from the component (via useUser()).
   * Password reset is handled by Clerk's built-in flow in reset-password.tsx.
   */
  updateDisplayName: async (user: any, name: string) => {
    set({ status: 'loading', error: null });
    try {
      if (user) {
        await user.update({ firstName: name });
        set({ status: 'success' });
      } else {
        set({ status: 'idle' });
      }
    } catch (e: any) {
      set({ status: 'error', error: e.message });
      throw e;
    }
  },

  clearError: () => set({ error: null }),
}));
