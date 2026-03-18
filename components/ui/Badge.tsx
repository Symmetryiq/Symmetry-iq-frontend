import { Colors, Radii, Spacing } from '@/constants/theme';
import { moderateScale } from '@/helpers/scaling';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Text } from './Text';

type BadgeVariant = 'solid' | 'outline' | 'soft';
type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  /** Label text */
  label: string;
  /** Visual variant */
  variant?: BadgeVariant;
  /** Semantic color */
  color?: BadgeColor;
  /** Size preset */
  size?: BadgeSize;
  /** Icon element rendered before the label */
  leftIcon?: React.ReactNode;
  /** Additional style */
  style?: ViewStyle;
}

const colorMap: Record<BadgeColor, { solid: string; light: string }> = {
  primary: { solid: Colors.primary, light: Colors.primaryLight },
  success: { solid: Colors.success, light: Colors.successLight },
  warning: { solid: Colors.warning, light: Colors.warningLight },
  danger: { solid: Colors.danger, light: Colors.dangerLight },
  info: { solid: Colors.info, light: Colors.infoLight },
};

function getBadgeStyle(variant: BadgeVariant, color: BadgeColor) {
  const palette = colorMap[color];

  switch (variant) {
    case 'solid':
      return {
        bg: palette.solid,
        text: Colors.onState,
        borderColor: 'transparent',
        borderWidth: 0,
      };
    case 'outline':
      return {
        bg: 'transparent',
        text: palette.solid,
        borderColor: palette.solid,
        borderWidth: 1,
      };
    case 'soft':
      return {
        bg: palette.light,
        text: palette.solid,
        borderColor: 'transparent',
        borderWidth: 0,
      };
  }
}

const sizeConfig: Record<BadgeSize, {
  paddingV: number;
  paddingH: number;
  variant: 'caption' | 'overline';
}> = {
  sm: {
    paddingV: moderateScale(2),
    paddingH: Spacing.sm,
    variant: 'overline',
  },
  md: {
    paddingV: Spacing.xs,
    paddingH: Spacing.md,
    variant: 'caption',
  },
};

export function Badge({
  label,
  variant = 'soft',
  color = 'primary',
  size = 'sm',
  leftIcon,
  style,
}: BadgeProps) {
  const badgeStyle = getBadgeStyle(variant, color);
  const sizePreset = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: badgeStyle.bg,
          borderColor: badgeStyle.borderColor,
          borderWidth: badgeStyle.borderWidth,
          paddingVertical: sizePreset.paddingV,
          paddingHorizontal: sizePreset.paddingH,
        },
        style,
      ]}
    >
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <Text variant={sizePreset.variant} color={badgeStyle.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 0,
    borderRadius: Radii.full,
  },
  icon: {
    marginRight: Spacing.xs,
  },
});
