import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

export interface DividerProps {
  /** Orientation — defaults to horizontal */
  orientation?: 'horizontal' | 'vertical';
  /** Line color — defaults to Colors.border */
  color?: string;
  /** Line thickness — defaults to 1 */
  thickness?: number;
  /** Space on each side of the line */
  spacing?: number;
  /** Additional style */
  style?: ViewStyle;
}

export function Divider({
  orientation = 'horizontal',
  color = Colors.border,
  thickness = StyleSheet.hairlineWidth,
  spacing = Spacing.lg,
  style,
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      style={[
        {
          backgroundColor: color,
          ...(isHorizontal
            ? {
                height: thickness,
                width: '100%',
                marginVertical: spacing,
              }
            : {
                width: thickness,
                height: '100%',
                marginHorizontal: spacing,
              }),
        },
        style,
      ]}
    />
  );
}
