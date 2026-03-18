import {
  Animation,
  Colors,
  Layout,
  Radii
} from '@/constants/theme';
import { moderateScale } from '@/helpers/scaling';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import {
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconButtonVariant = 'solid' | 'ghost' | 'outline' | 'soft';
type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  /** Icon element (ReactNode) */
  icon: React.ReactNode;
  /** Visual variant */
  variant?: IconButtonVariant;
  /** Size preset */
  size?: IconButtonSize;
  /** Trigger haptic feedback */
  haptic?: boolean;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom border radius — defaults to Radii.md */
  radius?: number;
  /** Additional style */
  style?: ViewStyle;
}

const sizeMap: Record<IconButtonSize, number> = {
  sm: moderateScale(34),
  md: moderateScale(42),
  lg: moderateScale(50),
};

function getVariantStyle(variant: IconButtonVariant) {
  switch (variant) {
    case 'solid':
      return { bg: Colors.primary, borderColor: 'transparent', borderWidth: 0 };
    case 'outline':
      return { bg: 'transparent', borderColor: Colors.border, borderWidth: 1.5 };
    case 'ghost':
      return { bg: 'transparent', borderColor: 'transparent', borderWidth: 0 };
    case 'soft':
      return { bg: Colors.primaryLight, borderColor: 'transparent', borderWidth: 0 };
  }
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  haptic = true,
  disabled = false,
  backgroundColor,
  radius = Radii.md,
  style,
  onPress,
  ...rest
}: IconButtonProps) {
  const scale = useSharedValue(1);
  const dim = sizeMap[size];
  const variantStyle = getVariantStyle(variant);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.9, { duration: Animation.duration.fast });
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

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      hitSlop={Layout.hitSlop}
      style={[
        styles.container,
        {
          width: dim,
          height: dim,
          borderRadius: radius,
          backgroundColor: backgroundColor ?? variantStyle.bg,
          borderColor: variantStyle.borderColor,
          borderWidth: variantStyle.borderWidth,
          opacity: disabled ? 0.45 : 1,
        },
        animatedStyle,
        style,
      ]}
      {...rest}
    >
      {icon}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
