import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Task } from '../../types';
import { Radius, Spacing, Typography, F, GRADIENT_DARK_CARD, Shadow, ShadowDark } from '../../theme';
import { PriorityBadge } from './PriorityBadge';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useSettingsStore } from '../../store/settingsStore';
import { resolveDisplayName } from '../../utils/i18n';
import { SECONDARY } from '../../theme';
import { MiniConfetti } from './MiniConfetti';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteRequest?: (task: Task) => void;
  onPostpone: (id: string) => void;
  onEdit: (task: Task) => void;
  onPress?: (task: Task) => void;
  priorityLabel: string;
  timeStr?: string;
  categoryName?: string;
  categoryColor?: string;
  t: (key: string) => string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskCard({
  task, onToggle, onDelete, onDeleteRequest, onPostpone, onEdit, onPress,
  priorityLabel, timeStr, categoryName, categoryColor, t,
}: TaskCardProps) {
  const { C, scheme } = useAppTheme();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';
  const isDark = scheme === 'dark';
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const isCompleted = task.status === 'completed';
  const isOverdue = task.status === 'overdue';
  const isPostponed = task.status === 'postponed';

  const [confettiKey, setConfettiKey] = useState(0);
  const prevCompleted = useRef(isCompleted);
  useEffect(() => {
    if (isCompleted && !prevCompleted.current) {
      setConfettiKey(k => k + 1);
    }
    prevCompleted.current = isCompleted;
  }, [isCompleted]);

  const accentColor = isOverdue ? C.error
    : isCompleted ? C.success
    : task.priority === 'high' ? C.priorityHigh
    : task.priority === 'medium' ? C.priorityMedium
    : C.priorityLow;

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      task.title,
      undefined,
      [
        { text: t('postpone'), onPress: () => onPostpone(task.id) },
        {
          text: t('deleteTask'), style: 'destructive',
          onPress: () => onDeleteRequest ? onDeleteRequest(task) : onDelete(task.id),
        },
        { text: t('cancel'), style: 'cancel' },
      ]
    );
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onDeleteRequest) {
      onDeleteRequest(task);
    } else {
      onDelete(task.id);
    }
  };

  return (
    <AnimatedPressable
      style={[animStyle, { position: 'relative' }, isDark ? ShadowDark.sm : Shadow.sm]}
      onPress={onPress ? () => onPress(task) : undefined}
      onPressIn={() => { scale.value = withSpring(0.985, { damping: 18 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 18 }); }}
      onLongPress={handleLongPress}
    >
      <View style={[
        styles.card,
        isDark
          ? { borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }
          : { backgroundColor: C.card, borderColor: C.border, overflow: 'hidden' },
        { flexDirection: isRTL ? 'row-reverse' : 'row' },
      ]}>
        {isDark && (
          <LinearGradient
            colors={[...GRADIENT_DARK_CARD]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <Pressable
          onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onToggle(task.id); }}
          style={[styles.checkbox, isRTL ? styles.checkboxRTL : null]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={task.title}
        >
          <View style={[
            styles.checkCircle,
            {
              borderColor: isCompleted ? C.success : (isDark ? 'rgba(255,255,255,0.2)' : C.border),
              backgroundColor: isCompleted ? C.success : 'transparent',
            },
          ]}>
            {isCompleted && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
        </Pressable>

        <View style={[styles.content, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { color: isCompleted ? C.textMuted : C.text, textAlign: isRTL ? 'right' : 'left' },
              isCompleted && styles.strikethrough,
            ]}
          >
            {resolveDisplayName(task.title_ar, task.title_en, profile.language, task.title)}
          </Text>

          {task.description ? (
            <Text numberOfLines={1} style={[styles.desc, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {task.description}
            </Text>
          ) : null}

          <View style={[styles.meta, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <PriorityBadge priority={task.priority} label={priorityLabel} />

            {categoryName ? (
              <View style={[styles.catBadge, { backgroundColor: (categoryColor ?? C.tint) + '22' }]}>
                <Text style={[styles.catText, { color: categoryColor ?? C.tint }]}>{categoryName}</Text>
              </View>
            ) : null}

            {timeStr ? (
              <View style={[styles.timeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Ionicons name="time-outline" size={11} color={C.textMuted} />
                <Text style={[styles.timeText, { color: C.textMuted }]}>{timeStr}</Text>
              </View>
            ) : null}

            {isOverdue ? (
              <View style={[styles.catBadge, { backgroundColor: C.error + '22' }]}>
                <Text style={[styles.catText, { color: C.error }]}>{t('overdue')}</Text>
              </View>
            ) : null}

            {isPostponed ? (
              <View style={[styles.catBadge, { backgroundColor: C.textMuted + '22' }]}>
                <Text style={[styles.catText, { color: C.textMuted }]}>{t('postponed')}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.actionBtns}>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onEdit(task); }}
            style={[styles.editBtn, { backgroundColor: C.tint + '18' }]}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={t('editTask')}
          >
            <Ionicons name="pencil-outline" size={15} color={C.tint} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={[styles.editBtn, { backgroundColor: C.error + '14' }]}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={t('deleteTask')}
          >
            <Ionicons name="trash-outline" size={15} color={C.error} />
          </Pressable>
        </View>
      </View>
      <MiniConfetti trigger={confettiKey} x={isRTL ? 82 : 18} y={50} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  accentBar: {
    width: 5,
    alignSelf: 'stretch',
    borderTopLeftRadius: Radius.xl,
    borderBottomLeftRadius: Radius.xl,
  },
  checkbox: {
    padding: Spacing.md,
    paddingRight: Spacing.sm,
  },
  checkboxRTL: {
    paddingRight: Spacing.md,
    paddingLeft: Spacing.sm,
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
    paddingRight: Spacing.lg,
    gap: 4,
  },
  title: {
    ...Typography.bodyMedium,
    fontFamily: F.med,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  desc: {
    ...Typography.caption,
  },
  meta: {
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
    fontFamily: F.med,
  },
  timeRow: {
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    ...Typography.label,
  },
  actionBtns: {
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  editBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
