import React, { useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  format, subDays, parseISO, startOfMonth, endOfMonth,
  getDay, differenceInCalendarDays,
} from 'date-fns';

import { useTasksStore } from '../src/store/tasksStore';
import { useHabitsStore } from '../src/store/habitsStore';
import { useGoalsStore } from '../src/store/goalsStore';
import { useJournalStore } from '../src/store/journalStore';
import { useSettingsStore } from '../src/store/settingsStore';
import {
  Spacing, Radius, F, PRIMARY, SECONDARY,
  GRADIENT_H, GRADIENT_GREEN, GRADIENT_CORAL, GRADIENT_AMBER,
  GRADIENT_SAGE, GRADIENT_CYAN, GRADIENT_DARK_CARD, GRADIENT_DARK_HEADER,
  Shadow, ShadowDark, ColorScheme,
  BOLD_GREEN, BOLD_GOLD, BOLD_ORANGE, BOLD_RED, BOLD_CYAN, BOLD_TEAL,
} from '../src/theme';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { t, resolveDisplayName } from '../src/utils/i18n';
import { WeeklyChart, WeekDayData } from '../src/components/ui/WeeklyChart';
import { Mood, Goal } from '../src/types';

// ── Typed Ionicons helper ──────────────────────────────────────────────────────
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ── Mood config (covers all Mood enum values) ─────────────────────────────────
const MOOD_CONFIG: Partial<Record<Mood, { icon: IoniconName; color: string }>> = {
  excellent:   { icon: 'star',                    color: BOLD_GOLD },
  veryGood:    { icon: 'thumbs-up',               color: BOLD_GREEN },
  happy:       { icon: 'happy',                   color: BOLD_GREEN },
  excited:     { icon: 'rocket-outline',           color: BOLD_GOLD },
  energetic:   { icon: 'flash-outline',            color: BOLD_ORANGE },
  grateful:    { icon: 'heart-outline',            color: '#EC4899' },
  optimistic:  { icon: 'sunny-outline',            color: BOLD_GOLD },
  proud:       { icon: 'ribbon-outline',           color: PRIMARY },
  satisfied:   { icon: 'thumbs-up-outline',        color: BOLD_GREEN },
  good:        { icon: 'happy-outline',            color: BOLD_GREEN },
  reassured:   { icon: 'shield-checkmark-outline', color: BOLD_CYAN },
  comfortable: { icon: 'leaf-outline',             color: BOLD_GREEN },
  calm:        { icon: 'water-outline',            color: BOLD_TEAL },
  surprised:   { icon: 'star-outline',             color: BOLD_GOLD },
  neutral:     { icon: 'remove-circle-outline',    color: '#9090A0' },
  hesitant:    { icon: 'help-circle-outline',      color: '#7B7B90' },
  distracted:  { icon: 'git-branch-outline',       color: '#9090A0' },
  bored:       { icon: 'time-outline',             color: SECONDARY },
  lazy:        { icon: 'bed-outline',              color: '#7B7B90' },
  tired:       { icon: 'battery-half-outline',     color: BOLD_ORANGE },
  exhausted:   { icon: 'battery-dead-outline',     color: PRIMARY },
  anxious:     { icon: 'alert-circle-outline',     color: BOLD_ORANGE },
  stressed:    { icon: 'thunderstorm-outline',     color: PRIMARY },
  scared:      { icon: 'warning-outline',          color: BOLD_RED },
  lonely:      { icon: 'person-outline',           color: '#9090A0' },
  frustrated:  { icon: 'close-circle-outline',     color: BOLD_RED },
  sad:         { icon: 'rainy-outline',            color: SECONDARY },
  bad:         { icon: 'sad-outline',              color: BOLD_RED },
  sick:        { icon: 'medkit-outline',           color: BOLD_RED },
  depressed:   { icon: 'cloud-outline',            color: '#9090A0' },
  angry:       { icon: 'flame-outline',            color: BOLD_RED },
};

const MOOD_SCORES: Record<string, number> = {
  excellent: 10, veryGood: 9, happy: 8, excited: 9, energetic: 8, grateful: 9, optimistic: 8, proud: 8,
  satisfied: 7, good: 7, reassured: 6, comfortable: 6, calm: 6, surprised: 6,
  neutral: 5, hesitant: 4, distracted: 4, bored: 4, lazy: 4,
  tired: 3, exhausted: 2, anxious: 3, stressed: 3, scared: 3, lonely: 3,
  frustrated: 2, sad: 2, bad: 2, sick: 2, depressed: 1, angry: 1,
};

