import { Colors, Fonts } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/onboarding';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

const AppLayout = () => {
  const { onboardingCompleted, setAge, setGender } = useOnboardingStore();
  const { user } = useUser();

  // Sync backend metadata to onboarding store for returning users
  useEffect(() => {
    if (user && user.publicMetadata) {
      const metadata = user.publicMetadata as any;
      if (metadata.age && !useOnboardingStore.getState().age) {
        setAge(metadata.age);
      }
      if (metadata.gender && !useOnboardingStore.getState().gender) {
        setGender(metadata.gender);
      }
    }
  }, [user, setAge, setGender]);
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

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

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" options={{
          headerShown: true,
          headerTitle: 'Sign In',
          headerTitleAlign: 'center',
          headerTintColor: Colors.onBackground,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: Colors.onBackground,
            fontFamily: Fonts.regular
          },
          headerBackButtonDisplayMode: 'default',
        }} />
        <Stack.Screen name="create-account" options={{
          headerShown: true,
          headerTitle: 'Create Account',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTintColor: Colors.onBackground,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            color: Colors.onBackground,
            fontFamily: Fonts.regular
          },
          headerBackButtonDisplayMode: 'default',
        }} />
        <Stack.Screen name="reset-password" options={{
          headerShown: true,
          headerTitle: 'Reset Password',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTintColor: Colors.onBackground,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            color: Colors.onBackground,
            fontFamily: Fonts.regular
          },
          headerBackButtonDisplayMode: 'default',
        }} />
      </Stack.Protected>

      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
};

export default AppLayout;
