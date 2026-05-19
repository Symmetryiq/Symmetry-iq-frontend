import { ClerkProvider, useAuth, useUser } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { usePurchasesStore } from '@/hooks/usePurchasesStore';
import { COLOR } from '@/constants/theme';
import { useNotificationListener } from '@/hooks/useNotificationListener';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  enableLogs: true,
  sendDefaultPii: true,
});

function getRevenueCatKey(): string {
  // if (__DEV__) {
  //   return process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY || '';
  // }
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '';
  }
  return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '';
}

function RootLayout() {
  useEffect(() => {
    // if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    const apiKey = getRevenueCatKey();
    if (!apiKey) {
      console.warn('[Purchases] No RevenueCat API key configured for this env');
      return;
    }
    Purchases.configure({ apiKey });
  }, []);

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
      tokenCache={tokenCache}
    >
      <RootComponent />
    </ClerkProvider>
  );
}

function RootComponent() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { completed: hasOnboarded } = useOnboardingStore();
  const setCustomerInfo = usePurchasesStore((s) => s.setCustomerInfo);

  useNotificationListener();

  // useEffect(() => {
  //   if (!userLoaded) return;
  //   (async () => {
  //     try {
  //       if (user?.id) {
  //         const { customerInfo } = await Purchases.logIn(user.id);
  //         setCustomerInfo(customerInfo);
  //       } else {
  //         try {
  //           await Purchases.logOut();
  //         } catch {
  //           return;
  //         }
  //         setCustomerInfo(await Purchases.getCustomerInfo());
  //       }
  //     } catch (e) {
  //       console.warn('[Purchases] identify failed', e);
  //     }
  //   })();
  // }, [user?.id, userLoaded, setCustomerInfo]);

  useEffect(() => {
    const listener = Purchases.addCustomerInfoUpdateListener(setCustomerInfo);
    return () => {
      // SDK returns void for add; remove takes the original handler.
      Purchases.removeCustomerInfoUpdateListener(setCustomerInfo);
    };
  }, [setCustomerInfo]);

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: COLOR.background },
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!hasOnboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={hasOnboarded && !isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={hasOnboarded && !!isSignedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);
