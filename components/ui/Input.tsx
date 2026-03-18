import { Animation, Colors, Fonts, Radii, Spacing, Typography } from '@/constants/theme';
import { moderateScale } from '@/helpers/scaling';
import React, { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from './Text';

const AnimatedView = Animated.createAnimatedComponent(View);

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Label text above the input */
  label?: string;
  /** Error message — shows red border + error text */
  error?: string;
  /** Helper text below the input */
  helper?: string;
  /** Icon element rendered at the start of the input */
  leftIcon?: React.ReactNode;
  /** Icon element rendered at the end of the input */
  rightIcon?: React.ReactNode;
  /** Toggle password visibility icon (auto-added for secureTextEntry) */
  secureToggle?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom input style */
  inputStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  secureToggle = false,
  secureTextEntry,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);
  const focusAnim = useSharedValue(0);

  const handleFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      focusAnim.value = withTiming(1, { duration: Animation.duration.fast });
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      focusAnim.value = withTiming(0, { duration: Animation.duration.fast });
      onBlur?.(e);
    },
    [onBlur],
  );

  const hasError = !!error;

  const borderAnimStyle = useAnimatedStyle(() => {
    const borderColor = hasError
      ? Colors.danger
      : interpolateColor(
        focusAnim.value,
        [0, 1],
        [Colors.borderInput, Colors.primary],
      );
    return { borderColor };
  });

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          variant="subtitle2"
          color={hasError ? Colors.danger : Colors.onSecondary}
          style={styles.label}
        >
          {label}
        </Text>
      )}

      <AnimatedView style={[styles.inputContainer, borderAnimStyle]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={Colors.onMuted}
          selectionColor={Colors.primary}
          cursorColor={Colors.primary}
          secureTextEntry={isSecure}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {secureToggle && secureTextEntry !== undefined && (
          <Pressable
            onPress={() => setIsSecure((prev) => !prev)}
            hitSlop={10}
            style={styles.iconRight}
          >
            <Text variant="caption" color={Colors.onMuted}>
              {isSecure ? 'Show' : 'Hide'}
            </Text>
          </Pressable>
        )}

        {rightIcon && !secureToggle && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </AnimatedView>

      {(error || helper) && (
        <Text
          variant="caption"
          color={hasError ? Colors.danger : Colors.onMuted}
          style={styles.helperText}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.borderInput,
    paddingHorizontal: Spacing.md,
    minHeight: moderateScale(48),
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: Typography.body1.fontSize,
    color: Colors.onBackground,
    paddingVertical: Spacing.md,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  helperText: {
    marginTop: Spacing.xs,
  },
});
