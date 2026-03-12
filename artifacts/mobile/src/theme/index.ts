export const Colors = {
  light: {
    background: '#F2EEFF',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E0D8FF',
    borderLight: '#ECE6FF',
    text: '#1A0A4A',
    textSecondary: '#5C4A8A',
    textMuted: '#A090C8',
    tint: '#7C5CFC',
    tintSecondary: '#FF6B9D',
    tabBar: 'rgba(242,238,255,0.97)',
    card: '#FFFFFF',
    shadow: 'rgba(124, 92, 252, 0.14)',
    shadowMedium: 'rgba(124, 92, 252, 0.22)',
    success: '#00C48C',
    warning: '#FFB800',
    error: '#FF4D6A',
    overdue: '#FF4D6A',
    priorityHigh: '#FF4D6A',
    priorityMedium: '#FFB800',
    priorityLow: '#00C48C',
    streak: '#FF6B35',
    habit: '#A855F7',
    goal: '#7C5CFC',
    gradientStart: '#7C5CFC',
    gradientEnd: '#FF6B9D',
    gradientMid: '#9B6EF5',
    pillActive: '#7C5CFC',
    pillInactive: '#ECE6FF',
    segmentBg: '#ECE6FF',
    inputBg: '#FAF8FF',
  },
  dark: {
    background: '#0D0A1E',
    surface: '#1A1430',
    surfaceElevated: '#231C3F',
    border: '#2E2650',
    borderLight: '#261F45',
    text: '#F0EAFF',
    textSecondary: '#9B8EC8',
    textMuted: '#5A4F80',
    tint: '#9B7FFF',
    tintSecondary: '#FF6B9D',
    tabBar: 'rgba(13,10,30,0.97)',
    card: '#1A1430',
    shadow: 'rgba(0,0,0,0.4)',
    shadowMedium: 'rgba(0,0,0,0.6)',
    success: '#00D4A0',
    warning: '#FFB800',
    error: '#FF5A78',
    overdue: '#FF5A78',
    priorityHigh: '#FF5A78',
    priorityMedium: '#FFB800',
    priorityLow: '#00D4A0',
    streak: '#FF7A4A',
    habit: '#B87FFF',
    goal: '#9B7FFF',
    gradientStart: '#9B7FFF',
    gradientEnd: '#FF6B9D',
    gradientMid: '#B07FFF',
    pillActive: '#9B7FFF',
    pillInactive: '#261F45',
    segmentBg: '#1E1838',
    inputBg: '#1E1838',
  },
};

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
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const Typography = {
  heading1: { fontSize: 32, fontFamily: 'Inter_700Bold', lineHeight: 40 },
  heading2: { fontSize: 26, fontFamily: 'Inter_700Bold', lineHeight: 32 },
  heading3: { fontSize: 20, fontFamily: 'Inter_700Bold', lineHeight: 26 },
  subtitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', lineHeight: 22 },
  body: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontFamily: 'Inter_500Medium', lineHeight: 22 },
  caption: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  captionMedium: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  label: { fontSize: 11, fontFamily: 'Inter_600SemiBold', lineHeight: 14 },
};

export const GRADIENT_PRIMARY: [string, string] = ['#7C5CFC', '#FF6B9D'];
export const GRADIENT_PURPLE: [string, string] = ['#7C5CFC', '#A855F7'];
export const GRADIENT_WARM: [string, string] = ['#FF6B9D', '#FFB347'];
export const GRADIENT_GREEN: [string, string] = ['#00C48C', '#00E5A0'];
export const GRADIENT_ORANGE: [string, string] = ['#FF6B35', '#FFB347'];
