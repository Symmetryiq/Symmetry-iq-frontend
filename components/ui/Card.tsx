import { Animation, Colors, Radii, Shadows, Spacing } from '@/constants/theme';
import React, { useCallback } from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CardVariant = 'filled' | 'outlined' | 'elevated';

export interface CardProps {
  children: React.ReactNode;
  /** Visual variant */
  variant?: CardVariant;
  /** Make the card pressable with animated scale */
  pressable?: boolean;
  /** Press handler (only works when pressable) */
  onPress?: () => void;
  /** Padding override — defaults to Spacing.lg */
  padding?: number;
  /** Border radius override — defaults to Radii.lg */
  radius?: number;
  /** Custom background color */
  backgroundColor?: string;
  /** Additional style */
  style?: ViewStyle;
}

function getVariantStyle(variant: CardVariant) {
  switch (variant) {
    case 'filled':
      return {
        backgroundColor: Colors.card,
        borderWidth: 0,
        borderColor: 'transparent',
      };
    case 'outlined':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.border,
      };
    case 'elevated':
      return {
        backgroundColor: Colors.card,
        borderWidth: 0,
        borderColor: 'transparent',
        ...Shadows.md,
      };
  }
}

export function Card({
  children,
  variant = 'filled',
  pressable = false,
  onPress,
  padding = Spacing.lg,
  radius = Radii.lg,
  backgroundColor,
  style,
}: CardProps) {
  const scale = useSharedValue(1);
  const variantStyle = getVariantStyle(variant);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (pressable) {
      scale.value = withTiming(0.98, { duration: Animation.duration.fast });
    }
  }, [pressable]);

  const handlePressOut = useCallback(() => {
    if (pressable) {
      scale.value = withTiming(1, { duration: Animation.duration.fast });
    }
  }, [pressable]);

  const containerStyle: ViewStyle[] = [
    {
      padding,
      borderRadius: radius,
      ...variantStyle,
    },
    backgroundColor ? { backgroundColor } : {},
    style ?? {},
  ];

  if (pressable) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[containerStyle, animatedStyle]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View style={containerStyle}>
      {children}
    </Animated.View>
  );
}
