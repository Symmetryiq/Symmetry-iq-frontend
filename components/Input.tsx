import { COLOR, FONT, RADIUS, SPACE, TEXT } from '@/constants/theme';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import ThemedText from './ThemedText';
import EyeCloseIcon from './icons/EyeCloseIcon';
import EyeIcon from './icons/EyeIcon';

type IconComponent = React.FC<{ size?: number; color?: string }>;

type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  secureToggle?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
};

const Input = ({
  label,
  hint,
  error,
  icon: Icon,
  iconPosition = 'left',
  secureToggle = false,
  disabled = false,
  containerStyle,
  inputStyle,
  secureTextEntry,
  ...rest
}: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureToggle || !!secureTextEntry);

  const hasError = !!error;
  const hasIcon = !!Icon;
  const iconLeft = hasIcon && iconPosition === 'left';
  const iconRight = hasIcon && iconPosition === 'right';

  const borderColor = hasError
    ? COLOR.red
    : focused
      ? COLOR.primaryLight
      : COLOR.borderInput;

  const SecureIcon = hidden ? EyeCloseIcon : EyeIcon;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText variant="label" color="onMuted" style={styles.label}>
          {label}
        </ThemedText>
      )}

      <View
        style={[
          styles.field,
          { borderColor },
          disabled && styles.fieldDisabled,
        ]}
      >
        {iconLeft && (
          <View style={styles.iconWrapper}>
            <Icon size={20} color={COLOR.onMuted} />
          </View>
        )}

        <TextInput
          {...rest}
          editable={!disabled}
          secureTextEntry={hidden}
          placeholderTextColor={COLOR.onMuted}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[
            styles.input,
            iconLeft && styles.inputWithLeftIcon,
            (iconRight || secureToggle) && styles.inputWithRightIcon,
            inputStyle,
          ]}
        />

        {secureToggle && (
          <Pressable
            onPress={() => setHidden((prev) => !prev)}
            style={styles.toggleWrapper}
            hitSlop={8}
          >
            <SecureIcon size={24} color={COLOR.onMuted} />
          </Pressable>
        )}

        {iconRight && !secureToggle && (
          <View style={styles.iconWrapper}>
            <Icon size={20} color={COLOR.onMuted} />
          </View>
        )}
      </View>

      {(hint || error) && (
        <ThemedText
          variant="caption"
          color={hasError ? 'red' : 'onMuted'}
          style={styles.helper}
        >
          {error || hint}
        </ThemedText>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    gap: SPACE.sm,
  },
  label: {
    marginLeft: SPACE.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.card,
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    minHeight: 52,
  },
  fieldDisabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: TEXT.body.fontSize,
    color: COLOR.onBackground,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.lg,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  iconWrapper: {
    paddingHorizontal: SPACE.lg,
  },
  toggleWrapper: {
    paddingHorizontal: SPACE.lg,
  },
  helper: {
    marginLeft: SPACE.xs,
  },
});
