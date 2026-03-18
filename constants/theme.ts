import { moderateScale, moderateVerticalScale } from '@/helpers/scaling';

// ─── Colors ─────────────────────────────────────────────────────────────────────
export const Colors = {
  // Base
  background: 'hsl(250, 20%, 10%)',
  surface: 'hsl(250, 18%, 13%)',
  card: '#211f2eff',
  primaryLight: 'hsla(250, 50%, 50%, 0.2)',
  primary: 'hsl(250, 50%, 50%)',
  primaryDark: 'hsl(250, 55%, 40%)',
  secondary: 'hsl(250, 15%, 25%)',
  tertiary: 'hsl(250, 18%, 30%)',
  muted: 'hsl(250, 15%, 20%)',
  border: 'hsl(250, 15%, 30%)',
  borderLight: 'hsl(250, 12%, 22%)',
  borderInput: 'hsl(250, 15%, 22%)',

  // Input / Interactive
  inputBackground: 'hsl(250, 18%, 14%)',
  focusRing: 'hsla(250, 60%, 55%, 0.5)',
  overlay: 'hsla(250, 25%, 5%, 0.65)',
  shimmer: 'hsla(250, 15%, 30%, 0.4)',

  // Text
  onBackground: 'hsl(250, 15%, 90%)',
  onCard: 'hsl(250, 15%, 90%)',
  onPrimary: 'hsl(250, 10%, 98%)',
  onSecondary: 'hsl(250, 15%, 80%)',
  onTertiary: 'hsl(250, 15%, 90%)',
  onMuted: 'hsl(250, 10%, 55%)',

  // Semantic
  success: 'hsl(145, 55%, 52%)',
  successLight: 'hsla(145, 55%, 52%, 0.15)',
  warning: 'hsl(42, 78%, 60%)',
  warningLight: 'hsla(42, 78%, 60%, 0.15)',
  danger: 'hsl(0, 65%, 55%)',
  dangerLight: 'hsla(0, 65%, 55%, 0.15)',
  info: 'hsl(210, 70%, 60%)',
  infoLight: 'hsla(210, 70%, 60%, 0.15)',
  onState: 'hsl(250, 10%, 98%)',

  // Gradient helpers — use with expo-linear-gradient or similar
  gradientPrimary: ['hsl(250, 55%, 50%)', 'hsl(270, 55%, 45%)'] as const,
  gradientCard: ['hsl(250, 18%, 15%)', 'hsl(250, 18%, 12%)'] as const,
} as const;

// ─── Fonts ──────────────────────────────────────────────────────────────────────
export const Fonts = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semiBold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
} as const;

// ─── Spacing (4-point grid, moderately scaled) ──────────────────────────────────
export const Spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  '2xl': moderateScale(24),
  '3xl': moderateScale(32),
  '4xl': moderateScale(40),
  '5xl': moderateScale(48),
  '6xl': moderateScale(64),
} as const;

// ─── Border Radii (scaled) ──────────────────────────────────────────────────────
export const Radii = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  '2xl': moderateScale(24),
  full: 9999,
} as const;

// ─── Box Shadows (new unified API) ─────────────────────────────────────────────
export const Shadows = {
  sm: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.35)',
  },
  md: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.45)',
  },
  lg: {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.55)',
  },
  glow: {
    boxShadow: `0px 0px 20px ${Colors.primaryLight}`,
  },
} as const;

// ─── Typography Presets ─────────────────────────────────────────────────────────
export const Typography = {
  h1: {
    fontFamily: Fonts.bold,
    fontSize: moderateScale(32),
    lineHeight: moderateVerticalScale(40),
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: Fonts.bold,
    fontSize: moderateScale(26),
    lineHeight: moderateVerticalScale(34),
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: Fonts.semiBold,
    fontSize: moderateScale(22),
    lineHeight: moderateVerticalScale(30),
    letterSpacing: 0,
  },
  h4: {
    fontFamily: Fonts.semiBold,
    fontSize: moderateScale(18),
    lineHeight: moderateVerticalScale(26),
    letterSpacing: 0,
  },
  subtitle1: {
    fontFamily: Fonts.medium,
    fontSize: moderateScale(16),
    lineHeight: moderateVerticalScale(24),
    letterSpacing: 0.1,
  },
  subtitle2: {
    fontFamily: Fonts.medium,
    fontSize: moderateScale(14),
    lineHeight: moderateVerticalScale(20),
    letterSpacing: 0.1,
  },
  body1: {
    fontFamily: Fonts.regular,
    fontSize: moderateScale(16),
    lineHeight: moderateVerticalScale(24),
    letterSpacing: 0.15,
  },
  body2: {
    fontFamily: Fonts.regular,
    fontSize: moderateScale(14),
    lineHeight: moderateVerticalScale(20),
    letterSpacing: 0.15,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: moderateScale(12),
    lineHeight: moderateVerticalScale(16),
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: Fonts.semiBold,
    fontSize: moderateScale(11),
    lineHeight: moderateVerticalScale(16),
    letterSpacing: 1.5,
  },
  button: {
    fontFamily: Fonts.semiBold,
    fontSize: moderateScale(15),
    lineHeight: moderateVerticalScale(22),
    letterSpacing: 0.3,
  },
} as const;

// ─── Animation Presets (for react-native-reanimated) ────────────────────────────
export const Animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    // Used with Easing from react-native-reanimated
    // e.g. withTiming(value, { duration: Animation.duration.normal })
  },
  spring: {
    gentle: { damping: 20, stiffness: 150, mass: 1 },
    bouncy: { damping: 12, stiffness: 200, mass: 0.8 },
    snappy: { damping: 18, stiffness: 300, mass: 0.9 },
  },
} as const;

// ─── Layout Constants ───────────────────────────────────────────────────────────
export const Layout = {
  screenPadding: moderateScale(20),
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  minTouchTarget: moderateScale(44),
  tabBarHeight: moderateVerticalScale(60),
  headerHeight: moderateVerticalScale(56),
  bottomInset: moderateVerticalScale(34),
  iconSize: {
    sm: moderateScale(18),
    md: moderateScale(22),
    lg: moderateScale(28),
  },
} as const;
