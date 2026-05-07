import { COLOR, FONT, RADIUS, SHADOW, SPACE } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  BoxShadowValue,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

type IconComponent = React.FC<{ size?: number; color?: string }>;

type Variant = 'primary' | 'secondary' | 'icon' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = {
  title?: string;
  variant?: Variant;
  size?: Size;
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

// ─── Scale maps ──────────────────────────────────────────────────────────────

const HEIGHT: Record<Size, number> = { sm: 40, md: 48, lg: 56 };

const PADDING_H: Record<Size, number> = {
  sm: SPACE.md,
  md: SPACE.lg,
  lg: SPACE.xl,
};

const FONT_SIZE: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

const ICON_SIZE: Record<Size, number> = { sm: 18, md: 20, lg: 22 };

const BORDER_RADIUS: Record<Size, number> = {
  sm: RADIUS.md,
  md: RADIUS.lg,
  lg: RADIUS.xl,
};

// ─── Variant styles ─────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<
  Variant,
  {
    bg: string;
    fg: string;
    shadow: string | ReadonlyArray<BoxShadowValue> | null;
  }
> = {
  primary: { bg: COLOR.primary, fg: COLOR.onPrimary, shadow: SHADOW.primary },
  secondary: { bg: COLOR.secondary, fg: COLOR.onSecondary, shadow: SHADOW.sm },
  icon: { bg: COLOR.muted, fg: COLOR.onMuted, shadow: SHADOW.sm },
  ghost: { bg: 'transparent', fg: COLOR.onMuted, shadow: null },
};

// ─── Component ───────────────────────────────────────────────────────────────

const Button = ({
  title,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  iconOnly = false,
  fullWidth = false,
  loading = false,
  disabled = false,
  onPress,
  style,
}: ButtonProps) => {
  const v = VARIANT_STYLES[variant];
  const height = HEIGHT[size];
  const paddingH = PADDING_H[size];
  const fontSize = FONT_SIZE[size];
  const iconSize = ICON_SIZE[size];
  const radius = BORDER_RADIUS[size];

  const isDisabled = disabled || loading;

  // Build shadow style array for RN (boxShadow)
  const shadowStyle = v.shadow
    ? { boxShadow: v.shadow as ViewStyle['boxShadow'] }
    : undefined;

  const containerStyle: ViewStyle = {
    height,
    borderRadius: radius,
    backgroundColor: v.bg,
    paddingHorizontal: iconOnly ? 0 : paddingH,
    width: iconOnly ? height : undefined, // square when icon-only
    ...(fullWidth && { flex: 1 }),
    ...shadowStyle,
  };

  const showTitle = !iconOnly && !!title;
  const iconLeft = Icon && iconPosition === 'left';
  const iconRight = Icon && iconPosition === 'right';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : (
        <>
          {iconLeft && <Icon size={iconSize} color={v.fg} />}

          {showTitle && (
            <Text
              style={[
                styles.label,
                { fontSize, color: v.fg },
                Icon
                  ? iconLeft
                    ? styles.labelAfterIcon
                    : styles.labelBeforeIcon
                  : undefined,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}

          {iconRight && <Icon size={iconSize} color={v.fg} />}
        </>
      )}
    </Pressable>
  );
};

export default Button;

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: FONT.semiBold,
  },
  labelAfterIcon: {
    marginLeft: SPACE.sm,
  },
  labelBeforeIcon: {
    marginRight: SPACE.sm,
  },
});
