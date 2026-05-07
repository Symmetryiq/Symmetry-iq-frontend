import { CLERK_PUBLISHABLE_KEY, SENTRY_DSN } from '@/constants/env';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Slot } from 'expo-router';
import React from 'react';
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://385a2f11b7c6860d02e437fd42462a6a@o4511122627821568.ingest.us.sentry.io/4511122634113024",
  enableLogs: true,
  sendDefaultPii: true,
  debug: true
});

function RootLayout() {
  return (
    <ClerkProvider
      publishableKey="pk_test_ZXBpYy1nYXItODYuY2xlcmsuYWNjb3VudHMuZGV2JA"
      tokenCache={tokenCache}
    >
      <Slot />
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);
