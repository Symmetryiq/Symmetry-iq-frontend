import { COLOR } from '@/constants/theme';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        contentStyle: { backgroundColor: COLOR.background },
        headerStyle: { backgroundColor: COLOR.background },
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerTintColor: COLOR.onBackground,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}

const styles = StyleSheet.create({});
