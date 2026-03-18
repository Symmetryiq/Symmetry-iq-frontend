import { Animation, Colors, Radii } from '@/constants/theme';
import { moderateScale } from '@/helpers/scaling';
import React, { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface ProgressBarProps {
  /** Progress value from 0 to 1 */
  progress: number;
  /** Bar height — defaults to 6 */
  height?: number;
  /** Fill color — defaults to Colors.primary */
  color?: string;
  /** Track color — defaults to Colors.muted */
  trackColor?: string;
  /** Border radius — defaults to Radii.full */
  radius?: number;
  /** Animate changes */
  animated?: boolean;
  /** Additional style */
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  height = moderateScale(6),
  color = Colors.primary,
  trackColor = Colors.muted,
  radius = Radii.full,
  animated = true,
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const animatedWidth = useSharedValue(clampedProgress);

  useEffect(() => {
    if (animated) {
      animatedWidth.value = withTiming(clampedProgress, {
        duration: Animation.duration.normal,
      });
    } else {
      animatedWidth.value = clampedProgress;
    }
  }, [clampedProgress, animated]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: radius,
          backgroundColor: trackColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            borderRadius: radius,
            backgroundColor: color,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
