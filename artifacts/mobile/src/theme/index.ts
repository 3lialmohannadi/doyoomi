import { Platform } from 'react-native';

export const PRIMARY   = '#6C47FF';
export const SECONDARY = '#FF6B8A';

export const Colors = {
  light: {
    background: '#F0EDFF',
    surface: '#F8F5FF',
    surfaceElevated: '#FFFFFF',
    border: 'rgba(108,71,255,0.12)',
    borderLight: 'rgba(108,71,255,0.08)',
    text: '#1A1A2E',
    textSecondary: '#8B8B9E',
    textMuted: '#B0B0C0',
    tint: PRIMARY,
    tintSecondary: SECONDARY,
    tabBar: 'rgba(240,237,255,0.97)',
    card: '#FFFFFF',
    card2: '#F8F5FF',
    shadow: 'rgba(108,71,255,0.14)',
    shadowMedium: 'rgba(108,71,255,0.22)',
    success: '#4ADE80',
    warning: '#FB923C',
    error: '#F87171',
    overdue: '#F87171',
    priorityHigh: '#F87171',
    priorityMedium: '#FB923C',
    priorityLow: '#4ADE80',
    streak: '#FB923C',
    habit: '#A78BFA',
    goal: PRIMARY,
    gradientStart: PRIMARY,
    gradientEnd: SECONDARY,
    gradientMid: '#9B5DE5',
    pillActive: PRIMARY,
    pillInactive: '#EDE9FF',
    segmentBg: '#EDE9FF',
    inputBg: '#F8F5FF',
    dim: '#B0B0C0',
  },
  dark: {
    background: '#0D0D1A',
    surface: '#1A1A30',
    surfaceElevated: '#22223A',
    border: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(255,255,255,0.05)',
    text: '#EEEEFF',
    textSecondary: '#9B9BB8',
    textMuted: '#6B6B88',
    tint: '#9B7FFF',
    tintSecondary: SECONDARY,
    tabBar: 'rgba(13,13,26,0.97)',
    card: '#1A1A30',
    card2: '#22223A',
    shadow: 'rgba(0,0,0,0.4)',
    shadowMedium: 'rgba(0,0,0,0.6)',
    success: '#4ADE80',
    warning: '#FB923C',
    error: '#FF5A78',
    overdue: '#FF5A78',
    priorityHigh: '#FF5A78',
    priorityMedium: '#FB923C',
    priorityLow: '#4ADE80',
    streak: '#FB923C',
    habit: '#B87FFF',
    goal: '#9B7FFF',
    gradientStart: '#9B7FFF',
    gradientEnd: SECONDARY,
    gradientMid: '#B07FFF',
    pillActive: '#9B7FFF',
    pillInactive: '#22223A',
    segmentBg: '#1E1838',
    inputBg: '#1E1838',
    dim: '#6B6B88',
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
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 28,
  full: 9999,
};

export const Shadow = {
  sm: {
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const ShadowDark = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
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

export const GRADIENT_PRIMARY: [string, string] = [PRIMARY, SECONDARY];
export const GRADIENT_H: readonly [string, string] = [PRIMARY, SECONDARY];
export const GRADIENT_D: readonly [string, string, string] = [PRIMARY, '#9B5DE5', SECONDARY];
export const GRADIENT_PURPLE: [string, string] = [PRIMARY, '#A78BFA'];
export const GRADIENT_WARM: [string, string] = [SECONDARY, '#FFB347'];
export const GRADIENT_GREEN: [string, string] = ['#4ADE80', '#00E5A0'];
export const GRADIENT_ORANGE: [string, string] = ['#FB923C', '#FFB347'];

function shadowHelper(color = '#000', strength = 4) {
  return Platform.select({
    ios: {
      shadowColor:    color,
      shadowOffset:   { width: 0, height: strength / 2 },
      shadowOpacity:  0.15,
      shadowRadius:   strength,
    },
    android: { elevation: strength },
  }) ?? {};
}

export const cardShadow    = shadowHelper('#1A1A2E', 3);
export const primaryShadow = shadowHelper(PRIMARY, 8);
export const softShadow    = shadowHelper(PRIMARY, 4);
