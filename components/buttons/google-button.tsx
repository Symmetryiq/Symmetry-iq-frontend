import { Colors } from "@/constants/theme";
import { useSignInWithGoogle } from "@clerk/expo/google";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import Button from "../common/button";
import Typography from "../common/typography";
import GoogleIcon from "../icons/google-icon";

interface GoogleSignInButtonProps {
  onSignInComplete?: () => void;
  showDivider?: boolean;
}

const GoogleButton = ({
  onSignInComplete,
  showDivider = true,
}: GoogleSignInButtonProps) => {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const router = useRouter();

  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } =
        await startGoogleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });

        if (onSignInComplete) {
          onSignInComplete();
        } else {
          router.replace("/");
        }
      }
    } catch (err: any) {
      if (err.code === "SIGN_IN_CANCELLED" || err.code === "-5") {
        return;
      }

      Alert.alert(
        "Error",
        err.message || "An error occurred during Google sign-in",
      );
      console.error("Sign in with Google error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <Button style={styles.button} onPress={handleGoogleSignIn}>
      <GoogleIcon size={24} />
      <Typography color="onSecondary" font="semiBold">
        Continue with Google
      </Typography>
    </Button>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 28,
  },
});
