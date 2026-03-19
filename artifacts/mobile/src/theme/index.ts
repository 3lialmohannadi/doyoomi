import { Platform } from 'react-native';

export const PRIMARY   = '#C97A5B';
export const SECONDARY = '#7BAE9E';

export const WARM_AMBER  = '#E8A87C';
export const WARM_CORAL  = '#D48E6E';
export const WARM_SAGE   = '#6BAF8A';
export const WARM_TEAL   = '#5BA89E';
export const WARM_ERROR  = '#C9605B';
export const WARM_AMBER2 = '#E8A650';

export const Colors = {
  light: {
    background:      '#F7F3EF',
    surface:         '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border:          'rgba(201,122,91,0.10)',
    borderLight:     'rgba(201,122,91,0.06)',
    text:            '#1E1009',
    textSecondary:   '#6B5548',
    textMuted:       '#A8907E',
    tint:            PRIMARY,
    tintSecondary:   SECONDARY,
    tabBar:          'rgba(247,243,239,0.96)',
    card:            '#FFFFFF',
    card2:           '#F7F3EF',
    shadow:          'rgba(201,122,91,0.10)',
    shadowMedium:    'rgba(201,122,91,0.18)',
    success:         '#7BAE9E',
    warning:         '#E8A650',
    error:           '#C9605B',
    overdue:         '#C9605B',
    priorityHigh:    '#C9605B',
    priorityMedium:  '#E8A650',
    priorityLow:     '#7BAE9E',
    streak:          '#E8A650',
    habit:           '#7BAE9E',
    goal:            PRIMARY,
    gradientStart:   PRIMARY,
    gradientEnd:     '#E8A87C',
    gradientMid:     '#D48E6E',
    pillActive:      PRIMARY,
    pillInactive:    '#EDE7E2',
    segmentBg:       '#EDE7E2',
    inputBg:         '#FDFAF7',
    dim:             '#A8907E',
  },
  dark: {
    background:      '#0D0D0D',
    surface:         '#161616',
    surfaceElevated: '#1F1F1F',
    border:          'rgba(255,255,255,0.07)',
    borderLight:     'rgba(255,255,255,0.04)',
    text:            '#F2EDE8',
    textSecondary:   '#BBA898',
    textMuted:       '#7A6456',
    tint:            '#E8956E',
    tintSecondary:   '#8FCABC',
    tabBar:          'rgba(13,13,13,0.0)',
    card:            '#191919',
    card2:           '#1F1F1F',
    shadow:          'rgba(0,0,0,0.55)',
    shadowMedium:    'rgba(0,0,0,0.75)',
    success:         '#8FCABC',
    warning:         '#E8A650',
    error:           '#E07068',
    overdue:         '#E07068',
    priorityHigh:    '#E07068',
    priorityMedium:  '#E8A650',
    priorityLow:     '#8FCABC',
    streak:          '#E8A650',
    habit:           '#8FCABC',
    goal:            '#E8956E',
    gradientStart:   '#E8956E',
    gradientEnd:     '#F0B896',
    gradientMid:     '#E8A87C',
    pillActive:      '#E8956E',
    pillInactive:    '#1F1F1F',
    segmentBg:       '#161616',
    inputBg:         '#1F1F1F',
    dim:             '#7A6456',
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.65,
    shadowRadius: 30,
    elevation: 16,
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

export const GRADIENT_H: readonly [string, string] = ['#C97A5B', '#E8A87C'];
export const GRADIENT_D: readonly [string, string, string] = ['#C97A5B', '#D48E6E', '#7BAE9E'];
export const GRADIENT_WARM: readonly [string, string] = ['#E8A87C', '#F5C89A'];
export const GRADIENT_SAGE: readonly [string, string] = ['#7BAE9E', '#9ECCC0'];
export const GRADIENT_TEAL: readonly [string, string, string] = ['#5B9A8B', '#7BAE9E', '#9ECCC0'];
export const GRADIENT_AMBER: readonly [string, string] = ['#E8A650', '#F5C86A'];
export const GRADIENT_CORAL: readonly [string, string] = ['#C9605B', '#E88078'];
export const GRADIENT_GREEN: readonly [string, string] = [WARM_SAGE, '#4CAF82'];

export const GRADIENT_DARK_CARD: readonly [string, string] = ['#222222', '#181818'];
export const GRADIENT_DARK_CARD_ELEVATED: readonly [string, string] = ['#2A2A2A', '#202020'];
export const GRADIENT_DARK_HEADER: readonly [string, string, string] = ['#1A1A1A', '#0F0F0F', '#0D0D0D'];
export const GRADIENT_DARK_BRAND: readonly [string, string] = ['#C97A5B', '#8A5540'];
export const GRADIENT_DARK_BRAND_SUBTLE: readonly [string, string] = ['rgba(232,149,110,0.15)', 'rgba(232,149,110,0.03)'];
export const GRADIENT_DARK_SAGE_SUBTLE: readonly [string, string] = ['rgba(143,202,188,0.15)', 'rgba(143,202,188,0.03)'];

function shadowHelper(color = PRIMARY, strength = 4) {
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

export const cardShadow    = shadowHelper(PRIMARY, 3);
export const primaryShadow = shadowHelper(PRIMARY, 8);
export const softShadow    = shadowHelper(PRIMARY, 4);
