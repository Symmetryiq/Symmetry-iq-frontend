import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as Sentry from "@sentry/react-native";
import EnvDebug from '@/components/EnvDebug';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",
  enableLogs: true,
  sendDefaultPii: true
});

function RootLayout() {
  const [showDebug, setShowDebug] = useState(true);

  if (showDebug) {
    return <EnvDebug onContinue={() => setShowDebug(false)} />;
  }

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || "" });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || "" });
    } else if (__DEV__) {
      Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY || "" });
    }
  }, []);

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
      tokenCache={tokenCache}
    >
      <Slot />
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);
