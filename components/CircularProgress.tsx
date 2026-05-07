import { COLOR, FONT } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CircularProgressProps = {
  /** Progress value 0–100 */
  value: number;
  /** Outer diameter of the component (default: 180) */
  size?: number;
  /** Thickness of the progress ring (default: 12) */
  strokeWidth?: number;
  /** Primary gradient start color */
  color?: string;
  /** Primary gradient end color (creates a gradient along the arc) */
  colorEnd?: string;
  /** Track (background ring) color */
  trackColor?: string;
  /** Animation duration in ms (default: 1200) */
  duration?: number;
  /** Animation delay in ms (default: 200) */
  delay?: number;
  /** Label shown below the value (e.g. "Overall") */
  label?: string;
  /** Custom render for the center content */
  renderCenter?: (animatedValue: number) => React.ReactNode;
  /** Show the percentage symbol (default: true) */
  showPercent?: boolean;
};

const CircularProgress = ({
  value,
  size = 180,
  strokeWidth = 12,
  color = COLOR.primary,
  colorEnd = COLOR.primaryLight,
  trackColor = COLOR.muted,
  duration = 1200,
  delay = 200,
  label,
  renderCenter,
  showPercent = true,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(clampedValue, {
        duration,
        easing: Easing.out(Easing.cubic),
      }),
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400 }),
    );
  }, [clampedValue]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      circumference - (progress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  // Determine the font size for the value based on ring size
  const valueFontSize = size * 0.22;
  const percentFontSize = size * 0.12;
  const labelFontSize = size * 0.09;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="1" />
            <Stop offset="1" stopColor={colorEnd} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated progress arc */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          // Rotate -90° so the arc starts at the top (12 o'clock)
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        {renderCenter ? (
          renderCenter(clampedValue)
        ) : (
          <>
            <View style={styles.valueRow}>
              <Animated.Text
                style={[
                  styles.valueText,
                  {
                    fontSize: valueFontSize,
                    opacity,
                  },
                ]}
              >
                {clampedValue}
              </Animated.Text>
              {showPercent && (
                <Animated.Text
                  style={[
                    styles.percentText,
                    {
                      fontSize: percentFontSize,
                      opacity,
                    },
                  ]}
                >
                  %
                </Animated.Text>
              )}
            </View>
            {label && (
              <Animated.Text
                style={[
                  styles.labelText,
                  {
                    fontSize: labelFontSize,
                    opacity,
                  },
                ]}
              >
                {label}
              </Animated.Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default CircularProgress;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  valueText: {
    fontFamily: FONT.bold,
    color: COLOR.onBackground,
    includeFontPadding: false,
  },
  percentText: {
    fontFamily: FONT.semiBold,
    color: COLOR.onMuted,
    marginBottom: 2,
    includeFontPadding: false,
  },
  labelText: {
    fontFamily: FONT.medium,
    color: COLOR.onMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    includeFontPadding: false,
  },
});
