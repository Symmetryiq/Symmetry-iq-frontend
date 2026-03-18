import {
  Animation,
  Colors,
  Layout,
  Radii,
  Spacing,
  Typography,
} from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from './Text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Types ──────────────────────────────────────────────────────────────────────
type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button label text */
  label: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Icon element rendered before the label */
  leftIcon?: React.ReactNode;
  /** Icon element rendered after the label */
  rightIcon?: React.ReactNode;
  /** Show loading spinner and disable interactions */
  loading?: boolean;
  /** Stretch to full container width */
  fullWidth?: boolean;
  /** Trigger haptic feedback on press */
  haptic?: boolean;
  /** Custom background color (overrides variant) */
  backgroundColor?: string;
  /** Custom text color (overrides variant) */
  textColor?: string;
  /** Custom border radius */
  radius?: number;
  /** Additional style */
  style?: ViewStyle;
}

// ─── Size Config ────────────────────────────────────────────────────────────────
const sizeConfig: Record<ButtonSize, {
  paddingVertical: number;
  paddingHorizontal: number;
  iconGap: number;
  typographyVariant: keyof typeof Typography;
}> = {
  sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    iconGap: Spacing.xs,
    typographyVariant: 'caption',
  },
  md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    iconGap: Spacing.sm,
    typographyVariant: 'button',
  },
  lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    iconGap: Spacing.sm,
    typographyVariant: 'button',
  },
};

// ─── Variant Colors ─────────────────────────────────────────────────────────────
function getVariantStyles(variant: ButtonVariant, disabled: boolean) {
  const opacity = disabled ? 0.45 : 1;

  switch (variant) {
    case 'solid':
      return {
        bg: Colors.primary,
        text: Colors.onPrimary,
        borderColor: 'transparent',
        borderWidth: 0,
        opacity,
      };
    case 'outline':
      return {
        bg: 'transparent',
        text: Colors.primary,
        borderColor: Colors.primary,
        borderWidth: 1.5,
        opacity,
      };
    case 'ghost':
      return {
        bg: 'transparent',
        text: Colors.primary,
        borderColor: 'transparent',
        borderWidth: 0,
        opacity,
      };
    case 'soft':
      return {
        bg: Colors.primaryLight,
        text: Colors.primary,
        borderColor: 'transparent',
        borderWidth: 0,
        opacity,
      };
  }
}

// ─── Component ──────────────────────────────────────────────────────────────────
export function Button({
  label,
  variant = 'solid',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  haptic = true,
  backgroundColor,
  textColor,
  radius,
  style,
  onPress,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;
  const sizePreset = sizeConfig[size];
  const variantStyle = getVariantStyles(variant, isDisabled);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: Animation.duration.fast });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: Animation.duration.fast });
  }, []);

  const handlePress = useCallback(
    (e: any) => {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.(e);
    },
    [haptic, onPress],
  );

  const resolvedBg = backgroundColor ?? variantStyle.bg;
  const resolvedText = textColor ?? variantStyle.text;
  const resolvedRadius = radius ?? Radii.md;

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={isDisabled}
      hitSlop={Layout.hitSlop}
      style={[
        styles.base,
        {
          backgroundColor: resolvedBg,
          borderColor: variantStyle.borderColor,
          borderWidth: variantStyle.borderWidth,
          borderRadius: resolvedRadius,
          paddingVertical: sizePreset.paddingVertical,
          paddingHorizontal: sizePreset.paddingHorizontal,
          opacity: variantStyle.opacity,
        },
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={resolvedText} size="small" />
      ) : (
        <>
          {leftIcon && (
            <Animated.View style={{ marginRight: sizePreset.iconGap }}>
              {leftIcon}
            </Animated.View>
          )}
          <Text
            variant={sizePreset.typographyVariant}
            color={resolvedText}
            numberOfLines={1}
          >
            {label}
          </Text>
          {rightIcon && (
            <Animated.View style={{ marginLeft: sizePreset.iconGap }}>
              {rightIcon}
            </Animated.View>
          )}
        </>
      )}
    </AnimatedPressable>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
});