// Day labels: Sun=0..Sat=6 — short
const DAY_LABELS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS_AR = ['أحد', 'اثن', 'ثلا', 'أرب', 'خمس', 'جمع', 'سبت'];

// ── Locale-aware number formatting ─────────────────────────────────────────────
function fmtNum(value: number, lang: 'en' | 'ar'): string {
  try {
    const locale = lang === 'ar' ? 'ar-QA' : 'en-US';
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}

export default function StatisticsScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';
  const tFunc = (key: string) => t(key, lang);
  const fmt = (v: number) => fmtNum(v, lang);

  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { goals } = useGoalsStore();
  const { entries } = useJournalStore();

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // ── Build last-7-days WeekDayData for Tasks ───────────────────────────────
  // completedCount = tasks completed ON that day (by completed_at)
  // totalCount = tasks due ON that day (excluding cancelled)
  const taskWeekData: WeekDayData[] = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const isToday = dateStr === todayStr;
      const dayIdx = getDay(date);
      const dayLabel = isRTL ? DAY_LABELS_AR[dayIdx] : DAY_LABELS_EN[dayIdx];

      // Tasks completed on this calendar day (by completed_at date)
      const completedCount = tasks.filter(t => {
        if (!t.completed_at) return false;
        return format(parseISO(t.completed_at), 'yyyy-MM-dd') === dateStr;
      }).length;

      // Tasks due this day (as the "total" denominator)
      const totalCount = tasks.filter(t =>
        t.due_date === dateStr && t.status !== 'cancelled'
      ).length;

      // Use completedCount as numerator; if no due tasks, still show completions out of max
      const effectiveTotal = Math.max(totalCount, completedCount);
      const pct = effectiveTotal > 0 ? completedCount / effectiveTotal : 0;

      return { date: dateStr, dayLabel, completedCount, totalCount: effectiveTotal, pct, isToday, isFuture: false };
    });
  }, [tasks, todayStr, isRTL]);

  // ── Main stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const weekAgo = subDays(today, 7);
    const twoWeeksAgo = subDays(today, 14);

    // Tasks
    const activeTasks = tasks.filter(t => t.status !== 'cancelled');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const cancelledTasks = tasks.filter(t => t.status === 'cancelled');
    const overdueTasks = tasks.filter(t => t.status === 'overdue');

    const completedThisWeek = completedTasks.filter(t => {
      const d = t.completed_at ?? t.updated_at;
      return d && parseISO(d) >= weekAgo;
    });
    const completedLastWeek = completedTasks.filter(t => {
      const d = t.completed_at ?? t.updated_at;
      if (!d) return false;
      const pd = parseISO(d);
      return pd >= twoWeeksAgo && pd < weekAgo;
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

    // Week-over-week delta
    const weekDelta = completedThisWeek.length - completedLastWeek.length;

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
    const totalCompletionsThisWeek = habits.reduce((sum, h) => {
      return sum + (h.completion_history ?? []).filter(d => parseISO(d) >= weekAgo).length;
    }, 0);
    // Monthly habit completions
    const totalCompletionsThisMonth = habits.reduce((sum, h) => {
      return sum + (h.completion_history ?? []).filter(d => {
        const pd = parseISO(d);
        return pd >= monthStart && pd <= monthEnd;
      }).length;
    }, 0);

    // Goals
    const activeGoals = goals.filter(g => !(g.archived ?? g.is_archived));
    const archivedGoals = goals.filter(g => g.archived ?? g.is_archived);
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

    // Mood distribution (most recent 30 entries by array order, up to 12 top moods)
    const last30Entries = [...entries]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 30);
    const moodCounts: Partial<Record<Mood, number>> = {};
    for (const e of last30Entries) {
      if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] ?? 0) + 1;
    }
    const moodDistribution = (Object.entries(moodCounts) as [Mood, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
    const topMood: Mood | null = moodDistribution.length > 0 ? moodDistribution[0][0] : null;

    return {
      // Tasks
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      cancelledTasks: cancelledTasks.length,
      overdueTasks: overdueTasks.length,
      completedThisWeek: completedThisWeek.length,
      completedLastWeek: completedLastWeek.length,
      completedThisMonth: completedThisMonth.length,
      taskCompletionRate,
      weekDelta,
      // Habits
      totalHabits,
      completedTodayHabits,
      avgStreak,
      bestStreak,
      totalCompletionsThisWeek,
      totalCompletionsThisMonth,
      // Goals
      activeGoals,
      completedGoals: completedGoals.length,
      archivedGoals: archivedGoals.length,
      avgGoalProgress,
      // Journal
      totalEntries,
      entriesThisMonth,
      entriesThisWeek,
      avgMoodScore: Math.round(avgMoodScore * 10) / 10,
      moodDistribution,
      topMood,
    };
  }, [tasks, habits, goals, entries, todayStr, monthStart, monthEnd]);

  // ── Per-habit last-7-days sparkline ──────────────────────────────────────
  const habitSparklines = useMemo(() => {
    return habits.map(h => {
      const dots = Array.from({ length: 7 }, (_, i) => {
        const d = format(subDays(today, 6 - i), 'yyyy-MM-dd');
        return {
          date: d,
          done: (h.completion_history ?? []).includes(d),
          isToday: d === todayStr,
        };
      });
      return { habit: h, dots };
    });
  }, [habits, todayStr]);

  const hasTaskData = taskWeekData.some(d => d.totalCount > 0);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* ── Header ── */}
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
        contentContainerStyle={{ paddingTop: Spacing.lg, paddingBottom: bottomPad + 80, gap: Spacing.lg }}
      >
        {/* ════════════════════════════════════════════
            TASKS SECTION
        ════════════════════════════════════════════ */}
        <SectionHeader icon="checkmark-circle-outline" title={tFunc('tasks')} grad={GRADIENT_H} isRTL={isRTL} C={C} />

        {/* Weekly bar chart */}
        {hasTaskData && (
          <WeeklyChart
            data={taskWeekData}
            C={C}
            isDark={isDark}
            isRTL={isRTL}
            title={tFunc('weeklyAchievement')}
          />
        )}

        {/* Week-over-week delta card */}
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <WeekDeltaCard
            thisWeek={stats.completedThisWeek}
            lastWeek={stats.completedLastWeek}
            delta={stats.weekDelta}
            C={C}
            isDark={isDark}
            isRTL={isRTL}
            tFunc={tFunc}
            fmt={fmt}
          />
        </View>

        <View style={[styles.grid2, { paddingHorizontal: Spacing.lg }]}>
          <StatCard label={tFunc('total')} value={fmt(stats.totalTasks)} icon="list-outline" grad={GRADIENT_H} C={C} isDark={isDark} />
          <StatCard label={tFunc('done')} value={fmt(stats.completedTasks)} icon="checkmark-circle-outline" grad={GRADIENT_GREEN} C={C} isDark={isDark} />
          <StatCard label={tFunc('thisWeek')} value={fmt(stats.completedThisWeek)} icon="calendar-outline" grad={GRADIENT_SAGE} C={C} isDark={isDark} />
          <StatCard label={tFunc('thisMonth')} value={fmt(stats.completedThisMonth)} icon="calendar-number-outline" grad={GRADIENT_CYAN} C={C} isDark={isDark} />
          <StatCard label={tFunc('overdue')} value={fmt(stats.overdueTasks)} icon="alert-circle-outline" grad={GRADIENT_CORAL} C={C} isDark={isDark} />
          <StatCard label={tFunc('cancelled')} value={fmt(stats.cancelledTasks)} icon="close-circle-outline" grad={['#94A3B8', '#64748B']} C={C} isDark={isDark} />
        </View>

        <View style={{ paddingHorizontal: Spacing.lg }}>
          <ProgressCard label={tFunc('completionRate')} value={stats.taskCompletionRate} grad={GRADIENT_GREEN} C={C} isDark={isDark} isRTL={isRTL} fmt={fmt} />
        </View>

        {/* ════════════════════════════════════════════
            HABITS SECTION
        ════════════════════════════════════════════ */}
        <SectionHeader icon="leaf-outline" title={tFunc('habits')} grad={['#F97316', '#EF4444']} isRTL={isRTL} C={C} />

        <View style={[styles.grid2, { paddingHorizontal: Spacing.lg }]}>
          <StatCard label={tFunc('total')} value={fmt(stats.totalHabits)} icon="leaf-outline" grad={['#F97316', '#EF4444']} C={C} isDark={isDark} />
          <StatCard label={tFunc('todayDone')} value={`${fmt(stats.completedTodayHabits)}/${fmt(stats.totalHabits)}`} icon="today-outline" grad={GRADIENT_AMBER} C={C} isDark={isDark} />
          <StatCard label={tFunc('avgStreak')} value={`${fmt(stats.avgStreak)} ${tFunc('days')}`} icon="flame-outline" grad={['#F97316', '#EF4444']} C={C} isDark={isDark} />
          <StatCard label={tFunc('bestStreak')} value={`${fmt(stats.bestStreak)} ${tFunc('days')}`} icon="trophy-outline" grad={GRADIENT_AMBER} C={C} isDark={isDark} />
          <StatCard label={tFunc('thisWeek')} value={fmt(stats.totalCompletionsThisWeek)} icon="bar-chart-outline" grad={['#F97316', '#EF4444']} C={C} isDark={isDark} />
          <StatCard label={tFunc('thisMonth')} value={fmt(stats.totalCompletionsThisMonth)} icon="calendar-number-outline" grad={GRADIENT_AMBER} C={C} isDark={isDark} />
        </View>

        {/* Per-habit sparkline rows */}
        {habitSparklines.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <HabitsSparklineCard
              sparklines={habitSparklines}
              lang={lang}
              C={C}
              isDark={isDark}
              isRTL={isRTL}
              tFunc={tFunc}
              todayStr={todayStr}
              fmt={fmt}
            />
          </View>
        )}

        {/* ════════════════════════════════════════════
            GOALS SECTION
        ════════════════════════════════════════════ */}
        <SectionHeader icon="trophy-outline" title={tFunc('goals')} grad={['#8B5CF6', '#EC4899']} isRTL={isRTL} C={C} />

        <View style={[styles.grid2, { paddingHorizontal: Spacing.lg }]}>
          <StatCard label={tFunc('total')} value={fmt(goals.length)} icon="trophy-outline" grad={['#8B5CF6', '#EC4899']} C={C} isDark={isDark} />
          <StatCard label={tFunc('completed')} value={fmt(stats.completedGoals)} icon="checkmark-done-circle-outline" grad={GRADIENT_GREEN} C={C} isDark={isDark} />
          <StatCard label={tFunc('archivedGoalsTab')} value={fmt(stats.archivedGoals)} icon="archive-outline" grad={['#94A3B8', '#64748B']} C={C} isDark={isDark} />
        </View>

        <View style={{ paddingHorizontal: Spacing.lg }}>
          <ProgressCard label={tFunc('avgGoalProgress')} value={stats.avgGoalProgress} grad={['#8B5CF6', '#EC4899']} C={C} isDark={isDark} isRTL={isRTL} fmt={fmt} />
        </View>

        {/* Per-goal progress bars with deadline countdown */}
        {stats.activeGoals.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <GoalsProgressCard
              activeGoals={stats.activeGoals}
              lang={lang}
              C={C}
              isDark={isDark}
              isRTL={isRTL}
              tFunc={tFunc}
              today={today}
              fmt={fmt}
            />
          </View>
        )}

        {/* ════════════════════════════════════════════
            JOURNAL SECTION
        ════════════════════════════════════════════ */}
        <SectionHeader icon="journal-outline" title={tFunc('journal')} grad={GRADIENT_SAGE} isRTL={isRTL} C={C} />

        <View style={[styles.grid2, { paddingHorizontal: Spacing.lg }]}>
          <StatCard label={tFunc('total')} value={fmt(stats.totalEntries)} icon="journal-outline" grad={GRADIENT_SAGE} C={C} isDark={isDark} />
          <StatCard label={tFunc('thisWeek')} value={fmt(stats.entriesThisWeek)} icon="calendar-outline" grad={GRADIENT_SAGE} C={C} isDark={isDark} />
          <StatCard label={tFunc('thisMonth')} value={fmt(stats.entriesThisMonth)} icon="calendar-number-outline" grad={GRADIENT_CYAN} C={C} isDark={isDark} />
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

        {/* Mood distribution with top-mood highlight */}
        {stats.moodDistribution.length > 0 && (
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <MoodDistributionCard
              distribution={stats.moodDistribution}
              topMood={stats.topMood}
              lang={lang}
              C={C}
              isDark={isDark}
              isRTL={isRTL}
              tFunc={tFunc}
              fmt={fmt}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({
  icon, title, grad, isRTL, C,
}: {
  icon: IoniconName; title: string; grad: readonly [string, string];
  isRTL: boolean; C: ColorScheme;
}) {
  return (
    <View style={[shStyles.row, { flexDirection: isRTL ? 'row-reverse' : 'row', paddingHorizontal: Spacing.lg }]}>
      <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={shStyles.iconBox}>
        <Ionicons name={icon} size={18} color="#fff" />
      </LinearGradient>
      <Text style={[shStyles.title, { color: C.text }]}>{title}</Text>
    </View>
  );
}

const shStyles = StyleSheet.create({
  row: { alignItems: 'center', gap: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: F.black },
});

// ── Week Delta Card ────────────────────────────────────────────────────────────
function WeekDeltaCard({
  thisWeek, lastWeek, delta, C, isDark, isRTL, tFunc, fmt,
}: {
  thisWeek: number; lastWeek: number; delta: number;
  C: ColorScheme; isDark: boolean; isRTL: boolean;
  tFunc: (k: string) => string; fmt: (v: number) => string;
}) {
  const up = delta > 0;
  const same = delta === 0;
  const deltaColor = up ? BOLD_GREEN : same ? C.textMuted : BOLD_RED;
  const deltaIcon: IoniconName = up ? 'trending-up-outline' : same ? 'remove-outline' : 'trending-down-outline';

  return (
    <View style={[wdStyles.card, isDark ? ShadowDark.sm : Shadow.sm, { borderColor: C.border }]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}

      <View style={[wdStyles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* This week */}
        <View style={[wdStyles.col, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[wdStyles.weekLabel, { color: C.textMuted }]}>{tFunc('thisWeek')}</Text>
          <Text style={[wdStyles.weekVal, { color: C.text }]}>{fmt(thisWeek)}</Text>
        </View>

        {/* Delta */}
        <View style={[wdStyles.deltaBox, { backgroundColor: deltaColor + '15' }]}>
          <Ionicons name={deltaIcon} size={18} color={deltaColor} />
          <Text style={[wdStyles.deltaText, { color: deltaColor }]}>
            {same ? '—' : `${up ? '+' : ''}${fmt(delta)}`}
          </Text>
        </View>

        {/* Last week */}
        <View style={[wdStyles.col, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
          <Text style={[wdStyles.weekLabel, { color: C.textMuted }]}>{tFunc('lastWeek')}</Text>
          <Text style={[wdStyles.weekVal, { color: C.textSecondary }]}>{fmt(lastWeek)}</Text>
        </View>
      </View>
    </View>
  );
}

const wdStyles = StyleSheet.create({
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden', padding: Spacing.md },
  row: { alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  col: { flex: 1, gap: 2 },
  weekLabel: { fontSize: 11, fontFamily: F.med },
  weekVal: { fontSize: 24, fontFamily: F.black },
  deltaBox: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  deltaText: { fontSize: 15, fontFamily: F.bold },
});

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, grad, C, isDark }: {
  label: string; value: string | number; icon: IoniconName;
  grad: readonly [string, string]; C: ColorScheme; isDark: boolean;
}) {
  return (
    <View style={[scStyles.card, isDark ? ShadowDark.sm : Shadow.sm, { borderColor: C.border }]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={scStyles.topBar} />
      <View style={scStyles.body}>
        <LinearGradient colors={[...grad]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={scStyles.iconCircle}>
          <Ionicons name={icon} size={16} color="#fff" />
        </LinearGradient>
        <Text style={[scStyles.value, { color: grad[0] }]}>{value}</Text>
        <Text style={[scStyles.label, { color: C.textSecondary }]} numberOfLines={2}>{label}</Text>
      </View>
    </View>
  );
}

const scStyles = StyleSheet.create({
  card: { flex: 1, borderRadius: Radius.lg, borderWidth: 1, minWidth: '45%', overflow: 'hidden' },
  topBar: { height: 3 },
  body: { padding: Spacing.md, gap: 6, alignItems: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 22, fontFamily: F.black, textAlign: 'center' },
  label: { fontSize: 12, fontFamily: F.med, textAlign: 'center', lineHeight: 16 },
});

// ── Progress Card ─────────────────────────────────────────────────────────────
function ProgressCard({ label, value, grad, C, isDark, isRTL, fmt }: {
  label: string; value: number;
  grad: readonly [string, string]; C: ColorScheme; isDark: boolean; isRTL: boolean;
  fmt: (v: number) => string;
}) {
  return (
    <View style={[pcStyles.card, isDark ? ShadowDark.sm : Shadow.sm, { borderColor: C.border }]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <View style={[pcStyles.body, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[pcStyles.label, { color: C.textSecondary }]}>{label}</Text>
        <Text style={[pcStyles.value, { color: grad[0] }]}>{fmt(value)}%</Text>
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
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  body: { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  label: { fontSize: 14, fontFamily: F.med },
  value: { fontSize: 24, fontFamily: F.black },
  track: { height: 10, margin: Spacing.sm, marginTop: 0, borderRadius: 5, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
});

// ── Habits Sparkline Card ─────────────────────────────────────────────────────
type SparklineItem = {
  habit: {
    id: string; name: string; name_ar?: string; name_en?: string;
    icon: string; color: string; streak_days: number;
  };
  dots: { date: string; done: boolean; isToday: boolean }[];
};

function HabitsSparklineCard({
  sparklines, lang, C, isDark, isRTL, tFunc, todayStr, fmt,
}: {
  sparklines: SparklineItem[];
  lang: 'en' | 'ar';
  C: ColorScheme;
  isDark: boolean;
  isRTL: boolean;
  tFunc: (k: string) => string;
  todayStr: string;
  fmt: (v: number) => string;
}) {
  return (
    <View style={[hkStyles.card, isDark ? ShadowDark.sm : Shadow.sm, { borderColor: C.border }]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}

      <View style={[hkStyles.cardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[hkStyles.cardTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {tFunc('completionHistory')}
        </Text>
        <Text style={[hkStyles.cardSub, { color: C.textMuted }]}>{tFunc('sevenDayShort')}</Text>
      </View>

      {sparklines.map(({ habit, dots }, idx) => {
        const name = resolveDisplayName(habit.name_ar, habit.name_en, lang, habit.name);
        const displayDots = isRTL ? [...dots].reverse() : dots;
        const doneTodayH = dots.find(d => d.isToday)?.done ?? false;

        return (
          <View
            key={habit.id}
            style={[
              hkStyles.row,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
              idx < sparklines.length - 1 && { borderBottomColor: C.border, borderBottomWidth: StyleSheet.hairlineWidth },
            ]}
          >
            <View style={[hkStyles.habitIcon, { backgroundColor: habit.color + '22' }]}>
              <Text style={{ fontSize: 16 }}>{habit.icon}</Text>
            </View>
            <View style={[hkStyles.nameBlock, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[hkStyles.habitName, { color: C.text }]} numberOfLines={1}>{name}</Text>
              <View style={[hkStyles.streakRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Ionicons name="flame-outline" size={11} color={habit.color} />
                <Text style={[hkStyles.streakText, { color: habit.color }]}>{fmt(habit.streak_days)}</Text>
              </View>
            </View>
            <View style={[hkStyles.dotsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {displayDots.map((d) => (
                <View
                  key={d.date}
                  style={[
                    hkStyles.dot,
                    {
                      backgroundColor: d.done
                        ? habit.color
                        : d.isToday && !d.done
                          ? habit.color + '30'
                          : C.border,
                    },
                    d.isToday && hkStyles.dotToday,
                  ]}
                />
              ))}
            </View>
            {doneTodayH && (
              <View style={[hkStyles.todayBadge, { backgroundColor: habit.color + '18' }]}>
                <Ionicons name="checkmark" size={12} color={habit.color} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const hkStyles = StyleSheet.create({
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  cardHeader: {
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  cardTitle: { fontSize: 13, fontFamily: F.bold, letterSpacing: 0.3 },
  cardSub: { fontSize: 12, fontFamily: F.med },
  row: { alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2 },
  habitIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nameBlock: { flex: 1, gap: 2, minWidth: 0 },
  habitName: { fontSize: 13, fontFamily: F.bold },
  streakRow: { alignItems: 'center', gap: 3 },
  streakText: { fontSize: 11, fontFamily: F.bold },
  dotsRow: { alignItems: 'center', gap: 5, flexShrink: 0 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  dotToday: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)' },
  todayBadge: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});

// ── Goals Progress Card ───────────────────────────────────────────────────────
function GoalsProgressCard({
  activeGoals, lang, C, isDark, isRTL, tFunc, today, fmt,
}: {
  activeGoals: Goal[];
  lang: 'en' | 'ar';
  C: ColorScheme;
  isDark: boolean;
  isRTL: boolean;
  tFunc: (k: string) => string;
  today: Date;
  fmt: (v: number) => string;
}) {
  return (
    <View style={[gpStyles.card, isDark ? ShadowDark.sm : Shadow.sm, { borderColor: C.border }]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}

      {activeGoals.map((goal, idx) => {
        const name = resolveDisplayName(goal.title_ar, goal.title_en, lang, goal.title);
        const pct = goal.target_value > 0
          ? Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100)
          : 0;

        // Deadline countdown
        let daysLeft: number | null = null;
        if (goal.deadline) {
          try {
            const deadlineDate = parseISO(goal.deadline);
            daysLeft = differenceInCalendarDays(deadlineDate, today);
          } catch {}
        }

        const isComplete = pct >= 100;
        const isOverdue = daysLeft !== null && daysLeft < 0 && !isComplete;
        const isDueSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && !isComplete;

        return (
          <View
            key={goal.id}
            style={[
              gpStyles.row,
              idx < activeGoals.length - 1 && { borderBottomColor: C.border, borderBottomWidth: StyleSheet.hairlineWidth },
            ]}
          >
            {/* Title row */}
            <View style={[gpStyles.goalTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[gpStyles.goalIconBox, { backgroundColor: goal.color + '22' }]}>
                <Text style={{ fontSize: 15 }}>{goal.icon}</Text>
              </View>
              <Text style={[gpStyles.goalName, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                {name}
              </Text>
              <Text style={[gpStyles.goalPct, { color: goal.color }]}>{fmt(pct)}%</Text>
            </View>

            {/* Progress bar */}
            <View style={[gpStyles.trackOuter, { backgroundColor: goal.color + '18' }]}>
              <View
                style={[
                  gpStyles.trackFill,
                  {
                    width: `${pct}%`,
                    backgroundColor: goal.color,
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            </View>

            {/* Footer: value + deadline */}
            <View style={[gpStyles.valRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[gpStyles.valText, { color: C.textMuted }]}>
                {fmt(goal.current_value)} / {fmt(goal.target_value)}
              </Text>

              {isComplete && (
                <View style={[gpStyles.badge, { backgroundColor: BOLD_GREEN + '18' }]}>
                  <Ionicons name="checkmark-circle" size={11} color={BOLD_GREEN} />
                  <Text style={[gpStyles.badgeText, { color: BOLD_GREEN }]}>{tFunc('done')}</Text>
                </View>
              )}

              {isOverdue && daysLeft !== null && (
                <View style={[gpStyles.badge, { backgroundColor: BOLD_RED + '15' }]}>
                  <Ionicons name="alert-circle-outline" size={11} color={BOLD_RED} />
                  <Text style={[gpStyles.badgeText, { color: BOLD_RED }]}>
                    {fmt(Math.abs(daysLeft))}{tFunc('daysShort')}
                  </Text>
                </View>
              )}

              {isDueSoon && daysLeft !== null && (
                <View style={[gpStyles.badge, { backgroundColor: BOLD_GOLD + '20' }]}>
                  <Ionicons name="time-outline" size={11} color={BOLD_GOLD} />
                  <Text style={[gpStyles.badgeText, { color: BOLD_GOLD }]}>
                    {fmt(daysLeft)} {tFunc('daysLeft')}
                  </Text>
                </View>
              )}

              {!isComplete && !isOverdue && !isDueSoon && daysLeft !== null && (
                <View style={[gpStyles.badge, { backgroundColor: C.border }]}>
                  <Ionicons name="calendar-outline" size={11} color={C.textMuted} />
                  <Text style={[gpStyles.badgeText, { color: C.textMuted }]}>
                    {fmt(daysLeft)} {tFunc('daysLeft')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const gpStyles = StyleSheet.create({
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  row: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: 6 },
  goalTop: { alignItems: 'center', gap: Spacing.sm },
  goalIconBox: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  goalName: { flex: 1, fontSize: 14, fontFamily: F.bold },
  goalPct: { fontSize: 15, fontFamily: F.black, flexShrink: 0 },
  trackOuter: { height: 8, borderRadius: 4, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 4 },
  valRow: { alignItems: 'center', gap: 6 },
  valText: { fontSize: 11, fontFamily: F.med },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6,
  },
  badgeText: { fontSize: 10, fontFamily: F.bold },
});

// ── Mood Distribution Card ────────────────────────────────────────────────────
function MoodDistributionCard({
  distribution, topMood, lang, C, isDark, isRTL, tFunc, fmt,
}: {
  distribution: [Mood, number][];
  topMood: Mood | null;
  lang: 'en' | 'ar';
  C: ColorScheme;
  isDark: boolean;
  isRTL: boolean;
  tFunc: (k: string) => string;
  fmt: (v: number) => string;
}) {
  const maxCount = distribution.length > 0 ? distribution[0][1] : 1;
  const topCfg = topMood ? MOOD_CONFIG[topMood] : null;
  const topLabel = topMood
    ? tFunc(`mood${topMood.charAt(0).toUpperCase() + topMood.slice(1)}`)
    : null;

  return (
    <View style={[mdStyles.card, isDark ? ShadowDark.sm : Shadow.sm, { borderColor: C.border }]}>
      {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}

      <View style={[mdStyles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Ionicons name="happy-outline" size={16} color={C.textSecondary} />
        <Text style={[mdStyles.title, { color: C.text }]}>{tFunc('mood')}</Text>
        <Text style={[mdStyles.sub, { color: C.textMuted }]}>{tFunc('completionHistory30')}</Text>
      </View>

      {/* Top mood highlight */}
      {topMood && topCfg && topLabel && (
        <View style={[mdStyles.topMoodRow, { flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: topCfg.color + '12' }]}>
          <LinearGradient
            colors={[topCfg.color, topCfg.color + 'AA']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={mdStyles.topMoodIcon}
          >
            <Ionicons name={topCfg.icon} size={18} color="#fff" />
          </LinearGradient>
          <View style={{ flex: 1, gap: 1 }}>
            <Text style={[mdStyles.topMoodLabel, { color: topCfg.color, textAlign: isRTL ? 'right' : 'left' }]}>
              {topLabel}
            </Text>
            <Text style={[mdStyles.topMoodSub, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
              #{1} · {fmt(distribution[0][1])}×
            </Text>
          </View>
          <View style={[mdStyles.topMoodBadge, { backgroundColor: topCfg.color + '20' }]}>
            <Ionicons name="star" size={10} color={topCfg.color} />
            <Text style={[mdStyles.topMoodBadgeText, { color: topCfg.color }]}>{tFunc('topMoodLabel')}</Text>
          </View>
        </View>
      )}

      {/* Mood grid */}
      <View style={mdStyles.grid}>
        {distribution.map(([mood, count], i) => {
          const cfg = MOOD_CONFIG[mood];
          if (!cfg) return null;
          const pct = count / maxCount;
          const moodLabel = tFunc(`mood${mood.charAt(0).toUpperCase() + mood.slice(1)}`);
          const isTop = i === 0;

          return (
            <View key={mood} style={[mdStyles.moodItem, isTop && { opacity: 1 }]}>
              <View style={[mdStyles.barTrack, { backgroundColor: cfg.color + '15' }, isTop && mdStyles.barTrackTop]}>
                <View
                  style={[
                    mdStyles.barFill,
                    { height: `${Math.round(pct * 100)}%`, backgroundColor: cfg.color },
                    isTop && { backgroundColor: cfg.color },
                  ]}
                />
              </View>
              <View style={[mdStyles.iconBox, { backgroundColor: cfg.color + '18' }, isTop && { backgroundColor: cfg.color + '30' }]}>
                <Ionicons name={cfg.icon} size={14} color={cfg.color} />
              </View>
              <Text style={[mdStyles.countText, { color: cfg.color }]}>{fmt(count)}</Text>
              <Text style={[mdStyles.moodLabel, { color: C.textMuted }]} numberOfLines={1}>{moodLabel}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const mdStyles = StyleSheet.create({
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden', paddingBottom: Spacing.md },
  header: {
    alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  title: { fontSize: 13, fontFamily: F.bold, letterSpacing: 0.3, flex: 1 },
  sub: { fontSize: 11, fontFamily: F.med },
  topMoodRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginHorizontal: Spacing.md, marginBottom: Spacing.md,
    borderRadius: Radius.sm, padding: Spacing.md,
  },
  topMoodIcon: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  topMoodLabel: { fontSize: 15, fontFamily: F.bold },
  topMoodSub: { fontSize: 11, fontFamily: F.med },
  topMoodBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    flexShrink: 0,
  },
  topMoodBadgeText: { fontSize: 10, fontFamily: F.bold },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: Spacing.md, gap: Spacing.sm,
    justifyContent: 'flex-start',
  },
  moodItem: { width: 52, alignItems: 'center', gap: 4 },
  barTrack: { width: 20, height: 44, borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  barTrackTop: { width: 24, height: 52 },
  barFill: { width: '100%', borderRadius: 4 },
  iconBox: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 12, fontFamily: F.black },
  moodLabel: { fontSize: 9, fontFamily: F.med, textAlign: 'center' },
});

// ── Screen styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(129,140,248,0.08)',
  },
  headerRow: { alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 30, fontFamily: F.black },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
});
