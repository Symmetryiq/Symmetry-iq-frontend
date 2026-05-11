import { COLOR } from '@/constants/theme';
import { useNotificationListener } from '@/hooks/useNotificationListener';
import { useOnboardingStore } from '@/hooks/useOnboardingStore';
import { useAuth } from '@clerk/expo';
import { Stack } from 'expo-router';
import React from 'react';

// TODO: re-enable when RevenueCat is wired with a release-store key.
// import { usePurchasesBootstrap } from '@/hooks/usePurchasesBootstrap';

export default function AppLayout() {
  const { isSignedIn } = useAuth();
  const { completed: hasOnboarded } = useOnboardingStore();

  useNotificationListener();
  // usePurchasesBootstrap();

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

      <Stack.Protected guard={!isSignedIn && hasOnboarded}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      <Stack.Protected guard={!!isSignedIn && hasOnboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: 'formSheet',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="score/[id]"
          options={{
            presentation: 'formSheet',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="routine/[id]"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="tip/[id]"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
