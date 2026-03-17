// ─── Do.Yoomi — Design System (React Native) ──────────────────────────────────
// استخدم هذا الملف في كل شاشات التطبيق
//
// الحزم المطلوبة:
//   npx expo install expo-linear-gradient
//   npm install lucide-react-native
//   npm install react-native-safe-area-context react-native-screens
//   npx expo install @expo-google-fonts/cairo @expo-google-fonts/inter @expo-google-fonts/comfortaa
// ────────────────────────────────────────────────────────────────────────────────

import { Platform } from 'react-native';

// ─── Colors ───────────────────────────────────────────────────────────────────

export const PRIMARY   = '#6C47FF';
export const SECONDARY = '#FF6B8A';

export const LIGHT = {
  bg:      '#F0EDFF',
  card:    '#FFFFFF',
  card2:   '#F8F5FF',
  border:  'rgba(108,71,255,0.12)',
  text:    '#1A1A2E',
  muted:   '#8B8B9E',
  dim:     '#B0B0C0',
};

export const DARK = {
  bg:      '#0D0D1A',
  card:    '#1A1A30',
  card2:   '#22223A',
  border:  'rgba(255,255,255,0.08)',
  text:    '#EEEEFF',
  muted:   '#9B9BB8',
  dim:     '#6B6B88',
};

// Gradient arrays (for expo-linear-gradient)
export const GRADIENT_H = ['#6C47FF', '#FF6B8A'] as const; // left → right
export const GRADIENT_V = ['#6C47FF', '#FF6B8A'] as const; // top → bottom
export const GRADIENT_D = ['#6C47FF', '#9B5DE5', '#FF6B8A'] as const; // diagonal

// Priority & Status colors
export const PRIORITY = {
  high:   { color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
  mid:    { color: '#FB923C', bg: 'rgba(251,146,60,0.12)'  },
  low:    { color: '#4ADE80', bg: 'rgba(74,222,128,0.12)'  },
};

// ─── Typography ───────────────────────────────────────────────────────────────

export const F = {
  // Cairo (Arabic text)
  reg:       'Cairo_400Regular',
  med:       'Cairo_600SemiBold',
  bold:      'Cairo_700Bold',
  black:     'Cairo_900Black',
  // Inter (numbers / Latin)
  numReg:    'Inter_400Regular',
  numBold:   'Inter_700Bold',
  // Comfortaa (brand name)
  brand:     'Comfortaa_700Bold',
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const S = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const R = {
  sm:   8,
  md:   14,
  lg:   20,
  xl:   28,
  full: 9999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export function shadow(color = '#000', strength = 4) {
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

export const cardShadow    = shadow('#1A1A2E', 3);
export const primaryShadow = shadow('#6C47FF', 8);
export const softShadow    = shadow('#6C47FF', 4);

// ─── Helper ───────────────────────────────────────────────────────────────────

export type ColorScheme = 'light' | 'dark';

export function theme(scheme: ColorScheme) {
  return scheme === 'dark' ? DARK : LIGHT;
}

// ─── Font loading (paste in your App.tsx) ─────────────────────────────────────
/*
import {
  useFonts,
  Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold, Cairo_900Black,
} from '@expo-google-fonts/cairo';
import {
  Inter_400Regular, Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Comfortaa_700Bold,
} from '@expo-google-fonts/comfortaa';

export default function App() {
  const [fontsLoaded] = useFonts({
    Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold, Cairo_900Black,
    Inter_400Regular, Inter_700Bold,
    Comfortaa_700Bold,
  });
  if (!fontsLoaded) return null;
  // ...
}
*/
