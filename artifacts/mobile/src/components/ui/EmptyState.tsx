import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Spacing, Typography, Radius } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  gradient?: [string, string];
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction, gradient = ['#7C5CFC', '#A855F7'] }: EmptyStateProps) {
  const { C } = useAppTheme();

  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={`${title}${subtitle ? '. ' + subtitle : ''}`}>
      <View style={[styles.iconRing, { borderColor: gradient[0] + '25' }]}>
        <LinearGradient
          colors={[gradient[0] + '18', gradient[1] + '18']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Ionicons name={icon} size={36} color={gradient[0]} />
        </LinearGradient>
      </View>
      <Text style={[styles.title, { color: C.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: C.textSecondary }]}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onAction(); }}
          style={[styles.actionBtn, { overflow: 'hidden' }]}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
          />
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2.5,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xxl,
  },
  iconRing: {
    borderRadius: 48,
    borderWidth: 1.5,
    padding: 6,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.subtitle,
    textAlign: 'center',
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    ...Typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    height: 46,
  },
  actionText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
});
