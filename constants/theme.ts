import { Platform } from 'react-native';

export const COLOR = {
  background: 'hsl(250, 20%, 10%)',
  onBackground: 'hsl(250, 15%, 90%)',
  card: 'hsl(250, 20%, 15%)',
  onCard: 'hsl(250, 15%, 85%)',
  muted: 'hsl(250, 15%, 20%)',
  onMuted: 'hsl(250, 10%, 55%)',

  primary: 'hsl(250, 50%, 50%)',
  primaryLight: 'hsl(250, 50%, 70%)',
  onPrimary: 'hsl(250, 10%, 98%)',

  secondary: 'hsl(250, 15%, 25%)',
  onSecondary: 'hsl(250, 15%, 80%)',
  accent: 'hsl(250, 18%, 30%)',
  onAccent: 'hsl(250, 15%, 90%)',

  border: 'hsl(250, 15%, 30%)',
  borderInput: 'hsl(250, 15%, 22%)',
  borderRing: 'hsla(250, 70%, 50%, 0.9)',

  green: 'hsl(125, 50%, 50%)',
  yellow: 'hsl(45, 50%, 50%)',
  red: 'hsl(0, 50%, 50%)',
  blue: 'hsl(225, 50%, 50%)',
} as const;

export const FONT = {
  regular: Platform.select({
    android: 'Outfit_400Regular',
    ios: 'Outfit-Regular',
  }),
  medium: Platform.select({
    android: 'Outfit_500Medium',
    ios: 'Outfit-Medium',
  }),
  semiBold: Platform.select({
    android: 'Outfit_600SemiBold',
    ios: 'Outfit-SemiBold',
  }),
  bold: Platform.select({
    android: 'Outfit_700Bold',
    ios: 'Outfit-Bold',
  }),
} as const;

export const SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 1000,
} as const;

export const SHADOW = {
  xs: '0 8 16 -4 hsla(250, 30%, 5%, 0.3)',
  sm: [
    {
      offsetX: 0,
      offsetY: 1,
      blurRadius: 2,
      spreadDistance: -5,
      color: 'hsla(250, 30%, 5%, 0.6)',
    },
    {
      offsetX: 0,
      offsetY: 8,
      blurRadius: 16,
      spreadDistance: -4,
      color: 'hsla(250, 30%, 5%, 0.6)',
    },
  ],
  md: [
    {
      offsetX: 0,
      offsetY: 2,
      blurRadius: 4,
      spreadDistance: -5,
      color: 'hsla(250, 30%, 5%, 0.6)',
    },
    {
      offsetX: 0,
      offsetY: 8,
      blurRadius: 16,
      spreadDistance: -4,
      color: 'hsla(250, 30%, 5%, 0.6)',
    },
  ],
  lg: [
    {
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadDistance: -5,
      color: 'hsla(250, 30%, 5%, 0.6)',
    },
    {
      offsetX: 0,
      offsetY: 8,
      blurRadius: 16,
      spreadDistance: -4,
      color: 'hsla(250, 30%, 5%, 0.6)',
    },
  ],
  xl: [
    {
      offsetX: 0,
      offsetY: 8,
      blurRadius: 10,
      spreadDistance: -5,
      color: 'hsla(250, 30%, 5%, 0.6)',
    },
    {
      offsetX: 0,
      offsetY: 8,
      blurRadius: 16,
      spreadDistance: -4,
      color: 'hsla(250, 30%, 5%, 0.6)',
    },
  ],
  '2xl': '0 8 16 -4 hsla(250, 30%, 5%, 1)',
  primary: [
    {
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadDistance: -5,
      color: 'hsla(250, 50%, 50%, 0.15)',
    },
    {
      offsetX: 0,
      offsetY: 8,
      blurRadius: 16,
      spreadDistance: -4,
      color: 'hsla(250, 50%, 50%, 0.15)',
    },
  ],
} as const;

export const TEXT = {
  displayLarge: { fontFamily: FONT.bold, fontSize: 56 },
  displayMedium: { fontFamily: FONT.bold, fontSize: 48 },
  displaySmall: { fontFamily: FONT.bold, fontSize: 40 },

  h1: { fontFamily: FONT.bold, fontSize: 36 },
  h2: { fontFamily: FONT.semiBold, fontSize: 28 },
  h3: { fontFamily: FONT.semiBold, fontSize: 24 },
  h4: { fontFamily: FONT.semiBold, fontSize: 20 },
  h5: { fontFamily: FONT.semiBold, fontSize: 18 },

  bodyLarge: { fontFamily: FONT.regular, fontSize: 18 },
  body: { fontFamily: FONT.regular, fontSize: 16 },
  bodySmall: { fontFamily: FONT.regular, fontSize: 14 },

  button: { fontFamily: FONT.semiBold, fontSize: 16 },
  label: { fontFamily: FONT.medium, fontSize: 14 },
  caption: { fontFamily: FONT.regular, fontSize: 14 },
  badge: { fontFamily: FONT.medium, fontSize: 12 },
} as const;

export const THEME = {
  COLOR,
  FONT,
  SPACE,
  RADIUS,
  SHADOW,
  TEXT,

  PADDING: {
    screen: SPACE.xl,
    card: SPACE.lg,
    button: SPACE.lg,
    input: SPACE.lg,
    icon: SPACE.sm,
  },
} as const;
