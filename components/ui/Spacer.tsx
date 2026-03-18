import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Spacing } from '@/constants/theme';

type SpacingKey = keyof typeof Spacing;

export interface SpacerProps {
  /** Spacing token name — defaults to 'md' */
  size?: SpacingKey;
  /** Custom numeric size (overrides size token) */
  value?: number;
  /** Render as horizontal spacer (width instead of height) */
  horizontal?: boolean;
  /** Additional style */
  style?: ViewStyle;
}

export function Spacer({
  size = 'md',
  value,
  horizontal = false,
  style,
}: SpacerProps) {
  const space = value ?? Spacing[size];

  return (
    <View
      style={[
        horizontal ? { width: space } : { height: space },
        style,
      ]}
    />
  );
}
