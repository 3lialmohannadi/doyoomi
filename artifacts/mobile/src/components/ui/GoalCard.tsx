import React from 'react';
import { StyleSheet, Text, View, Pressable, useColorScheme, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Goal } from '../../types';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../theme';
import { ProgressBar } from './ProgressBar';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onIncrement: (id: string) => void;
  typeLabel: string;
  t: (key: string) => string;
}

const GOAL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  book: 'book-outline',
  fitness: 'fitness-outline',
  card: 'card-outline',
  language: 'language-outline',
  star: 'star-outline',
  heart: 'heart-outline',
  trophy: 'trophy-outline',
  rocket: 'rocket-outline',
  leaf: 'leaf-outline',
  water: 'water-outline',
};

export function GoalCard({ goal, onEdit, onDelete, onIncrement, typeLabel, t }: GoalCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];
  const progress = goal.target_value > 0 ? goal.current_value / goal.target_value : 0;
  const pct = Math.round(progress * 100);
  const iconName = GOAL_ICONS[goal.icon] ?? 'star-outline';

  const handleMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(goal.title, undefined, [
      { text: t('editGoal'), onPress: () => onEdit(goal) },
      { text: t('deleteGoal'), style: 'destructive', onPress: () => onDelete(goal.id) },
      { text: t('cancel'), style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: goal.color + '20' }]}>
          <Ionicons name={iconName} size={20} color={goal.color} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: C.text }]} numberOfLines={1}>{goal.title}</Text>
          <View style={styles.typeRow}>
            <View style={[styles.typeBadge, { backgroundColor: goal.color + '15' }]}>
              <Text style={[styles.typeText, { color: goal.color }]}>{typeLabel}</Text>
            </View>
          </View>
        </View>
        <Pressable onPress={handleMenu} hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={18} color={C.textMuted} />
        </Pressable>
      </View>

      {goal.description ? (
        <Text style={[styles.desc, { color: C.textSecondary }]} numberOfLines={2}>{goal.description}</Text>
      ) : null}

      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressText, { color: C.textSecondary }]}>
            {goal.current_value} / {goal.target_value}
          </Text>
          <Text style={[styles.progressPct, { color: goal.color, fontFamily: 'Inter_700Bold' }]}>
            {pct}%
          </Text>
        </View>
        <ProgressBar
          progress={progress}
          color={goal.color}
          height={7}
        />
      </View>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onIncrement(goal.id);
        }}
        style={[styles.addBtn, { borderColor: goal.color + '40', backgroundColor: goal.color + '10' }]}
      >
        <Ionicons name="add" size={16} color={goal.color} />
        <Text style={[styles.addBtnText, { color: goal.color }]}>+1</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...Typography.subtitle,
  },
  typeRow: {
    flexDirection: 'row',
  },
  typeBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeText: {
    ...Typography.label,
    fontFamily: 'Inter_600SemiBold',
  },
  desc: {
    ...Typography.caption,
  },
  progressSection: {
    gap: Spacing.xs,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    ...Typography.caption,
  },
  progressPct: {
    ...Typography.bodyMedium,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: 7,
    gap: 4,
  },
  addBtnText: {
    ...Typography.captionMedium,
    fontFamily: 'Inter_600SemiBold',
  },
});
