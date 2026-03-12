import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Spacing, Typography } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  rightContent?: React.ReactNode;
}

export function SectionHeader({ title, actionLabel, onAction, rightContent }: SectionHeaderProps) {
  const { C } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: C.text }]}>{title}</Text>
      {rightContent}
      {actionLabel && (
        <Pressable onPress={onAction}>
          <Text style={[styles.action, { color: C.tint }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  title: {
    ...Typography.heading3,
    flex: 1,
  },
  action: {
    ...Typography.captionMedium,
    fontFamily: 'Inter_600SemiBold',
  },
});
