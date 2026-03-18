import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { Colors, Layout } from '@/constants/theme';

export interface ScreenWrapperProps {
  /** Child content */
  children: React.ReactNode;
  /** Which edges to apply safe area insets — defaults to all */
  edges?: Edge[];
  /** Enable scrolling content */
  scroll?: boolean;
  /** Enable keyboard avoidance */
  keyboardAvoiding?: boolean;
  /** Extra keyboard vertical offset */
  keyboardOffset?: number;
  /** Apply horizontal screen padding */
  padded?: boolean;
  /** Custom background color — defaults to Colors.background */
  backgroundColor?: string;
  /** StatusBar bar style */
  statusBarStyle?: 'light-content' | 'dark-content';
  /** Custom container style */
  style?: ViewStyle;
  /** Custom content container style (for ScrollView) */
  contentContainerStyle?: ViewStyle;
}

export function ScreenWrapper({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  scroll = false,
  keyboardAvoiding = true,
  keyboardOffset = 0,
  padded = true,
  backgroundColor = Colors.background,
  statusBarStyle = 'light-content',
  style,
  contentContainerStyle,
}: ScreenWrapperProps) {
  const paddingHorizontal = padded ? Layout.screenPadding : 0;

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bounces
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, { paddingHorizontal }, style]}>
      {children}
    </View>
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardOffset}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.fill, { backgroundColor }]}
    >
      <StatusBar barStyle={statusBarStyle} />
      {wrapped}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
