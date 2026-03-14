import { Colors } from "@/constants/theme";
import { useSignInWithApple } from "@clerk/expo/apple";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import Button from "../common/button";
import Typography from "../common/typography";
import AppleIcon from "../icons/apple-icon";

const AppleButton = ({
  onSignInComplete,
}: {
  onSignInComplete?: () => void;
}) => {
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const router = useRouter();

  if (Platform.OS !== "ios") return null;

  const handleAppleSignIn = async () => {
    try {
      const { createdSessionId, setActive } =
        await startAppleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });

        if (onSignInComplete) {
          onSignInComplete();
        }
      }
    } catch (err: any) {
      if (err.code === "ERR_REQUEST_CANCELED") return;

      Alert.alert(
        "Error",
        err.message || "An error occurred during Apple sign-in",
      );
      console.error("Sign in with Apple error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <Button style={styles.button} onPress={handleAppleSignIn}>
      <AppleIcon size={24} color="#ffffff" />
      <Typography color="onSecondary" font="semiBold">
        Continue with Apple
      </Typography>
    </Button>
  );
};

export default AppleButton;

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
