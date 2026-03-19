import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Platform, Modal, Alert, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { ar as arLocale } from 'date-fns/locale';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';

import { useTasksStore } from '../../src/store/tasksStore';
import { useGoalsStore } from '../../src/store/goalsStore';
import { useHabitsStore } from '../../src/store/habitsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { resolveDisplayName } from '../../src/utils/i18n';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { useJournalStore } from '../../src/store/journalStore';
import { Spacing, Typography, Radius, Shadow, ShadowDark, F, PRIMARY, SECONDARY, GRADIENT_H, GRADIENT_D, GRADIENT_GREEN, GRADIENT_CORAL, GRADIENT_AMBER, GRADIENT_SAGE, GRADIENT_DARK_HEADER, GRADIENT_DARK_CARD, GRADIENT_DARK_CARD_ELEVATED, cardShadow, ColorScheme, WARM_SAGE, WARM_CORAL, WARM_ERROR } from '../../src/theme';
import type { Task, Habit, Goal, JournalEntry, Mood, Category, Language } from '../../src/types';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t, getPersonalizedGreeting } from '../../src/utils/i18n';
import { getTodayString, getWeekDays, getDayLabel, formatDateKey, formatTime, isOverdue, formatShortDate } from '../../src/utils/date';
import { HabitForm } from '../../src/features/habits/HabitForm';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { JournalForm } from '../../src/features/journal/JournalForm';
import { GoalForm } from '../../src/features/goals/GoalForm';
import { SwipeableRow } from '../../src/components/ui/SwipeableRow';
import { WeeklyChart, WeekDayData } from '../../src/components/ui/WeeklyChart';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { tasks, toggleComplete, deleteTask, postponeTask, clearCompleted } = useTasksStore();
  const { goals } = useGoalsStore();
  const { habits, completeHabit, uncompleteHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const { categories } = useCategoriesStore();
  const { entries: journalEntries } = useJournalStore();
  const lang = profile.language;

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [selectedDay, setSelectedDay] = useState(getTodayString());
  const isRTL = lang === 'ar';

  const weekDays = useMemo(() => getWeekDays(profile.start_of_week), [profile.start_of_week]);
  const weekStripDays = useMemo(
    () => isRTL ? [...weekDays].reverse() : weekDays,
    [weekDays, isRTL],
  );
  const today = getTodayString();
  const tFunc = (key: string) => t(key, lang);

  const todayTasks = useMemo(() => tasks.filter(task => task.due_date === today), [tasks, today]);
  const completedToday = todayTasks.filter(task => task.status === 'completed').length;
  const overdueCount = tasks.filter(task => task.status === 'overdue' || (task.due_date && isOverdue(task.due_date) && task.status === 'pending')).length;
  const weekKeys = useMemo(() => new Set(weekDays.map(d => formatDateKey(d))), [weekDays]);
  const thisWeek = useMemo(() => tasks.filter(task => task.due_date && weekKeys.has(task.due_date)).length, [tasks, weekKeys]);
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak_days), 0);
  const dayTasks = tasks.filter(task => task.due_date === selectedDay);
  const allDone = todayTasks.length > 0 && todayTasks.every(task => task.status === 'completed');
  const topGoals = goals.slice(0, 2);
  const todayJournal = journalEntries.find(e => e.date === today);
  const topPad = isWeb ? 67 : insets.top;

  const weeklyStats = useMemo((): WeekDayData[] => {
    const dayAbbrEn: Record<number, string> = {
      0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa',
    };
    const dayAbbrAr: Record<number, string> = {
      0: 'أح', 1: 'إث', 2: 'ثل', 3: 'أر', 4: 'خم', 5: 'جم', 6: 'سب',
    };
    return weekDays.map((day) => {
      const dateStr = formatDateKey(day);
      const isToday = dateStr === today;
      const isFuture = dateStr > today;

      const tasksForDay = tasks.filter((t) => t.due_date === dateStr);
      const completedTasks = tasksForDay.filter((t) => t.status === 'completed').length;

      const habitsCompletedOnDay = habits.filter((h) => {
        if (!h.last_completed_at) return false;
        return format(new Date(h.last_completed_at), 'yyyy-MM-dd') === dateStr;
      }).length;

      const completedCount = completedTasks + habitsCompletedOnDay;
      const totalCount = tasksForDay.length + habits.length;
      const pct = totalCount > 0 ? completedCount / totalCount : 0;

      const dayOfWeek = day.getDay();
      const dayLabel = lang === 'ar' ? dayAbbrAr[dayOfWeek] : dayAbbrEn[dayOfWeek];
      return { date: dateStr, dayLabel, completedCount, totalCount, pct, isToday, isFuture };
    });
  }, [weekDays, tasks, habits, today, lang]);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: (isWeb ? 34 : 0) + 100 }}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={isDark ? [...GRADIENT_DARK_HEADER] : [...GRADIENT_D]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + Spacing.xs }, isDark && styles.heroDark]}
        >
          {/* Decorative circles — only in light mode */}
          {!isDark && <View style={[styles.deco1]} />}
          {!isDark && <View style={[styles.deco2]} />}
          {!isDark && <View style={[styles.deco3]} />}

          <View style={[styles.heroContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.heroLeft, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Image
                source={isRTL
                  ? require('../../assets/images/logo-ar-transparent.png')
                  : require('../../assets/images/logo-en-transparent.png')}
                style={[styles.heroLogo, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }, isDark && { tintColor: C.tint }]}
                resizeMode="contain"
              />
              <Text style={[styles.heroTitle, { color: isDark ? C.text : '#fff', textAlign: isRTL ? 'right' : 'left', width: '100%' }]} numberOfLines={2}>
                {getPersonalizedGreeting(profile.name, lang)}
              </Text>
              <Text style={[styles.heroDate, { color: isDark ? C.textMuted : 'rgba(255,255,255,0.65)', textAlign: isRTL ? 'right' : 'left' }]}>
                {isRTL
                  ? format(new Date(), 'EEEE، d MMMM', { locale: arLocale })
                  : format(new Date(), 'EEEE, MMMM d')}
              </Text>
            </View>
            <AddBtn onPress={() => setShowQuickAdd(true)} label={tFunc('quickAdd')} />
          </View>

          {/* Today progress bar */}
          {todayTasks.length > 0 && (
            <View style={styles.heroProgress}>
              <View style={[styles.heroProgressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.18)' }]}>
                <LinearGradient
                  colors={isDark ? [C.tint, C.tintSecondary] : ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.65)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.heroProgressFill,
                    { width: `${Math.round((completedToday / todayTasks.length) * 100)}%` as `${number}%` },
                  ]}
                />
              </View>
              <View style={[styles.heroProgressLabelRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.heroProgressText, { color: isDark ? C.textSecondary : 'rgba(255,255,255,0.75)' }]}>
                  {completedToday}/{todayTasks.length} {tFunc('completed')}
                </Text>
                {completedToday > 0 && (
                  <View style={[styles.heroProgressPct, { backgroundColor: isDark ? C.tint + '25' : 'rgba(255,255,255,0.2)' }]}>
                    <Text style={[styles.heroProgressPctText, { color: isDark ? C.tint : 'rgba(255,255,255,0.9)' }]}>
                      {Math.round((completedToday / todayTasks.length) * 100)}%
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </LinearGradient>

        {/* Stats Row */}
        <View style={[styles.statsRow, { borderColor: C.border, overflow: 'hidden' }, isDark ? ShadowDark.sm : Shadow.sm]}>
          {isDark && (
            <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          )}
          {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
          <StatPill icon="checkmark-done" value={completedToday} label={tFunc('completed')} color={C.tintSecondary} C={C} />
          <View style={[styles.statDivider, { backgroundColor: C.border }]} />
          <StatPill icon="alert-circle" value={overdueCount} label={tFunc('overdue')} color={C.error} C={C} />
          <View style={[styles.statDivider, { backgroundColor: C.border }]} />
          <StatPill icon="calendar" value={thisWeek} label={tFunc('thisWeek')} color={C.tint} C={C} />
          <View style={[styles.statDivider, { backgroundColor: C.border }]} />
          <StatPill icon="flame" value={maxStreak} label={tFunc('streak')} color={C.warning} C={C} />
        </View>

        {/* Weekly Chart */}
        <WeeklyChart
          data={weeklyStats}
          C={C}
          isDark={isDark}
          isRTL={isRTL}
          title={tFunc('weeklyAchievement')}
        />

        {/* Week Strip */}
        <View style={[styles.weekCard, { borderColor: C.border, borderWidth: 1, overflow: 'hidden' }, isDark ? ShadowDark.sm : Shadow.sm]}> 
          {isDark && (
            <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          )}
          {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
          {weekStripDays.map((day) => {
            const key = formatDateKey(day);
            const isSelected = key === selectedDay;
            const isToday = key === today;
            const hasDots = tasks.some(task => task.due_date === key);

            return (
              <Pressable
                key={key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDay(key);
                }}
                style={({ pressed }) => [styles.dayPill, { overflow: 'hidden', opacity: pressed ? 0.75 : 1 }]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${getDayLabel(day, lang)} ${format(day, 'd')}`}
              >
                {isSelected && (
                  <LinearGradient
                    colors={[...GRADIENT_H]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: Radius.lg }]}
                  />
                )}
                <Text style={[styles.dayLbl, { color: isSelected ? 'rgba(255,255,255,0.8)' : C.textMuted }]}>
                  {getDayLabel(day, lang)}
                </Text>
                <Text style={[
                  styles.dayNum,
                  { color: isSelected ? '#fff' : isToday ? C.tint : C.text },
                  isToday && !isSelected && { fontFamily: F.bold },
                ]}>
                  {format(day, 'd')}
                </Text>
                {hasDots && !isSelected && (
                  <View style={[styles.dot, { backgroundColor: C.tint }]} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* All done banner */}
        {allDone && (
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
            <LinearGradient
              colors={GRADIENT_GREEN}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.allDoneBanner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Text style={styles.allDoneEmoji}>🎉</Text>
              <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={[styles.allDoneTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('allDoneToday')}</Text>
                <Text style={[styles.allDoneSub, { textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('allDoneSubtitle')}</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Today Tasks */}
        <Section
          title={selectedDay === today ? tFunc('today2') : formatShortDate(selectedDay, lang)}
          C={C} isRTL={isRTL}
          action={tFunc('addNew')}
          onAction={() => setShowTaskForm(true)}
          onTitlePress={() => router.navigate('/tasks')}
          badge={dayTasks.length > 0 ? dayTasks.length : undefined}
        >
          {dayTasks.length === 0 ? (
            <Pressable
              onPress={() => setShowTaskForm(true)}
              style={({ pressed }) => [styles.habitsEmpty, { backgroundColor: C.card, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.8 : 1 }]}
              accessibilityRole="button"
            >
              <View style={[styles.habitsEmptyIcon, { backgroundColor: C.tint + '15' }]}>
                <Ionicons name="calendar-clear-outline" size={28} color={C.tint} />
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={[styles.habitsEmptyTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('noTasksForDay')}</Text>
                <Text style={[styles.habitsEmptySubtitle, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('tapToAddTask')}</Text>
              </View>
              <Ionicons name="add-circle-outline" size={24} color={C.tint} />
            </Pressable>
          ) : (
            <View style={{ gap: Spacing.sm }}>
              {dayTasks.slice(0, 4).map(task => {
                const cat = categories.find(c => c.id === task.category_id);
                return (
                  <SwipeableRow
                    key={task.id}
                    isRTL={isRTL}
                    onComplete={task.status !== 'completed' ? () => toggleComplete(task.id) : undefined}
                    onDelete={() => deleteTask(task.id)}
                    completeLabel={tFunc('done')}
                    deleteLabel={tFunc('delete')}
                  >
                    <FunTaskRow
                      task={task}
                      catName={cat ? resolveDisplayName(cat.name_ar, cat.name_en, lang, cat.name) : undefined}
                      catColor={cat?.color}
                      catIcon={cat?.icon}
                      timeStr={task.due_time ? formatTime(task.due_time, profile.time_format === '12h') : undefined}
                      onToggle={() => toggleComplete(task.id)}
                      onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        Alert.alert(resolveDisplayName(task.title_ar, task.title_en, lang, task.title), undefined, [
                          { text: tFunc('cancel'), style: 'cancel' },
                          { text: tFunc('postpone'), onPress: () => postponeTask(task.id) },
                          { text: tFunc('deleteTask'), style: 'destructive', onPress: () => deleteTask(task.id) },
                        ]);
                      }}
                      C={C} isRTL={isRTL} lang={lang}
                    />
                  </SwipeableRow>
                );
              })}
              {dayTasks.length > 4 && (
                <Pressable
                  onPress={() => router.navigate('/tasks')}
                  style={({ pressed }) => [styles.seeMoreBtn, { backgroundColor: C.tint + '10', borderColor: C.tint + '25', opacity: pressed ? 0.7 : 1, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                  accessibilityRole="button"
                >
                  <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={C.tint} />
                  <Text style={[styles.seeMoreText, { color: C.tint }]}>
                    {isRTL
                      ? `${dayTasks.length - 4} ${tFunc('andMore')}`
                      : `${dayTasks.length - 4} ${tFunc('andMore')}`}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
          {dayTasks.some(t => t.status === 'completed') && (
            <Pressable
              onPress={() => {
                Alert.alert(
                  tFunc('clearCompleted'),
                  tFunc('clearCompletedConfirm'),
                  [
                    { text: tFunc('cancel'), style: 'cancel' },
                    { text: tFunc('clear'), style: 'destructive', onPress: clearCompleted },
                  ]
                );
              }}
              style={({ pressed }) => [styles.clearCompletedBtn, { opacity: pressed ? 0.7 : 1, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={13} color={C.textMuted} />
              <Text style={[styles.clearCompletedText, { color: C.textMuted }]}>{tFunc('clearCompleted')}</Text>
            </Pressable>
          )}
        </Section>

        {/* Habits */}
        <Section
          title={tFunc('habits')}
          C={C} isRTL={isRTL}
          action={tFunc('addNew')}
          onAction={() => { setEditHabit(null); setShowHabitForm(true); }}
          onTitlePress={() => router.push('/habits')}
          badge={habits.length > 0 ? habits.filter(h => { const d = h.last_completed_at ? new Date(h.last_completed_at).toISOString().split('T')[0] : null; return d === today; }).length : undefined}
          badgeTotal={habits.length > 0 ? habits.length : undefined}
        >
          {habits.length === 0 ? (
            <Pressable
              onPress={() => { setEditHabit(null); setShowHabitForm(true); }}
              style={({ pressed }) => [styles.habitsEmpty, { backgroundColor: C.card, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.8 : 1 }]}
              accessibilityRole="button"
            >
              <View style={[styles.habitsEmptyIcon, { backgroundColor: C.tint + '15' }]}>
                <Ionicons name="leaf-outline" size={28} color={C.tint} />
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={[styles.habitsEmptyTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('noHabitsYet')}</Text>
                <Text style={[styles.habitsEmptySubtitle, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('tapPlusToAdd')}</Text>
              </View>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textMuted} />
            </Pressable>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -Spacing.lg }} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.md }}>
              {habits.map(h => (
                <FunHabitCard key={h.id} habit={h} onComplete={completeHabit} onUncomplete={uncompleteHabit} C={C} lang={lang} />
              ))}
            </ScrollView>
          )}
        </Section>

        {/* Goals */}
        <Section
          title={tFunc('goalsSection')} C={C} isRTL={isRTL}
          action={tFunc('addNew')}
          onAction={() => setShowGoalForm(true)}
          onTitlePress={() => router.push('/goals')}
        >
          {goals.length === 0 ? (
            <Pressable
              onPress={() => setShowGoalForm(true)}
              style={({ pressed }) => [styles.habitsEmpty, { backgroundColor: C.card, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.8 : 1 }]}
              accessibilityRole="button"
            >
              <View style={[styles.habitsEmptyIcon, { backgroundColor: C.tint + '15' }]}>
                <Ionicons name="trophy-outline" size={28} color={C.tint} />
              </View>
              <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                <Text style={[styles.habitsEmptyTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('noGoalsYet')}</Text>
                <Text style={[styles.habitsEmptySubtitle, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('tapPlusToAddGoal')}</Text>
              </View>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textMuted} />
            </Pressable>
          ) : (
            <View style={{ gap: Spacing.md }}>
              {topGoals.map((g, i) => {
                const pct = g.target_value > 0 ? g.current_value / g.target_value : 0;
                const goalGradients: readonly (readonly [string, string])[] = [
                  GRADIENT_H, GRADIENT_SAGE, GRADIENT_GREEN, GRADIENT_AMBER,
                ];
                const grad = goalGradients[i % goalGradients.length] as [string, string];
                return (
                  <Pressable key={g.id} onPress={() => router.push('/goals')}>
                    <FunGoalCard goal={g} progress={pct} gradient={grad} C={C} isRTL={isRTL} lang={lang} />
                  </Pressable>
                );
              })}
            </View>
          )}
        </Section>

        {/* Journal Card */}
        <Section
          title={tFunc('journal')}
          C={C} isRTL={isRTL}
          onTitlePress={() => router.push('/journal')}
        >
          <JournalHomeCard
            entry={todayJournal}
            onWrite={() => setShowJournalForm(true)}
            onOpen={() => router.push('/journal')}
            C={C} isRTL={isRTL}
            tFunc={tFunc}
          />
        </Section>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 8 }} />
      </ScrollView>

      <TaskForm visible={showTaskForm} onClose={() => { setShowTaskForm(false); setEditTask(null); }} editTask={editTask} />
      <HabitForm visible={showHabitForm} onClose={() => { setShowHabitForm(false); setEditHabit(null); }} editHabit={editHabit} />
      <JournalForm visible={showJournalForm} onClose={() => setShowJournalForm(false)} />
      <GoalForm visible={showGoalForm} onClose={() => setShowGoalForm(false)} editGoal={null} />
      <QuickAddMenu
        visible={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onTask={() => { setShowQuickAdd(false); setEditTask(null); setShowTaskForm(true); }}
        onHabit={() => { setShowQuickAdd(false); setEditHabit(null); setShowHabitForm(true); }}
        onGoal={() => { setShowQuickAdd(false); setShowGoalForm(true); }}
        onJournal={() => { setShowQuickAdd(false); setShowJournalForm(true); }}
        isRTL={isRTL}
        lang={lang}
        C={C}
        insets={insets}
      />
    </View>
  );
}

function AddBtn({ onPress, label }: { onPress: () => void; label: string }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      style={[animStyle, styles.addBtn]}
      onPressIn={() => { scale.value = withSpring(0.88, { damping: 14 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 14 }); }}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <LinearGradient
        colors={[...GRADIENT_H]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Ionicons name="add" size={28} color="#fff" />
    </AnimatedPressable>
  );
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface QuickAddMenuProps {
  visible: boolean; onClose: () => void; onTask: () => void; onHabit: () => void;
  onGoal: () => void; onJournal: () => void; isRTL: boolean; lang: Language; C: ColorScheme; insets: { bottom: number };
}

function QuickAddMenu({ visible, onClose, onTask, onHabit, onGoal, onJournal, isRTL, lang, C, insets }: QuickAddMenuProps) {
  const tFunc = (key: string) => t(key, lang);
  const items = [
    { label: tFunc('addTask'), sublabel: tFunc('quickAddTask'), icon: 'checkmark-circle-outline', colors: GRADIENT_H as [string,string], onPress: onTask },
    { label: tFunc('addHabit'), sublabel: tFunc('quickAddHabit'), icon: 'leaf-outline', colors: GRADIENT_GREEN as [string,string], onPress: onHabit },
    { label: tFunc('addGoal'), sublabel: tFunc('quickAddGoal'), icon: 'trophy-outline', colors: GRADIENT_AMBER as [string,string], onPress: onGoal },
    { label: tFunc('addEntry'), sublabel: tFunc('quickAddJournal'), icon: 'book-outline', colors: GRADIENT_SAGE as [string,string], onPress: onJournal },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={qaStyles.overlay} onPress={onClose}>
        <Pressable style={[qaStyles.sheet, { backgroundColor: C.card, paddingBottom: (insets?.bottom ?? 0) + 16 }]} onPress={() => {}}>
          <View style={qaStyles.handle} />
          <Text style={[qaStyles.sheetTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {tFunc('quickAdd')}
          </Text>
          <View style={qaStyles.itemGrid}>
            {items.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); item.onPress(); }}
                style={({ pressed }) => [qaStyles.item, { opacity: pressed ? 0.82 : 1 }]}
                accessibilityRole="button"
              >
                <LinearGradient colors={item.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={qaStyles.itemGrad}>
                  <View style={qaStyles.itemIconWrap}>
                    <Ionicons name={item.icon as IoniconsName} size={26} color="#fff" />
                  </View>
                  <Text style={[qaStyles.itemLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{item.label}</Text>
                  <Text style={[qaStyles.itemSub, { textAlign: isRTL ? 'right' : 'left' }]}>{item.sublabel}</Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }}
            style={({ pressed }) => [qaStyles.cancelBtn, { backgroundColor: C.surface, borderColor: C.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[qaStyles.cancelText, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function StatPill({ icon, value, label, color, C }: { icon: IoniconsName; value: number; label: string; color: string; C: ColorScheme }) {
  return (
    <View style={styles.statPill}>
      <View style={[styles.statPillIcon, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={[styles.statPillNum, { color: C.text }]}>{value}</Text>
      <Text style={[styles.statPillLabel, { color: C.textMuted }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

interface SectionProps {
  title: string; children: React.ReactNode; C: ColorScheme;
  action?: string; onAction?: () => void; onTitlePress?: () => void; isRTL?: boolean;
  badge?: number; badgeTotal?: number;
}

function Section({ title, children, C, action, onAction, onTitlePress, isRTL, badge, badgeTotal }: SectionProps) {
  const showProgress = badge !== undefined && badgeTotal !== undefined && badgeTotal > 0;
  const allDone = showProgress && badge === badgeTotal;

  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Pressable
          onPress={onTitlePress}
          style={({ pressed }) => [styles.sectionTitleRow, { flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed && onTitlePress ? 0.7 : 1 }]}
          disabled={!onTitlePress}
          accessibilityRole={onTitlePress ? 'button' : 'text'}
          hitSlop={8}
        >
          <View style={[styles.sectionAccent, { backgroundColor: C.tint, marginRight: isRTL ? 0 : 7, marginLeft: isRTL ? 7 : 0 }]} />
          <Text style={[styles.sectionTitle, { color: C.text }]}>{title}</Text>
          {showProgress && (
            <View style={[styles.sectionBadge, { backgroundColor: allDone ? SECONDARY + '20' : C.tint + '15' }]}>
              <Text style={[styles.sectionBadgeText, { color: allDone ? SECONDARY : C.tint }]}>
                {badge}/{badgeTotal}
              </Text>
            </View>
          )}
          {!showProgress && badge !== undefined && (
            <View style={[styles.sectionBadge, { backgroundColor: C.tint + '15' }]}>
              <Text style={[styles.sectionBadgeText, { color: C.tint }]}>{badge}</Text>
            </View>
          )}
          {onTitlePress && <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textMuted} />}
        </Pressable>
        {action && (
          <Pressable
            onPress={onAction}
            style={({ pressed }) => [styles.sectionAction, { backgroundColor: C.tint + '15', flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.7 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={action}
          >
            <Ionicons name="add" size={14} color={C.tint} />
            <Text style={[styles.sectionActionText, { color: C.tint }]}>{action}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

interface FunTaskRowProps {
  task: Task; catName?: string; catColor?: string; catIcon?: string; timeStr?: string;
  onToggle: () => void; onLongPress?: () => void; C: ColorScheme; isRTL?: boolean; lang?: Language;
}

function FunTaskRow({ task, catName, catColor, catIcon, timeStr, onToggle, onLongPress, C, isRTL, lang }: FunTaskRowProps) {
  const isCompleted = task.status === 'completed';
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const { scheme: rowScheme } = useAppTheme();
  const isRowDark = rowScheme === 'dark';

  const priorityGrad: Record<string, readonly [string, string]> = {
    high: GRADIENT_CORAL,
    medium: GRADIENT_AMBER,
    low: GRADIENT_GREEN,
  };
  const grad = priorityGrad[task.priority];

  return (
    <AnimatedPressable
      style={[animStyle, styles.taskRow, { borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row', overflow: 'hidden' }, isRowDark ? ShadowDark.sm : Shadow.sm]}
      onPressIn={() => { scale.value = withSpring(0.98); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onLongPress={onLongPress}
      delayLongPress={400}
      accessibilityRole="button"
    >
      {isRowDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isRowDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.taskAccent} />
      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onToggle(); }}
        style={({ pressed }) => [styles.taskCheck, { opacity: pressed ? 0.7 : 1 }]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
      >
        <View style={[styles.checkCircle, { borderColor: isCompleted ? C.success : C.border, backgroundColor: isCompleted ? C.success : 'transparent' }]}>
          {isCompleted && <Ionicons name="checkmark" size={11} color="#fff" />}
        </View>
      </Pressable>
      <View style={[styles.taskInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.taskTitle, { color: isCompleted ? C.textMuted : C.text, textAlign: isRTL ? 'right' : 'left' }, isCompleted && { textDecorationLine: 'line-through' as const }]} numberOfLines={1}>
          {resolveDisplayName(task.title_ar, task.title_en, lang ?? 'en', task.title)}
        </Text>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'center', marginTop: 2 }}>
          {catName && (
            <View style={[styles.catPill, { backgroundColor: (catColor ?? C.tint) + '20', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {catIcon && (
                <Ionicons name={(catIcon + '-outline') as IoniconsName} size={11} color={catColor ?? C.tint} />
              )}
              <Text style={[styles.catPillText, { color: catColor ?? C.tint }]}>{catName}</Text>
            </View>
          )}
          {timeStr && <Text style={[styles.taskTime, { color: C.textMuted }]}>{timeStr}</Text>}
        </View>
      </View>
    </AnimatedPressable>
  );
}

function FunHabitCard({
  habit, onComplete, onUncomplete, C, lang,
}: {
  habit: Habit;
  onComplete: (id: string) => void;
  onUncomplete: (id: string) => void;
  C: ColorScheme;
  lang?: Language;
}) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const lastDate = habit.last_completed_at ? format(new Date(habit.last_completed_at), 'yyyy-MM-dd') : null;
  const isDone = lastDate === today;
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const { scheme: habitScheme } = useAppTheme();
  const isHabitDark = habitScheme === 'dark';

  const handlePress = () => {
    scale.value = withSpring(0.92, { damping: 10 });
    setTimeout(() => { scale.value = withSpring(1, { damping: 12 }); }, 120);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isDone) onUncomplete(habit.id);
    else onComplete(habit.id);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        animStyle,
        styles.habitCard,
        {
          backgroundColor: isDone ? habit.color + '12' : isHabitDark ? 'transparent' : C.card,
          borderColor: isDone ? habit.color + '55' : C.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ checked: isDone }}
      accessibilityLabel={resolveDisplayName(habit.name_ar, habit.name_en, lang ?? 'en', habit.name)}
    >
      {isHabitDark && !isDone && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {/* Top colour line */}
      <View style={[styles.habitTopLine, { backgroundColor: habit.color }]} />

      <View style={styles.habitCardInner}>
        {/* Icon area with optional done ring */}
        <View style={styles.habitIconWrap}>
          <View style={[
            styles.habitIconBox,
            { backgroundColor: isDone ? habit.color : habit.color + '1E' },
          ]}>
            <Ionicons
              name={(habit.icon + (isDone ? '' : '-outline')) as IoniconsName}
              size={24}
              color={isDone ? '#fff' : habit.color}
            />
          </View>
          {isDone && (
            <View style={styles.habitDoneBadge}>
              <Ionicons name="checkmark" size={9} color="#fff" />
            </View>
          )}
        </View>

        {/* Name */}
        <Text style={[styles.habitName, { color: isDone ? habit.color : C.text }]} numberOfLines={2}>
          {resolveDisplayName(habit.name_ar, habit.name_en, lang ?? 'en', habit.name)}
        </Text>

        {/* Streak */}
        <View style={styles.streakRow}>
          <Ionicons name="flame-outline" size={12} color={isDone ? habit.color : C.textMuted} />
          <Text style={[styles.streakNum, { color: isDone ? habit.color : C.textMuted }]}>
            {habit.streak_days}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

interface FunGoalCardProps {
  goal: Goal; progress: number; gradient: [string, string]; C: ColorScheme; isRTL?: boolean; lang?: Language;
}

function FunGoalCard({ goal, progress, gradient, C, isRTL, lang }: FunGoalCardProps) {
  const pct = Math.round(progress * 100);
  const { scheme: goalScheme } = useAppTheme();
  const isGoalDark = goalScheme === 'dark';

  return (
    <View style={[styles.goalCard, { borderColor: C.border, overflow: 'hidden' }, isGoalDark ? ShadowDark.sm : Shadow.sm]}>
      {isGoalDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isGoalDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md }}>
        <LinearGradient colors={gradient} style={styles.goalIcon}>
          <Ionicons name={((goal.icon ?? 'star') + '-outline') as IoniconsName} size={18} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[styles.goalTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>{resolveDisplayName(goal.title_ar, goal.title_en, lang ?? 'en', goal.title)}</Text>
          <Text style={[styles.goalSub, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {goal.current_value} / {goal.target_value}
          </Text>
        </View>
        <Text style={[styles.goalPct, { color: gradient[0] }]}>{pct}%</Text>
      </View>
      <View style={[styles.goalTrack, { backgroundColor: C.borderLight }]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.goalFill, { width: `${Math.min(pct, 100)}%` }]}
        />
      </View>
    </View>
  );
}

const MOOD_ICONS: Partial<Record<Mood, { icon: string; color: string }>> = {
  excellent:  { icon: 'happy',                  color: WARM_SAGE },
  veryGood:   { icon: 'happy-outline',          color: WARM_SAGE },
  good:       { icon: 'thumbs-up-outline',      color: PRIMARY },
  neutral:    { icon: 'remove-circle-outline',  color: WARM_CORAL },
  tired:      { icon: 'bed-outline',            color: WARM_CORAL },
  stressed:   { icon: 'flash-outline',          color: WARM_CORAL },
  sad:        { icon: 'rainy-outline',          color: SECONDARY },
  bad:        { icon: 'sad-outline',            color: WARM_ERROR },
};

function JournalHomeCard({ entry, onWrite, onOpen, C, tFunc, isRTL }: { entry?: JournalEntry; onWrite: () => void; onOpen: () => void; C: ColorScheme; tFunc: (k: string) => string; isRTL?: boolean }) {
  if (entry) {
    const moodCfg = entry.mood ? MOOD_ICONS[entry.mood] : null;
    return (
      <Pressable
        onPress={onOpen}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        accessibilityRole="button"
        accessibilityLabel={entry.title || tFunc('todayEntry')}
      >
        <View style={[styles.journalCard, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={[styles.journalCardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.journalIconBox, { backgroundColor: SECONDARY + '18' }]}>
              <Ionicons name="book-outline" size={20} color={SECONDARY} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.journalCardTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {entry.title || tFunc('todayEntry')}
              </Text>
              {moodCfg && (
                <View style={[styles.journalMoodBadge, { backgroundColor: moodCfg.color + '18', flexDirection: isRTL ? 'row-reverse' : 'row', alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Ionicons name={moodCfg.icon as IoniconsName} size={12} color={moodCfg.color} />
                  <Text style={[styles.journalMoodText, { color: moodCfg.color }]}>
                    {tFunc(`mood${entry.mood!.charAt(0).toUpperCase() + entry.mood!.slice(1)}`)}
                  </Text>
                </View>
              )}
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textMuted} />
          </View>
          <Text style={[styles.journalPreview, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
            {entry.content}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onWrite}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      accessibilityRole="button"
      accessibilityLabel={tFunc('startWriting')}
    >
      <View style={[styles.journalCard, { backgroundColor: C.card, borderColor: C.border }]}>
        <View style={[styles.journalCardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.journalIconBox, { backgroundColor: SECONDARY + '18' }]}>
            <Ionicons name="book-outline" size={20} color={SECONDARY} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.journalCardTitle, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
              {tFunc('noEntryToday')}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onWrite}
          style={({ pressed }) => [styles.journalWriteBtn, { backgroundColor: SECONDARY + '15', flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.7 : 1 }]}
          accessibilityRole="button"
          accessibilityLabel={tFunc('startWriting')}
        >
          <Ionicons name="create-outline" size={16} color={SECONDARY} />
          <Text style={[styles.journalWriteText, { color: SECONDARY }]}>{tFunc('startWriting')}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  heroDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  deco1: {
    position: 'absolute', right: -40, top: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  deco2: {
    position: 'absolute', right: 40, top: 60,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  deco3: {
    position: 'absolute', left: -30, bottom: 20,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroContent: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.md },
  heroLeft: { gap: 2, flex: 1 },
  heroLogo: { height: 28, marginBottom: 4 },
  heroTitle: { fontSize: 26, color: '#fff', fontFamily: F.bold, lineHeight: 32 },
  heroDate: { fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: F.med, marginTop: 2 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.65)', fontFamily: F.med },
  heroProgress: { gap: 6, marginTop: Spacing.md },
  heroProgressBar: {
    height: 6, borderRadius: 4, overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%', borderRadius: 4,
  },
  heroProgressLabelRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  heroProgressText: {
    fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: F.med,
  },
  heroProgressPct: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  heroProgressPctText: {
    fontSize: 11, color: 'rgba(255,255,255,0.9)', fontFamily: F.bold,
  },
  addBtn: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: PRIMARY, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xl,
    marginBottom: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statDivider: { width: 1, alignSelf: 'stretch', marginVertical: 4 },
  statPill: { flex: 1, alignItems: 'center', gap: 4 },
  statPillIcon: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  statPillNum: { fontSize: 18, fontFamily: F.bold },
  statPillLabel: { fontSize: 10, fontFamily: F.med, textAlign: 'center' },

  // Week strip
  weekCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
    position: 'relative' as const,
  },
  dayPill: { flex: 1, borderRadius: Radius.lg, alignItems: 'center', paddingVertical: 8, gap: 2 },
  dayLbl: { fontSize: 10, fontFamily: F.med },
  dayNum: { fontSize: 16, fontFamily: F.med },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 1 },

  // All done
  allDoneBanner: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  allDoneEmoji: { fontSize: 28 },
  allDoneTitle: { fontSize: 15, fontFamily: F.bold, color: '#fff' },
  allDoneSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: F.reg, marginTop: 2 },

  // Section
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionAccent: { width: 4, height: 22, borderRadius: 3 },
  sectionTitle: { fontSize: 20, fontFamily: F.bold },
  sectionBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  sectionBadgeText: { fontSize: 12, fontFamily: F.bold },
  sectionAction: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  sectionActionText: { fontSize: 12, fontFamily: F.med },

  // See more button
  seeMoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    borderRadius: Radius.lg, borderWidth: 1,
    paddingVertical: Spacing.sm + 2, marginTop: 2,
  },
  seeMoreText: { fontSize: 13, fontFamily: F.med },

  // Clear completed
  clearCompletedBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: Spacing.sm, marginTop: 4,
  },
  clearCompletedText: { fontSize: 12, fontFamily: F.med },

  // Task row
  taskRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1,
  },
  taskAccent: { width: 4, alignSelf: 'stretch' },
  taskCheck: { padding: Spacing.md, paddingRight: Spacing.sm },
  checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  taskInfo: { flex: 1, paddingVertical: Spacing.md, paddingRight: Spacing.sm },
  taskTitle: { fontSize: 15, fontFamily: F.med },
  taskTime: { fontSize: 12, fontFamily: F.reg },
  catPill: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 3 },
  catPillText: { fontSize: 11, fontFamily: F.med },

  // Habit card
  habitCard: {
    width: 128, borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  habitTopLine: { height: 4, width: '100%' },
  habitCardInner: { padding: Spacing.md, gap: Spacing.sm },
  habitIconWrap: { position: 'relative' as const, alignSelf: 'flex-start' as const },
  habitIconBox: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  habitDoneBadge: {
    position: 'absolute' as const, top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: WARM_SAGE,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  habitName: { fontSize: 13, fontFamily: F.med, lineHeight: 18 },
  streakRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 3 },
  streakNum: { fontSize: 12, fontFamily: F.med },

  // Goal card
  goalCard: {
    borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.lg,
    position: 'relative' as const,
  },
  goalIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  goalTitle: { fontSize: 15, fontFamily: F.bold },
  goalSub: { fontSize: 12, fontFamily: F.reg, marginTop: 1 },
  goalPct: { fontSize: 22, fontFamily: F.bold },
  goalTrack: { height: 10, borderRadius: 6, overflow: 'hidden', marginTop: 4 },
  goalFill: { height: '100%', borderRadius: 6 },

  // Habits empty state
  habitsEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  habitsEmptyIcon: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  habitsEmptyTitle: { fontSize: 15, fontFamily: F.med },
  habitsEmptySubtitle: { fontSize: 12, fontFamily: F.reg, marginTop: 2 },

  // Journal card
  journalCard: {
    borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: PRIMARY, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  journalCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  journalIconBox: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  journalCardTitle: { fontSize: 15, fontFamily: F.bold },
  journalMoodBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2,
    alignSelf: 'flex-start', marginTop: 4,
  },
  journalMoodText: { fontSize: 11, fontFamily: F.med },
  journalPreview: { fontSize: 13, fontFamily: F.reg, lineHeight: 18 },
  journalWriteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderRadius: Radius.lg, paddingVertical: Spacing.sm + 2, marginTop: Spacing.xs,
  },
  journalWriteText: { fontSize: 14, fontFamily: F.med },
});

const qaStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center', marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontSize: 20, fontFamily: F.bold,
    marginBottom: Spacing.lg,
  },
  itemGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  item: {
    width: '47%',
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  itemGrad: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  itemIconWrap: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  itemLabel: { fontSize: 15, fontFamily: F.bold, color: '#fff' },
  itemSub: { fontSize: 12, fontFamily: F.reg, color: 'rgba(255,255,255,0.75)' },
  cancelBtn: {
    borderRadius: Radius.xl, borderWidth: 1,
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontFamily: F.med },
});
