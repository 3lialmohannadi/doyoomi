import React from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Task } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme';
import { PriorityBadge } from './PriorityBadge';
import { useAppTheme } from '../../hooks/useAppTheme';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPostpone: (id: string) => void;
  onEdit: (task: Task) => void;
  priorityLabel: string;
  timeStr?: string;
  categoryName?: string;
  categoryColor?: string;
  lang?: string;
  t: (key: string) => string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskCard({ task, onToggle, onDelete, onPostpone, onEdit, priorityLabel, timeStr, categoryName, categoryColor, t }: TaskCardProps) {
  const { C } = useAppTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isCompleted = task.status === 'completed';
  const isOverdue = task.status === 'overdue';
  const isPostponed = task.status === 'postponed';

  const accentColor = isOverdue ? C.error
    : isCompleted ? C.success
    : task.priority === 'high' ? C.priorityHigh
    : task.priority === 'medium' ? C.priorityMedium
    : C.priorityLow;

  const handleMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      task.title,
      undefined,
      [
        { text: t('editTask'), onPress: () => onEdit(task) },
        { text: t('postpone'), onPress: () => onPostpone(task.id) },
        { text: t('deleteTask'), style: 'destructive', onPress: () => onDelete(task.id) },
        { text: t('cancel'), style: 'cancel' },
      ]
    );
  };

  return (
    <AnimatedPressable
      style={animStyle}
      onPressIn={() => { scale.value = withSpring(0.98); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
        <View style={[styles.accent, { backgroundColor: accentColor }]} />

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onToggle(task.id);
          }}
          style={styles.checkbox}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={task.title}
        >
          <View style={[
            styles.checkCircle,
            {
              borderColor: isCompleted ? C.success : C.border,
              backgroundColor: isCompleted ? C.success : 'transparent',
            },
          ]}>
            {isCompleted && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
        </Pressable>

        <View style={styles.content}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { color: isCompleted ? C.textMuted : C.text },
              isCompleted && styles.strikethrough,
            ]}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text numberOfLines={1} style={[styles.desc, { color: C.textSecondary }]}>
              {task.description}
            </Text>
          ) : null}

          <View style={styles.meta}>
            <PriorityBadge priority={task.priority} label={priorityLabel} />

            {categoryName ? (
              <View style={[styles.catBadge, { backgroundColor: (categoryColor ?? C.tint) + '20' }]}>
                <Text style={[styles.catText, { color: categoryColor ?? C.tint }]}>{categoryName}</Text>
              </View>
            ) : null}

            {timeStr ? (
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={11} color={C.textMuted} />
                <Text style={[styles.timeText, { color: C.textMuted }]}>{timeStr}</Text>
              </View>
            ) : null}

            {isOverdue ? (
              <View style={[styles.catBadge, { backgroundColor: C.error + '20' }]}>
                <Text style={[styles.catText, { color: C.error }]}>{t('overdue')}</Text>
              </View>
            ) : null}

            {isPostponed ? (
              <View style={[styles.catBadge, { backgroundColor: C.textMuted + '20' }]}>
                <Text style={[styles.catText, { color: C.textMuted }]}>{t('postponed')}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Pressable onPress={handleMenu} style={styles.menu} hitSlop={8} accessibilityRole="button" accessibilityLabel="Task options">
          <Ionicons name="ellipsis-horizontal" size={18} color={C.textMuted} />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
  },
  checkbox: {
    padding: Spacing.md,
    paddingRight: Spacing.sm,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingRight: Spacing.sm,
    gap: 4,
  },
  title: {
    ...Typography.bodyMedium,
    fontFamily: 'Inter_500Medium',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  desc: {
    ...Typography.caption,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
    marginTop: 2,
  },
  catBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  catText: {
    ...Typography.label,
    fontFamily: 'Inter_600SemiBold',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    ...Typography.label,
  },
  menu: {
    padding: Spacing.md,
  },
});
