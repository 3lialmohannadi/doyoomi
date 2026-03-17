import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Radius, Typography, F } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useSettingsStore } from '../../store/settingsStore';
import { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  label: string;
}

export function PriorityBadge({ priority, label }: PriorityBadgeProps) {
  const { C } = useAppTheme();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';

  const colors: Record<Priority, string> = {
    high: C.priorityHigh,
    medium: C.priorityMedium,
    low: C.priorityLow,
  };

  const color = colors[priority];

  return (
    <View style={[styles.badge, { backgroundColor: color + '20', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    ...Typography.label,
    fontFamily: F.med,
  },
});
