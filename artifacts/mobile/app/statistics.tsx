import React, { useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format, subDays, parseISO, startOfWeek, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

import { useTasksStore } from '../src/store/tasksStore';
import { useHabitsStore } from '../src/store/habitsStore';
import { useGoalsStore } from '../src/store/goalsStore';
import { useJournalStore } from '../src/store/journalStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { Spacing, Radius, F, PRIMARY, GRADIENT_H, GRADIENT_GREEN, GRADIENT_CORAL, GRADIENT_AMBER, GRADIENT_SAGE, GRADIENT_CYAN, GRADIENT_DARK_CARD, GRADIENT_DARK_HEADER, Shadow, ShadowDark } from '../src/theme';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { t } from '../src/utils/i18n';

const MOOD_SCORES: Record<string, number> = {
  excellent: 10, veryGood: 9, happy: 8, excited: 9, energetic: 8, grateful: 9, optimistic: 8, proud: 8,
  satisfied: 7, good: 7, reassured: 6, comfortable: 6, calm: 6, surprised: 6,
  neutral: 5, hesitant: 4, distracted: 4, bored: 4, lazy: 4,
  tired: 3, exhausted: 2, anxious: 3, stressed: 3, scared: 3, lonely: 3,
  frustrated: 2, sad: 2, bad: 2, sick: 2, depressed: 1, angry: 1,
};

export default function StatisticsScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';
  const tFunc = (key: string) => t(key, lang);

  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { goals } = useGoalsStore();
  const { entries } = useJournalStore();

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const weekAgo = subDays(today, 7);
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const stats = useMemo(() => {
    // Tasks
    const activeTasks = tasks.filter(t => t.status !== 'cancelled');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const cancelledTasks = tasks.filter(t => t.status === 'cancelled');
    const overdueTasks = tasks.filter(t => t.status === 'overdue');
    const completedThisWeek = completedTasks.filter(t => {
      const d = t.completed_at ?? t.updated_at;
      return d && parseISO(d) >= weekAgo;
    });
    const completedThisMonth = completedTasks.filter(t => {
      const d = t.completed_at ?? t.updated_at;
      if (!d) return false;
      const pd = parseISO(d);
      return pd >= monthStart && pd <= monthEnd;
    });
    const taskCompletionRate = activeTasks.length > 0
      ? Math.round((completedTasks.length / activeTasks.length) * 100)
      : 0;
    const recurringTasks = tasks.filter(t => t.recurrence);
    const tasksWithSubtasks = tasks.filter(t => t.subtasks && t.subtasks.length > 0);

    // Habits
    const totalHabits = habits.length;
    const completedTodayHabits = habits.filter(h => {
      const lastDate = h.last_completed_at ? format(new Date(h.last_completed_at), 'yyyy-MM-dd') : null;
      return lastDate === todayStr;
    }).length;
    const avgStreak = totalHabits > 0
      ? Math.round(habits.reduce((sum, h) => sum + h.streak_days, 0) / totalHabits)
      : 0;
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.best_streak ?? h.streak_days), 0);
    const bestStreakHabit = habits.find(h => (h.best_streak ?? h.streak_days) === bestStreak);
    const habitCompletionRateWeek = totalHabits > 0
      ? Math.round((completedTodayHabits / totalHabits) * 100)
      : 0;
    const totalCompletionsThisWeek = habits.reduce((sum, h) => {
      return sum + (h.completion_history ?? []).filter(d => parseISO(d) >= weekAgo).length;
    }, 0);

    // Goals
    const activeGoals = goals.filter(g => !g.is_archived);
    const archivedGoals = goals.filter(g => g.is_archived);
    const completedGoals = activeGoals.filter(g => g.current_value >= g.target_value);
    const avgGoalProgress = activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, g) => sum + (g.target_value > 0 ? Math.min(g.current_value / g.target_value, 1) : 0), 0) / activeGoals.length * 100)
      : 0;

    // Journal
    const totalEntries = entries.length;
    const entriesThisMonth = entries.filter(e => {
      const pd = parseISO(e.date);
      return pd >= monthStart && pd <= monthEnd;
    }).length;
    const entriesThisWeek = entries.filter(e => parseISO(e.date) >= weekAgo).length;
    const moodsWithScore = entries.filter(e => e.mood && MOOD_SCORES[e.mood] !== undefined);
    const avgMoodScore = moodsWithScore.length > 0
      ? (moodsWithScore.reduce((sum, e) => sum + MOOD_SCORES[e.mood!], 0) / moodsWithScore.length)
      : 0;

    return {
      // Tasks
      totalTasks: tasks.length,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      cancelledTasks: cancelledTasks.length,
      overdueTasks: overdueTasks.length,
      completedThisWeek: completedThisWeek.length,
      completedThisMonth: completedThisMonth.length,
      taskCompletionRate,
      recurringTasks: recurringTasks.length,
      tasksWithSubtasks: tasksWithSubtasks.length,
      // Habits
      totalHabits,
      completedTodayHabits,
      avgStreak,
      bestStreak,
      bestStreakHabit: bestStreakHabit?.name_ar ?? bestStreakHabit?.name_en ?? bestStreakHabit?.name ?? '',
      habitCompletionRateWeek,
      totalCompletionsThisWeek,
      // Goals
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      archivedGoals: archivedGoals.length,
      avgGoalProgress,
      // Journal
      totalEntries,
      entriesThisMonth,
      entriesThisWeek,
      avgMoodScore: Math.round(avgMoodScore * 10) / 10,
    };
  }, [tasks, habits, goals, entries, todayStr, weekAgo, monthStart, monthEnd]);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? [...GRADIENT_DARK_HEADER] : ['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.sm }, isDark && styles.headerDark]}
      >
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
            hitSlop={12}
          >
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.headerTitle, { color: '#fff' }]}>{tFunc('statistics')}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: bottomPad + 80, gap: Spacing.lg }}
      >
        {/* Tasks Section */}
        <SectionHeader icon="checkmark-circle-outline" title={tFunc('tasks')} grad={GRADIENT_H} />
        <View style={[styles.grid2]}>
          <StatCard
            label={tFunc('total')}
            value={stats.totalTasks}
            icon="list-outline"
            grad={GRADIENT_H}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('done')}
            value={stats.completedTasks}
            icon="checkmark-circle-outline"
            grad={GRADIENT_GREEN}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('thisWeek')}
            value={stats.completedThisWeek}
            icon="calendar-outline"
            grad={GRADIENT_SAGE}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('thisMonth')}
            value={stats.completedThisMonth}
            icon="calendar-number-outline"
            grad={GRADIENT_CYAN}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('overdue')}
            value={stats.overdueTasks}
            icon="alert-circle-outline"
            grad={GRADIENT_CORAL}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('cancelled')}
            value={stats.cancelledTasks}
            icon="close-circle-outline"
            grad={['#94A3B8', '#64748B']}
            C={C}
            isDark={isDark}
          />
        </View>
        <ProgressCard
          label={tFunc('completionRate')}
          value={stats.taskCompletionRate}
          grad={GRADIENT_GREEN}
          C={C}
          isDark={isDark}
          isRTL={isRTL}
        />

        {/* Habits Section */}
        <SectionHeader icon="leaf-outline" title={tFunc('habits')} grad={['#F97316', '#EF4444']} />
        <View style={[styles.grid2]}>
          <StatCard
            label={tFunc('total')}
            value={stats.totalHabits}
            icon="leaf-outline"
            grad={['#F97316', '#EF4444']}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('todayDone')}
            value={`${stats.completedTodayHabits}/${stats.totalHabits}`}
            icon="today-outline"
            grad={GRADIENT_AMBER}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('avgStreak')}
            value={`${stats.avgStreak} ${tFunc('days')}`}
            icon="flame-outline"
            grad={['#F97316', '#EF4444']}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('bestStreak')}
            value={`${stats.bestStreak} ${tFunc('days')}`}
            icon="trophy-outline"
            grad={GRADIENT_AMBER}
            C={C}
            isDark={isDark}
          />
        </View>
        {stats.totalCompletionsThisWeek > 0 && (
          <InfoCard
            icon="bar-chart-outline"
            text={`${stats.totalCompletionsThisWeek} ${tFunc('habitCompletionsWeek')}`}
            grad={['#F97316', '#EF4444']}
            C={C}
            isDark={isDark}
          />
        )}

        {/* Goals Section */}
        <SectionHeader icon="trophy-outline" title={tFunc('goals')} grad={['#8B5CF6', '#EC4899']} />
        <View style={[styles.grid2]}>
          <StatCard
            label={tFunc('total')}
            value={stats.totalGoals}
            icon="trophy-outline"
            grad={['#8B5CF6', '#EC4899']}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('completed')}
            value={stats.completedGoals}
            icon="checkmark-done-circle-outline"
            grad={GRADIENT_GREEN}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('archivedGoalsTab')}
            value={stats.archivedGoals}
            icon="archive-outline"
            grad={['#94A3B8', '#64748B']}
            C={C}
            isDark={isDark}
          />
        </View>
        <ProgressCard
          label={tFunc('avgGoalProgress')}
          value={stats.avgGoalProgress}
          grad={['#8B5CF6', '#EC4899']}
          C={C}
          isDark={isDark}
          isRTL={isRTL}
        />

        {/* Journal Section */}
        <SectionHeader icon="journal-outline" title={tFunc('journal')} grad={GRADIENT_SAGE} />
        <View style={[styles.grid2]}>
          <StatCard
            label={tFunc('total')}
            value={stats.totalEntries}
            icon="journal-outline"
            grad={GRADIENT_SAGE}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('thisWeek')}
            value={stats.entriesThisWeek}
            icon="calendar-outline"
            grad={GRADIENT_SAGE}
            C={C}
            isDark={isDark}
          />
          <StatCard
            label={tFunc('thisMonth')}
            value={stats.entriesThisMonth}
            icon="calendar-number-outline"
            grad={GRADIENT_CYAN}
            C={C}
            isDark={isDark}
          />
          {stats.avgMoodScore > 0 && (
            <StatCard
              label={tFunc('avgMood')}
              value={`${stats.avgMoodScore}/10`}
              icon="happy-outline"
              grad={stats.avgMoodScore >= 7 ? GRADIENT_GREEN : stats.avgMoodScore >= 5 ? GRADIENT_AMBER : GRADIENT_CORAL}
              C={C}
              isDark={isDark}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ icon, title, grad }: { icon: string; title: string; grad: readonly [string, string] }) {
  return (
    <View style={shStyles.row}>
      <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={shStyles.iconBox}>
        <Ionicons name={icon as any} size={18} color="#fff" />
      </LinearGradient>
      <Text style={shStyles.title}>{title}</Text>
    </View>
  );
}

const shStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: F.black, color: '#666' },
});

import { ColorScheme } from '../src/theme';

function StatCard({ label, value, icon, grad, C, isDark }: {
  label: string;
  value: string | number;
  icon: string;
  grad: readonly [string, string];
  C: ColorScheme;
  isDark: boolean;
}) {
  return (
    <View style={[scStyles.card, isDark ? ShadowDark.sm : Shadow.sm, { borderColor: C.border, overflow: 'hidden' }]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={scStyles.topBar} />
      <View style={scStyles.body}>
        <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={scStyles.iconCircle}>
          <Ionicons name={icon as any} size={16} color="#fff" />
        </LinearGradient>
        <Text style={[scStyles.value, { color: grad[0] }]}>{value}</Text>
        <Text style={[scStyles.label, { color: C.textSecondary }]} numberOfLines={2}>{label}</Text>
      </View>
    </View>
  );
}

const scStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    minWidth: '45%',
    overflow: 'hidden',
  },
  topBar: { height: 3 },
  body: { padding: Spacing.md, gap: 6, alignItems: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 22, fontFamily: F.black, textAlign: 'center' },
  label: { fontSize: 12, fontFamily: F.med, textAlign: 'center', lineHeight: 16 },
});

function ProgressCard({ label, value, grad, C, isDark, isRTL }: {
  label: string;
  value: number;
  grad: readonly [string, string];
  C: ColorScheme;
  isDark: boolean;
  isRTL: boolean;
}) {
  return (
    <View style={[pcStyles.card, isDark ? ShadowDark.sm : Shadow.sm, { borderColor: C.border, overflow: 'hidden' }]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <View style={pcStyles.body}>
        <Text style={[pcStyles.label, { color: C.textSecondary }]}>{label}</Text>
        <Text style={[pcStyles.value, { color: grad[0] }]}>{value}%</Text>
      </View>
      <View style={[pcStyles.track, { backgroundColor: grad[0] + '18' }]}>
        <LinearGradient
          colors={[...grad]}
          start={{ x: isRTL ? 1 : 0, y: 0 }}
          end={{ x: isRTL ? 0 : 1, y: 0 }}
          style={[pcStyles.fill, { width: `${Math.min(value, 100)}%`, alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
        />
      </View>
    </View>
  );
}

const pcStyles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  label: { fontSize: 14, fontFamily: F.med },
  value: { fontSize: 24, fontFamily: F.black },
  track: { height: 10, margin: Spacing.sm, marginTop: 0, borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
});

function InfoCard({ icon, text, grad, C, isDark }: {
  icon: string; text: string;
  grad: readonly [string, string]; C: ColorScheme; isDark: boolean;
}) {
  return (
    <View style={[infoStyles.card, { borderColor: grad[0] + '30', overflow: 'hidden' }, isDark ? ShadowDark.sm : Shadow.sm]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: grad[0] + '08' }]} />}
      <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={infoStyles.iconBox}>
        <Ionicons name={icon as any} size={16} color="#fff" />
      </LinearGradient>
      <Text style={[infoStyles.text, { color: grad[0] }]}>{text}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  iconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  text: { fontSize: 14, fontFamily: F.med, flex: 1 },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(129,140,248,0.08)',
  },
  headerRow: { alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontFamily: F.black },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
