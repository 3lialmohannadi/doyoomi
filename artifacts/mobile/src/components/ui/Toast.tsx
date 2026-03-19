import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, F, PRIMARY, SECONDARY, WARM_ERROR, GRADIENT_H } from '../../theme';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const CONFIG: Record<ToastType, { color: string; icon: string; border: string }> = {
  success: { color: SECONDARY,   icon: 'checkmark-circle',   border: SECONDARY + '30' },
  error:   { color: WARM_ERROR,  icon: 'alert-circle',       border: WARM_ERROR + '30' },
  info:    { color: PRIMARY,     icon: 'information-circle', border: PRIMARY + '30' },
  warning: { color: '#F97316',   icon: 'warning',            border: '#F97316' + '30' },
};

export function Toast({ message, type = 'success', duration = 2500, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;
  const { C } = useAppTheme();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';

  useEffect(() => {
    Animated.parallel([
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -16, duration: 280, useNativeDriver: true }),
      ]).start(() => onHide());
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const cfg = CONFIG[type];

  return (
    <Animated.View style={[
      styles.toast,
      { backgroundColor: C.card, borderColor: cfg.border, opacity, transform: [{ translateY }], flexDirection: isRTL ? 'row-reverse' : 'row' },
    ]}>
      <Ionicons name={cfg.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={cfg.color} />
      <Text style={[styles.text, { color: cfg.color, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.xl,
    borderWidth: 1,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontFamily: F.med,
  },
});
