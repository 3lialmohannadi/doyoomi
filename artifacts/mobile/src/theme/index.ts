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
    background:      '#FBF7F3',
    surface:         '#FFF9F5',
    surfaceElevated: '#FFFFFF',
    border:          'rgba(201,122,91,0.12)',
    borderLight:     'rgba(201,122,91,0.07)',
    text:            '#2C1D0E',
    textSecondary:   '#7A6655',
    textMuted:       '#B09B87',
    tint:            PRIMARY,
    tintSecondary:   SECONDARY,
    tabBar:          'rgba(251,247,243,0.97)',
    card:            '#FFFFFF',
    card2:           '#FBF7F3',
    shadow:          'rgba(201,122,91,0.12)',
    shadowMedium:    'rgba(201,122,91,0.20)',
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
    pillInactive:    '#F2ECE7',
    segmentBg:       '#F2ECE7',
    inputBg:         '#FFF9F5',
    dim:             '#B09B87',
  },
  dark: {
    background:      '#1C130C',
    surface:         '#261A12',
    surfaceElevated: '#30211A',
    border:          'rgba(255,255,255,0.08)',
    borderLight:     'rgba(255,255,255,0.05)',
    text:            '#F5EDE5',
    textSecondary:   '#C4AA96',
    textMuted:       '#8A6E5C',
    tint:            '#E8956E',
    tintSecondary:   '#8FCABC',
    tabBar:          'rgba(28,19,12,0.97)',
    card:            '#261A12',
    card2:           '#30211A',
    shadow:          'rgba(0,0,0,0.4)',
    shadowMedium:    'rgba(0,0,0,0.6)',
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
    pillInactive:    '#30211A',
    segmentBg:       '#261A12',
    inputBg:         '#30211A',
    dim:             '#8A6E5C',
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000000',
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

export const GRADIENT_H: readonly [string, string] = ['#C97A5B', '#E8A87C'];
export const GRADIENT_D: readonly [string, string, string] = ['#C97A5B', '#D48E6E', '#7BAE9E'];
export const GRADIENT_WARM: readonly [string, string] = ['#E8A87C', '#F5C89A'];
export const GRADIENT_SAGE: readonly [string, string] = ['#7BAE9E', '#9ECCC0'];
export const GRADIENT_AMBER: readonly [string, string] = ['#E8A650', '#F5C86A'];
export const GRADIENT_CORAL: readonly [string, string] = ['#C9605B', '#E88078'];
export const GRADIENT_GREEN: readonly [string, string] = [WARM_SAGE, '#4CAF82'];

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
