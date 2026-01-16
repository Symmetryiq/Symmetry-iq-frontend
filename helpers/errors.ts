export function handleFirebaseAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';

    case 'auth/network-request-failed':
      return 'Network error. Check your connection';

    case 'auth/email-already-in-use':
      return 'An account with this email already exists';

    case 'auth/weak-password':
      return 'Password must be at least 6 characters';

    default:
      return 'Something went wrong. Please try again';
  }
}
