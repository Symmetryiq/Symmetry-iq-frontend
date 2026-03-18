import { Animation, Colors, Radii, Spacing } from '@/constants/theme';
import { moderateScale, moderateVerticalScale } from '@/helpers/scaling';
import React, { useCallback, useEffect } from 'react';
import {
  BackHandler,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface BottomSheetProps {
  /** Whether the sheet is visible */
  visible: boolean;
  /** Close handler */
  onClose: () => void;
  /** Sheet content */
  children: React.ReactNode;
  /** Snap height (defaults to 50% of screen) */
  height?: number;
  /** Show the drag handle indicator */
  showHandle?: boolean;
  /** Dismiss on backdrop press */
  dismissOnBackdrop?: boolean;
  /** Custom background color */
  backgroundColor?: string;
  /** Additional style for the sheet container */
  style?: ViewStyle;
}

const HANDLE_HEIGHT = moderateVerticalScale(24);

export function BottomSheet({
  visible,
  onClose,
  children,
  height: customHeight,
  showHandle = true,
  dismissOnBackdrop = true,
  backgroundColor = Colors.card,
  style,
}: BottomSheetProps) {
  const { height: screenHeight } = useWindowDimensions();
  const sheetHeight = customHeight ?? screenHeight * 0.5;

  const translateY = useSharedValue(sheetHeight);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue(0);

  const open = useCallback(() => {
    translateY.value = withSpring(0, Animation.spring.snappy);
    backdropOpacity.value = withTiming(1, { duration: Animation.duration.normal });
  }, [sheetHeight]);

  const close = useCallback(() => {
    translateY.value = withTiming(sheetHeight, {
      duration: Animation.duration.normal,
      easing: Easing.inOut(Easing.ease),
    });
    backdropOpacity.value = withTiming(0, {
      duration: Animation.duration.normal,
    });
    setTimeout(onClose, Animation.duration.normal);
  }, [sheetHeight, onClose]);

  useEffect(() => {
    if (visible) {
      open();
    }
  }, [visible, open]);

  // Handle Android back button
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => sub.remove();
  }, [visible, close]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(0, context.value + e.translationY);
    })
    .onEnd((e) => {
      if (translateY.value > sheetHeight * 0.3 || e.velocityY > 500) {
        runOnJS(close)();
      } else {
        translateY.value = withSpring(0, Animation.spring.snappy);
      }
    });

  const sheetAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropAnimStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdrop ? close : undefined}
        />
      </Animated.View>

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              backgroundColor,
            },
            sheetAnimStyle,
            style,
          ]}
        >
          {showHandle && (
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Radii['2xl'],
    borderTopRightRadius: Radii['2xl'],
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    height: HANDLE_HEIGHT,
  },
  handle: {
    width: moderateScale(40),
    height: moderateScale(4),
    borderRadius: Radii.full,
    backgroundColor: Colors.onMuted,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
