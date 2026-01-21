import { Colors, Fonts } from '@/constants/theme';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: Colors.onCard,
        headerStyle: {
          backgroundColor: Colors.card,
        },
        headerTitleStyle: {
          fontFamily: Fonts.regular
        },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: 'Settings' }} />
      <Stack.Screen name="profile" options={{ headerTitle: 'Edit Profile' }} />
      <Stack.Screen name="preferences" options={{ headerTitle: 'Preferences' }} />
    </Stack>
  );
}
