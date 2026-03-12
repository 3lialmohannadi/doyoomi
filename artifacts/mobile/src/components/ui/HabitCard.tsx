import React from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { format } from 'date-fns';
import { Habit } from '../../types';
import { Radius, Shadow, Spacing, Typography } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
  t: (key: string) => string;
}

const HABIT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  leaf: 'leaf-outline',
  water: 'water-outline',
  journal: 'journal-outline',
  'phone-portrait': 'phone-portrait-outline',
  fitness: 'fitness-outline',
  moon: 'moon-outline',
  book: 'book-outline',
  nutrition: 'nutrition-outline',
  walk: 'walk-outline',
  bed: 'bed-outline',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HabitCard({ habit, onComplete, onEdit, onDelete, compact = false, t }: HabitCardProps) {
  const { C } = useAppTheme();
  const scale = useSharedValue(1);

  const today = format(new Date(), 'yyyy-MM-dd');
  const lastDate = habit.last_completed_at
    ? format(new Date(habit.last_completed_at), 'yyyy-MM-dd')
    : null;
  const isDoneToday = lastDate === today;

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const iconName = HABIT_ICONS[habit.icon] ?? 'star-outline';

  const handleMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(habit.name, undefined, [
      { text: t('editHabit'), onPress: () => onEdit(habit) },
      { text: t('deleteHabit'), style: 'destructive', onPress: () => onDelete(habit.id) },
      { text: t('cancel'), style: 'cancel' },
    ]);
  };

  if (compact) {
    return (
      <AnimatedPressable
        style={[animStyle, styles.compactCard, { backgroundColor: C.card, borderColor: C.border }]}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onLongPress={handleMenu}
      >
        <View style={[styles.compactIcon, { backgroundColor: habit.color + '20' }]}>
          <Ionicons name={iconName} size={18} color={habit.color} />
        </View>
        <Text style={[styles.compactName, { color: C.text }]} numberOfLines={1}>{habit.name}</Text>
        <View style={styles.compactMeta}>
          <Ionicons name="flame" size={12} color={C.streak} />
          <Text style={[styles.compactStreak, { color: C.streak }]}>{habit.streak_days}</Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onComplete(habit.id);
          }}
          style={[
            styles.compactCheck,
            {
              backgroundColor: isDoneToday ? habit.color : 'transparent',
              borderColor: isDoneToday ? habit.color : C.border,
            },
          ]}
        >
          {isDoneToday && <Ionicons name="checkmark" size={10} color="#fff" />}
        </Pressable>
      </AnimatedPressable>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={[styles.iconBox, { backgroundColor: habit.color + '20' }]}>
        <Ionicons name={iconName} size={22} color={habit.color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: C.text }]}>{habit.name}</Text>
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={14} color={C.streak} />
          <Text style={[styles.streakText, { color: C.streak }]}>{habit.streak_days} {t('days')}</Text>
        </View>
      </View>
      <Pressable onPress={handleMenu} hitSlop={8} style={styles.menuBtn}>
        <Ionicons name="ellipsis-horizontal" size={18} color={C.textMuted} />
      </Pressable>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onComplete(habit.id);
        }}
        style={[
          styles.checkBtn,
          {
            backgroundColor: isDoneToday ? habit.color : 'transparent',
            borderColor: isDoneToday ? habit.color : C.border,
          },
        ]}
      >
        {isDoneToday
          ? <Ionicons name="checkmark" size={16} color="#fff" />
          : <Text style={[styles.checkLabel, { color: C.textMuted }]}>{t('completeHabit')}</Text>
        }
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { ...Typography.bodyMedium },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  streakText: { ...Typography.caption },
  menuBtn: { padding: 4 },
  checkBtn: {
    borderRadius: Radius.full,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
  },
  checkLabel: { ...Typography.label, fontFamily: 'Inter_500Medium' },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.sm,
    gap: Spacing.sm,
    minWidth: 140,
    ...Shadow.sm,
  },
  compactIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactName: { ...Typography.captionMedium, flex: 1, fontFamily: 'Inter_500Medium' },
  compactMeta: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  compactStreak: { ...Typography.label, fontFamily: 'Inter_700Bold' },
  compactCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
