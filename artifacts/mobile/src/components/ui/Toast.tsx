import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '../../theme';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const CONFIG: Record<ToastType, { color: string; icon: string; bg: string; border: string }> = {
  success: { color: '#00C48C', icon: 'checkmark-circle',   bg: '#fff', border: '#00C48C30' },
  error:   { color: '#FF4D6A', icon: 'alert-circle',       bg: '#fff', border: '#FF4D6A30' },
  info:    { color: '#7C5CFC', icon: 'information-circle', bg: '#fff', border: '#7C5CFC30' },
};

export function Toast({ message, type = 'success', duration = 2500, onHide }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;

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
      { backgroundColor: cfg.bg, borderColor: cfg.border, opacity, transform: [{ translateY }] },
    ]}>
      <Ionicons name={cfg.icon as any} size={20} color={cfg.color} />
      <Text style={[styles.text, { color: cfg.color }]} numberOfLines={2}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
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
    fontFamily: 'Inter_600SemiBold',
  },
});
