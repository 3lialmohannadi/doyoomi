import { Platform } from 'react-native';

export const PRIMARY   = '#C97A5B';
export const SECONDARY = '#7BAE9E';

export const WARM_AMBER  = '#E8A87C';
export const WARM_CORAL  = '#D48E6E';
export const WARM_SAGE   = '#6BAF8A';
export const WARM_TEAL   = '#5BA89E';
export const WARM_ERROR  = '#C96B6B';

export const Colors = {
  light: {
    background: '#FBF7F3',
    surface: '#F5EFE9',
    surfaceElevated: '#FFFFFF',
    border: 'rgba(201,122,91,0.14)',
    borderLight: 'rgba(201,122,91,0.08)',
    text: '#2D1A0E',
    textSecondary: '#7A5C48',
    textMuted: '#B5957E',
    tint: PRIMARY,
    tintSecondary: SECONDARY,
    tabBar: 'rgba(251,247,243,0.97)',
    card: '#FFFFFF',
    card2: '#FBF7F3',
    shadow: 'rgba(201,122,91,0.14)',
    shadowMedium: 'rgba(201,122,91,0.22)',
    success: WARM_SAGE,
    warning: WARM_CORAL,
    error: WARM_ERROR,
    overdue: WARM_ERROR,
    priorityHigh: WARM_ERROR,
    priorityMedium: WARM_CORAL,
    priorityLow: WARM_SAGE,
    streak: WARM_CORAL,
    habit: SECONDARY,
    goal: PRIMARY,
    gradientStart: PRIMARY,
    gradientEnd: SECONDARY,
    gradientMid: WARM_CORAL,
    pillActive: PRIMARY,
    pillInactive: '#F5EFE9',
    segmentBg: '#EFE5DB',
    inputBg: '#F5EFE9',
    dim: '#B5957E',
  },
  dark: {
    background: '#1C130C',
    surface: '#2A1D13',
    surfaceElevated: '#362415',
    border: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(255,255,255,0.05)',
    text: '#F5EDE4',
    textSecondary: '#C4A48A',
    textMuted: '#8A6A52',
    tint: '#D9956F',
    tintSecondary: '#8DBFB0',
    tabBar: 'rgba(28,19,12,0.97)',
    card: '#2A1D13',
    card2: '#362415',
    shadow: 'rgba(45,26,14,0.3)',
    shadowMedium: 'rgba(45,26,14,0.45)',
    success: WARM_SAGE,
    warning: WARM_CORAL,
    error: WARM_ERROR,
    overdue: WARM_ERROR,
    priorityHigh: WARM_ERROR,
    priorityMedium: WARM_CORAL,
    priorityLow: WARM_SAGE,
    streak: WARM_CORAL,
    habit: '#8DBFB0',
    goal: '#D9956F',
    gradientStart: '#D9956F',
    gradientEnd: '#8DBFB0',
    gradientMid: '#C48058',
    pillActive: '#D9956F',
    pillInactive: '#2A1D13',
    segmentBg: '#2A1D13',
    inputBg: '#2A1D13',
    dim: '#8A6A52',
  },
};

export type ColorScheme = typeof Colors.light;

export const F = {
  reg:       'Cairo_400Regular',
  med:       'Cairo_600SemiBold',
  bold:      'Cairo_700Bold',
  black:     'Cairo_900Black',
  numReg:    'Inter_400Regular',
  numBold:   'Inter_700Bold',
  brand:     'Comfortaa_700Bold',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 34,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const ShadowDark = {
  sm: {
    shadowColor: '#2D1A0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#2D1A0E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#2D1A0E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const Typography = {
  heading1: { fontSize: 36, fontFamily: F.black, lineHeight: 44 },
  heading2: { fontSize: 30, fontFamily: F.black, lineHeight: 38 },
  heading3: { fontSize: 24, fontFamily: F.bold, lineHeight: 30 },
  subtitle: { fontSize: 18, fontFamily: F.med, lineHeight: 26 },
  body: { fontSize: 17, fontFamily: F.reg, lineHeight: 26 },
  bodyMedium: { fontSize: 17, fontFamily: F.med, lineHeight: 26 },
  caption: { fontSize: 15, fontFamily: F.reg, lineHeight: 22 },
  captionMedium: { fontSize: 15, fontFamily: F.med, lineHeight: 22 },
  label: { fontSize: 13, fontFamily: F.med, lineHeight: 18 },
};

export const GRADIENT_H: readonly [string, string] = [PRIMARY, WARM_AMBER];
export const GRADIENT_D: readonly [string, string, string] = [PRIMARY, WARM_CORAL, SECONDARY];
export const GRADIENT_SAGE: readonly [string, string] = [SECONDARY, '#A8D5C8'];
export const GRADIENT_AMBER: readonly [string, string] = [WARM_CORAL, WARM_AMBER];
export const GRADIENT_CORAL: readonly [string, string] = [WARM_ERROR, WARM_CORAL];
export const GRADIENT_GREEN: readonly [string, string] = [WARM_SAGE, '#4CAF82'];

function shadowHelper(color = '#2D1A0E', strength = 4) {
  return Platform.select({
    ios: {
      shadowColor:    color,
      shadowOffset:   { width: 0, height: strength / 2 },
      shadowOpacity:  0.10,
      shadowRadius:   strength,
    },
    android: { elevation: strength },
  }) ?? {};
}

export const cardShadow    = shadowHelper('#2D1A0E', 3);
export const primaryShadow = shadowHelper(PRIMARY, 8);
export const softShadow    = shadowHelper(PRIMARY, 4);
