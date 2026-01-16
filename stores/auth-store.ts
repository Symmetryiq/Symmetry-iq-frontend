import { handleFirebaseAuthError } from '@/helpers/errors';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import {
  AppleAuthProvider,
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { create } from 'zustand';

type AuthState = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await signInWithEmailAndPassword(getAuth(), email, password);
      set({ user: res.user });
    } catch (e: any) {
      set({ error: handleFirebaseAuthError(e.code) });
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { data } = await GoogleSignin.signIn();

      if (!data?.idToken) throw new Error('Missing Google ID token');

      const googleCredential = GoogleAuthProvider.credential(data.idToken);

      const response = await signInWithCredential(getAuth(), googleCredential);
      set({ user: response.user });
    } catch (e) {
      if (isErrorWithCode(e)) {
        switch (e.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            Alert.alert('User cancelled the login flow. Please try again.');
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            Alert.alert('Sign In already in progress. Please wait.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            Alert.alert(
              'Play services not available or outdated. Please update your play services.'
            );
            break;
          default:
            // some other error happened
            Alert.alert('An unknown error occurred. Please try again later.');
        }
      } else {
        // an error that's not related to google sign in occurred
        Alert.alert(
          "An error that's not related to google sign in occurred. Please try again later."
        );
      }
    } finally {
      set({ loading: false });
    }
  },

  signInWithApple: async () => {
    set({ loading: true, error: null });

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // 2). if the request was successful, extract the token and nonce
      const { identityToken, nonce } = appleAuthRequestResponse;

      if (!identityToken) throw new Error('Missing Apple ID token');

      const appleCredential = AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      const response = await signInWithCredential(getAuth(), appleCredential);

      set({ user: response.user });
    } catch (error: any) {
      Alert.alert('Please try again later.');
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      );
      await updateProfile(res.user, { displayName: name });
      set({ user: res.user });
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await sendPasswordResetEmail(getAuth(), email);
    } catch (e: any) {
      set({ error: e.message });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await GoogleSignin.signOut().catch(() => {});
    await signOut(getAuth());
    set({ user: null });
  },

  updateDisplayName: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        await updateProfile(currentUser, { displayName: name });
        // Force update user state by creating a new reference or reloading
        // Note: currentUser is mutated by updateProfile, but Zustand needs a new obj reference
        // A reload is robust to fetch all claims, but simple object spread usually works for display properties
        set({
          user: { ...currentUser, displayName: name } as FirebaseAuthTypes.User,
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
