import { Platform } from 'react-native';

// ── Bold & Colorful Core Palette ───────────────────────────────────────────────
export const PRIMARY   = '#6366F1'; // Electric Indigo
export const SECONDARY = '#F97316'; // Vivid Orange

export const BOLD_INDIGO  = '#6366F1';
export const BOLD_PURPLE  = '#8B5CF6';
export const BOLD_ORANGE  = '#F97316';
export const BOLD_RED     = '#EF4444';
export const BOLD_CYAN    = '#06B6D4';
export const BOLD_BLUE    = '#3B82F6';
export const BOLD_GREEN   = '#10B981';
export const BOLD_TEAL    = '#14B8A6';
export const BOLD_GOLD    = '#EAB308';
export const BOLD_AMBER   = '#F59E0B';
export const BOLD_ROSE    = '#EC4899';
export const BOLD_PINK    = '#F472B6';

// Legacy aliases (kept for backward compat with component imports)
export const WARM_AMBER  = '#F59E0B';
export const WARM_CORAL  = '#F97316';
export const WARM_SAGE   = '#10B981';
export const WARM_TEAL   = '#14B8A6';
export const WARM_ERROR  = '#EF4444';
export const WARM_AMBER2 = '#EAB308';

// ── Color Schemes ─────────────────────────────────────────────────────────────
export const Colors = {
  light: {
    background:      '#F5F5FF',
    surface:         '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border:          'rgba(99,102,241,0.12)',
    borderLight:     'rgba(99,102,241,0.06)',
    text:            '#0F0F23',
    textSecondary:   '#4B4B6B',
    textMuted:       '#9090A0',
    tint:            BOLD_INDIGO,
    tintSecondary:   BOLD_ORANGE,
    tabBar:          'rgba(245,245,255,0.97)',
    card:            '#FFFFFF',
    card2:           '#F5F5FF',
    shadow:          'rgba(99,102,241,0.12)',
    shadowMedium:    'rgba(99,102,241,0.22)',
    success:         BOLD_GREEN,
    warning:         BOLD_GOLD,
    error:           BOLD_RED,
    overdue:         BOLD_RED,
    priorityHigh:    BOLD_RED,
    priorityMedium:  BOLD_GOLD,
    priorityLow:     BOLD_GREEN,
    streak:          BOLD_ORANGE,
    habit:           BOLD_CYAN,
    goal:            BOLD_PURPLE,
    gradientStart:   BOLD_INDIGO,
    gradientEnd:     BOLD_PURPLE,
    gradientMid:     BOLD_BLUE,
    pillActive:      BOLD_INDIGO,
    pillInactive:    '#EBEBFF',
    segmentBg:       '#EBEBFF',
    inputBg:         '#FAFAFF',
    dim:             '#9090A0',
  },
  dark: {
    background:      '#0B0B14',
    surface:         '#13131F',
    surfaceElevated: '#1C1C2E',
    border:          'rgba(129,140,248,0.10)',
    borderLight:     'rgba(129,140,248,0.05)',
    text:            '#EEEEFF',
    textSecondary:   '#9090B0',
    textMuted:       '#55556A',
    tint:            '#818CF8',
    tintSecondary:   '#FB923C',
    tabBar:          'rgba(11,11,20,0.0)',
    card:            '#18182A',
    card2:           '#1C1C2E',
    shadow:          'rgba(0,0,0,0.6)',
    shadowMedium:    'rgba(0,0,0,0.8)',
    success:         '#34D399',
    warning:         '#FBBF24',
    error:           '#F87171',
    overdue:         '#F87171',
    priorityHigh:    '#F87171',
    priorityMedium:  '#FBBF24',
    priorityLow:     '#34D399',
    streak:          '#FB923C',
    habit:           '#22D3EE',
    goal:            '#A78BFA',
    gradientStart:   '#818CF8',
    gradientEnd:     '#A78BFA',
    gradientMid:     '#60A5FA',
    pillActive:      '#818CF8',
    pillInactive:    '#1C1C2E',
    segmentBg:       '#13131F',
    inputBg:         '#1C1C2E',
    dim:             '#55556A',
  },
};

