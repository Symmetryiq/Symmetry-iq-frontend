import { Colors, Radii } from '@/constants/theme';
import { moderateScale } from '@/helpers/scaling';
import React, { useEffect } from 'react';
import { type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface SkeletonProps {
  /** Width — defaults to '100%' */
  width?: number | `${number}%`;
  /** Height — defaults to 16 */
  height?: number;
  /** Border radius — defaults to Radii.sm */
  radius?: number;
  /** Render as a circle (avatar placeholder) */
  circle?: boolean;
  /** Additional style */
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = moderateScale(16),
  radius = Radii.sm,
  circle = false,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, // infinite
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const resolvedSize = circle ? height : undefined;

  return (
    <Animated.View
      style={[
        {
          width: circle ? resolvedSize : width,
          height,
          borderRadius: circle ? height / 2 : radius,
          backgroundColor: Colors.shimmer,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
