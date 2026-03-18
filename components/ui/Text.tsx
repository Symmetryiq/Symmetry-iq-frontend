import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

type TypographyVariant = keyof typeof Typography;

export interface TextProps extends RNTextProps {
  /** Typography preset from theme */
  variant?: TypographyVariant;
  /** Text color — defaults to Colors.onBackground */
  color?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Override font family */
  fontFamily?: string;
  /** Dim the text (applies Colors.onMuted) */
  muted?: boolean;
}

export function Text({
  variant = 'body1',
  color,
  align,
  fontFamily,
  muted = false,
  style,
  children,
  ...rest
}: TextProps) {
  const preset = Typography[variant];

  const resolvedColor = muted
    ? Colors.onMuted
    : color ?? Colors.onBackground;

  return (
    <RNText
      style={[
        preset,
        { color: resolvedColor },
        align && { textAlign: align },
        fontFamily && { fontFamily },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
