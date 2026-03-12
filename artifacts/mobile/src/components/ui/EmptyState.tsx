import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Typography } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const { C } = useAppTheme();

  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={`${title}${subtitle ? '. ' + subtitle : ''}`}>
      <View style={[styles.iconContainer, { backgroundColor: C.tint + '15' }]}>
        <Ionicons name={icon} size={32} color={C.tint} />
      </View>
      <Text style={[styles.title, { color: C.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: C.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.subtitle,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.caption,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
});
