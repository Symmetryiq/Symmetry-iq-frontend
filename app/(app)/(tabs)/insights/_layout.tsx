import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';

export default function RoutinesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[factor]" />
    </Stack>
  );
}
