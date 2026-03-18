import React, { useCallback } from 'react';
import { Pressable, View, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { Colors, Spacing, Radii, Animation, Layout } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ChipProps {
  /** Chip label */
  label: string;
  /** Whether the chip is currently selected */
  selected?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Icon element rendered before the label */
  leftIcon?: React.ReactNode;
  /** Disable the chip */
  disabled?: boolean;
  /** Trigger haptic on toggle */
  haptic?: boolean;
  /** Additional style */
  style?: ViewStyle;
}

export function Chip({
  label,
  selected = false,
  onPress,
  leftIcon,
  disabled = false,
  haptic = true,
  style,
}: ChipProps) {
  const scale = useSharedValue(1);
  const selectionAnim = useSharedValue(selected ? 1 : 0);

  // Sync animation value when selected prop changes
  React.useEffect(() => {
    selectionAnim.value = withTiming(selected ? 1 : 0, {
      duration: Animation.duration.fast,
    });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      selectionAnim.value,
      [0, 1],
      [Colors.muted, Colors.primaryLight],
    ),
    borderColor: interpolateColor(
      selectionAnim.value,
      [0, 1],
      [Colors.border, Colors.primary],
    ),
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: Animation.duration.fast });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: Animation.duration.fast });
  }, []);

  const handlePress = useCallback(() => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  }, [haptic, onPress]);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      hitSlop={Layout.hitSlop}
      style={[
        styles.container,
        { opacity: disabled ? 0.45 : 1 },
        animatedStyle,
        style,
      ]}
    >
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <Text
        variant="subtitle2"
        color={selected ? Colors.primary : Colors.onSecondary}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 0,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  icon: {
    marginRight: Spacing.xs,
  },
});
