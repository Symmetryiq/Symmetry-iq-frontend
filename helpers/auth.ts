import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleAuth() {
  GoogleSignin.configure({
    webClientId: '460134598118-8e5q5uvibaorq77g564070cmchns9as3.apps.googleusercontent.com',
    offlineAccess: false,
  });
}

export async function onGoogleButtonPress(user: FirebaseAuthTypes.User | null) {
  if (user) return null;

  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    })

    const { type, data } = await GoogleSignin.signIn()

    /**
     * @type can be "cancelled" in which can @data will be 'null'; 
     * If @type is "success" then @data will be:
     * user: {
            id: string;
            name: string | null;
            email: string;
            photo: string | null;
            familyName: string | null;
            givenName: string | null;
        };
        scopes: string[];
        idToken: string | null;
        serverAuthCode: string | null;
     */

    if (type === 'success') {
      // const { id, name, email, photo, familyName, givenName } = data.user;
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } else if (type === 'cancelled') {
      // When the user cancels the flow for any operation that requires user interaction.
      return; // do nothing
    }

  } catch (error) {
    console.error('ERROR: ', error);
    return error;
  }
}