export type ColorScheme = typeof Colors.light;

// ── Fonts ─────────────────────────────────────────────────────────────────────
export const F = {
  reg:       'Cairo_400Regular',
  med:       'Cairo_600SemiBold',
  bold:      'Cairo_700Bold',
  black:     'Cairo_900Black',
  numReg:    'Inter_400Regular',
  numBold:   'Inter_700Bold',
  brand:     'Comfortaa_700Bold',
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ── Border Radius ─────────────────────────────────────────────────────────────
export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 34,
  full: 9999,
};

// ── Shadows ───────────────────────────────────────────────────────────────────
export const Shadow = {
  sm: {
    shadowColor: BOLD_INDIGO,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: BOLD_INDIGO,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: BOLD_INDIGO,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.20,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const ShadowDark = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 10,
    elevation: 5,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 10,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.70,
    shadowRadius: 30,
    elevation: 16,
  },
};

// ── Typography ────────────────────────────────────────────────────────────────
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

// ── Bold & Colorful Gradients ─────────────────────────────────────────────────

// Primary gradients (Indigo → Purple family)
export const GRADIENT_H: readonly [string, string]        = ['#6366F1', '#8B5CF6'];
export const GRADIENT_D: readonly [string, string, string]= ['#6366F1', '#8B5CF6', '#F97316'];
export const GRADIENT_INDIGO: readonly [string, string]   = ['#6366F1', '#8B5CF6'];
export const GRADIENT_PURPLE: readonly [string, string]   = ['#8B5CF6', '#EC4899'];

// Accent gradients
export const GRADIENT_ORANGE: readonly [string, string]   = ['#F97316', '#EF4444'];
export const GRADIENT_CORAL: readonly [string, string]    = ['#EF4444', '#F97316'];
export const GRADIENT_CYAN: readonly [string, string]     = ['#06B6D4', '#3B82F6'];
export const GRADIENT_GOLD: readonly [string, string]     = ['#EAB308', '#F97316'];
export const GRADIENT_AMBER: readonly [string, string]    = ['#F59E0B', '#EAB308'];
export const GRADIENT_GREEN: readonly [string, string]    = ['#10B981', '#06B6D4'];
export const GRADIENT_TEAL: readonly [string, string, string] = ['#14B8A6', '#06B6D4', '#3B82F6'];
export const GRADIENT_SAGE: readonly [string, string]     = ['#10B981', '#14B8A6'];
export const GRADIENT_ROSE: readonly [string, string]     = ['#EC4899', '#8B5CF6'];
export const GRADIENT_WARM: readonly [string, string]     = ['#FB923C', '#F59E0B'];

// Dark mode card/header gradients
export const GRADIENT_DARK_CARD: readonly [string, string]            = ['#1C1C2E', '#16162A'];
export const GRADIENT_DARK_CARD_ELEVATED: readonly [string, string]   = ['#21213A', '#1A1A2E'];
export const GRADIENT_DARK_HEADER: readonly [string, string, string]  = ['#1A1A2E', '#12122A', '#0B0B14'];
export const GRADIENT_DARK_BRAND: readonly [string, string]           = ['#6366F1', '#4F46E5'];
export const GRADIENT_DARK_BRAND_SUBTLE: readonly [string, string]    = ['rgba(129,140,248,0.18)', 'rgba(129,140,248,0.03)'];
export const GRADIENT_DARK_SAGE_SUBTLE: readonly [string, string]     = ['rgba(34,211,238,0.15)', 'rgba(34,211,238,0.03)'];

// ── Shadow Helpers ────────────────────────────────────────────────────────────
function shadowHelper(color = PRIMARY, strength = 4) {
  return Platform.select({
    ios: {
      shadowColor:   color,
      shadowOffset:  { width: 0, height: strength / 2 },
      shadowOpacity: 0.12,
      shadowRadius:  strength,
    },
    android: { elevation: strength },
  }) ?? {};
}

export const cardShadow    = shadowHelper(PRIMARY, 3);
export const primaryShadow = shadowHelper(PRIMARY, 8);
export const softShadow    = shadowHelper(PRIMARY, 4);
