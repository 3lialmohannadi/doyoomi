import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Colors, Radius, Typography } from '../../theme';
import { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  label: string;
}

export function PriorityBadge({ priority, label }: PriorityBadgeProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  const colors: Record<Priority, string> = {
    high: C.priorityHigh,
    medium: C.priorityMedium,
    low: C.priorityLow,
  };

  const color = colors[priority];

  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    ...Typography.label,
    fontFamily: 'Inter_600SemiBold',
  },
});
