import { Colors } from '@/constants/theme';
import { configureGoogleAuth } from '@/helpers/auth';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  getLastNotificationResponse,
} from '@/services/notifications';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useOnboardingStore } from '@/stores/onboarding';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { Subscription } from 'expo-notifications';
import { Stack, router } from 'expo-router';
import React, { useEffect, useRef } from 'react';

const AppLayout = () => {
  const { onboardingCompleted } = useOnboardingStore();
  const { user } = useAuthStore();
  const { registerToken, refreshUnreadCount } = useNotificationStore();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    configureGoogleAuth();
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      useAuthStore.setState({ user });
    });

    return unsubscribe;
  }, []);

  // Register push token and setup listeners when user is logged in
  useEffect(() => {
    if (!user) return;

    // Register push token
    registerToken();
    refreshUnreadCount();

    // Listen for notifications received while app is foregrounded
    notificationListener.current = addNotificationReceivedListener((notification) => {
      console.log('📬 Notification received:', notification);
      refreshUnreadCount();
    });

    // Listen for user tapping on a notification
    responseListener.current = addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification tapped:', response);
      const data = response.notification.request.content.data;

      // Navigate to notifications screen
      router.push('/(app)/(tabs)/(home)/notifications');
    });

    // Check if app was opened from a notification
    getLastNotificationResponse().then((response) => {
      if (response) {
        console.log('🚀 App opened from notification:', response);
        router.push('/(app)/(tabs)/(home)/notifications');
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Protected guard={!onboardingCompleted}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="create-account" />
        <Stack.Screen name="reset-password" />
      </Stack.Protected>

      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
};

export default AppLayout;
