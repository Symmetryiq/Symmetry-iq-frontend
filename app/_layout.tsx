import { ClerkProvider, useAuth, useUser } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import Purchases from 'react-native-purchases';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { usePurchasesStore } from '@/hooks/usePurchasesStore';
import { COLOR } from '@/constants/theme';
import { useNotificationListener } from '@/hooks/useNotificationListener';
import { ForceUpdateGate } from '@/components/ForceUpdateGate';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  environment: __DEV__ ? 'development' : 'production',
  debug: __DEV__,
  enableLogs: false,
  sendDefaultPii: false,
  tracesSampleRate: __DEV__ ? 1.0 : 0.1,
});

function getRevenueCatKey(): string {
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY || '';
  }
  return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY || '';
}

function RootLayout() {
  useEffect(() => {
    const apiKey = getRevenueCatKey();
    if (!apiKey) {
      Sentry.captureMessage(
        `Missing RevenueCat API key for ${Platform.OS}`,
        'error',
      );
      return;
    }
    Purchases.configure({ apiKey });
  }, []);

  return (
    <ForceUpdateGate>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ''}
        tokenCache={tokenCache}
      >
        <RootComponent />
      </ClerkProvider>
    </ForceUpdateGate>
  );
}

function RootComponent() {
  const { isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { completed: hasOnboarded } = useOnboardingStore();
  const setCustomerInfo = usePurchasesStore((s) => s.setCustomerInfo);
  const customerInfoLoaded = usePurchasesStore((s) => s.customerInfoLoaded);
  const isPremium = usePurchasesStore((s) => s.isPremium);

  useNotificationListener();

  // Identify the current user with RevenueCat and refresh customerInfo whenever
  // the Clerk session changes. logIn/logOut also seeds the listener below.
  useEffect(() => {
    if (!authLoaded || !userLoaded) return;
    let cancelled = false;
    (async () => {
      try {
        if (user?.id) {
          const { customerInfo } = await Purchases.logIn(user.id);
          if (!cancelled) setCustomerInfo(customerInfo);
        } else {
          try {
            await Purchases.logOut();
          } catch {
            // Already anonymous — safe to ignore.
          }
          const customerInfo = await Purchases.getCustomerInfo();
          if (!cancelled) setCustomerInfo(customerInfo);
        }
      } catch (e) {
        Sentry.captureException(e);
        if (!cancelled) setCustomerInfo(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoaded, userLoaded, setCustomerInfo]);

  useEffect(() => {
    Purchases.addCustomerInfoUpdateListener(setCustomerInfo);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(setCustomerInfo);
    };
  }, [setCustomerInfo]);

  // Hold routing until we know auth state AND the user's entitlement status —
  // otherwise an anonymous paid user would briefly land on the paywall on
  // cold launch before customerInfo resolves.
  const ready = authLoaded && userLoaded && customerInfoLoaded;

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLOR.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={COLOR.primaryLight} />
      </View>
    );
  }

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

      <Stack.Protected guard={hasOnboarded && !isPremium}>
        <Stack.Screen name="paywall" />
      </Stack.Protected>

      <Stack.Protected guard={hasOnboarded && isPremium}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      {/* Auth is reachable on demand from Settings via router.push.
          Never a forced gate — required by App Store Guideline 5.1.1(v). */}
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default Sentry.wrap(RootLayout);
