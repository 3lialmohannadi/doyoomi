import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useTasksStore } from '../../src/store/tasksStore';
import { useGoalsStore } from '../../src/store/goalsStore';
import { useHabitsStore } from '../../src/store/habitsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { Spacing, Typography, Radius, Shadow } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t, getGreeting } from '../../src/utils/i18n';
import { getTodayString, getWeekDays, getDayLabel, formatDateKey, formatTime, isOverdue } from '../../src/utils/date';
import { HabitForm } from '../../src/features/habits/HabitForm';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { Task, Habit } from '../../src/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { tasks, toggleComplete, deleteTask, postponeTask } = useTasksStore();
  const { goals } = useGoalsStore();
  const { habits, completeHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const { categories } = useCategoriesStore();
  const lang = profile.language;

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [selectedDay, setSelectedDay] = useState(getTodayString());

  const weekDays = useMemo(() => getWeekDays(profile.start_of_week), [profile.start_of_week]);
  const today = getTodayString();
  const tFunc = (key: string) => t(key, lang);

  const todayTasks = useMemo(() => tasks.filter(t => t.due_date === today), [tasks, today]);
  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  const overdueCount = tasks.filter(t => t.status === 'overdue' || (t.due_date && isOverdue(t.due_date) && t.status === 'pending')).length;
  const thisWeek = tasks.filter(t => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d >= weekDays[0] && d <= weekDays[6];
  }).length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak_days), 0);
  const dayTasks = tasks.filter(t => t.due_date === selectedDay);
  const allDone = todayTasks.length > 0 && todayTasks.every(t => t.status === 'completed');
  const topGoals = goals.slice(0, 2);
  const topPad = isWeb ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: (isWeb ? 34 : 0) + 100 }}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={['#7C5CFC', '#A855F7', '#FF6B9D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + Spacing.md }]}
        >
          {/* Decorative circles */}
          <View style={[styles.deco1]} />
          <View style={[styles.deco2]} />

          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.greeting}>{getGreeting(lang)}</Text>
              <Text style={styles.heroTitle}>Do.Yoomi</Text>
              <Text style={styles.heroSub}>يومي</Text>
            </View>
            <AddBtn onPress={() => setShowTaskForm(true)} />
          </View>

          {/* Stats bar inside hero */}
          <View style={styles.statsRow}>
            <HeroStat icon="checkmark-circle" value={completedToday} label={tFunc('completed')} color="#00E5A0" />
            <View style={styles.statDivider} />
            <HeroStat icon="alert-circle" value={overdueCount} label={tFunc('overdue')} color="#FF6B9D" />
            <View style={styles.statDivider} />
            <HeroStat icon="calendar" value={thisWeek} label={tFunc('thisWeek')} color="#FFF" />
            <View style={styles.statDivider} />
            <HeroStat icon="flame" value={maxStreak} label={tFunc('streak')} color="#FFB800" />
          </View>
        </LinearGradient>

        {/* Week Strip */}
        <View style={[styles.weekCard, { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, ...Shadow.sm }]}>
          {weekDays.map((day) => {
            const key = formatDateKey(day);
            const isSelected = key === selectedDay;
            const isToday = key === today;
            const hasDots = tasks.some(t => t.due_date === key);

            return (
              <Pressable
                key={key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDay(key);
                }}
                style={[styles.dayPill, { overflow: 'hidden' }]}
              >
                {isSelected && (
                  <LinearGradient
                    colors={['#7C5CFC', '#FF6B9D']}
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
                  isToday && !isSelected && { fontFamily: 'Inter_700Bold' },
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
              colors={['#00C48C', '#00E5A0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.allDoneBanner}
            >
              <Text style={styles.allDoneEmoji}>🎉</Text>
              <View>
                <Text style={styles.allDoneTitle}>{tFunc('allDoneToday')}</Text>
                <Text style={styles.allDoneSub}>{tFunc('allDoneSubtitle')}</Text>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Today Tasks */}
        {dayTasks.length > 0 && (
          <Section
            title={selectedDay === today ? tFunc('today2') : format(new Date(selectedDay + 'T00:00:00'), 'MMM d')}
            C={C}
            action={tFunc('addNew')}
            onAction={() => setShowTaskForm(true)}
          >
            <View style={{ gap: Spacing.sm }}>
              {dayTasks.slice(0, 4).map(task => {
                const cat = categories.find(c => c.id === task.category_id);
                return (
                  <FunTaskRow
                    key={task.id}
                    task={task}
                    catName={cat?.name}
                    catColor={cat?.color}
                    timeStr={task.due_time ? formatTime(task.due_time, profile.time_format === '12h') : undefined}
                    onToggle={() => toggleComplete(task.id)}
                    C={C}
                  />
                );
              })}
            </View>
          </Section>
        )}

        {/* Habits */}
        <Section
          title={tFunc('habits')}
          C={C}
          action={tFunc('addNew')}
          onAction={() => { setEditHabit(null); setShowHabitForm(true); }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -Spacing.lg }} contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.md }}>
            {habits.map(h => (
              <FunHabitCard key={h.id} habit={h} onComplete={completeHabit} C={C} />
            ))}
          </ScrollView>
        </Section>

        {/* Goals */}
        {topGoals.length > 0 && (
          <Section title={tFunc('goalsSection')} C={C}>
            <View style={{ gap: Spacing.md }}>
              {topGoals.map((g, i) => {
                const pct = g.target_value > 0 ? g.current_value / g.target_value : 0;
                const goalGradients: [string, string][] = [
                  ['#7C5CFC', '#FF6B9D'],
                  ['#FF6B35', '#FFB347'],
                  ['#00C48C', '#00B8A9'],
                  ['#FF4D6A', '#FF8E53'],
                ];
                const grad = goalGradients[i % goalGradients.length];
                return (
                  <FunGoalCard key={g.id} goal={g} progress={pct} gradient={grad} C={C} />
                );
              })}
            </View>
          </Section>
        )}

        {/* Weekly vibe chart */}
        <Section title={tFunc('weeklyOverview')} C={C}>
          <FunWeekChart weekDays={weekDays} tasks={tasks} C={C} tFunc={tFunc} />
        </Section>
      </ScrollView>

      <TaskForm visible={showTaskForm} onClose={() => { setShowTaskForm(false); setEditTask(null); }} editTask={editTask} />
      <HabitForm visible={showHabitForm} onClose={() => { setShowHabitForm(false); setEditHabit(null); }} editHabit={editHabit} />
    </View>
  );
}

function AddBtn({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      style={animStyle}
      onPressIn={() => { scale.value = withSpring(0.88); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress(); }}
    >
      <View style={styles.addBtn}>
        <Ionicons name="add" size={28} color="#7C5CFC" />
      </View>
    </AnimatedPressable>
  );
}

function HeroStat({ icon, value, label, color }: { icon: any; value: number; label: string; color: string }) {
  return (
    <View style={styles.heroStat}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={styles.heroStatNum}>{value}</Text>
      <Text style={styles.heroStatLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, children, C, action, onAction }: any) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: C.text }]}>{title}</Text>
        {action && (
          <Pressable onPress={onAction} style={[styles.sectionAction, { backgroundColor: C.tint + '15' }]}>
            <Ionicons name="add" size={14} color={C.tint} />
            <Text style={[styles.sectionActionText, { color: C.tint }]}>{action}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

function FunTaskRow({ task, catName, catColor, timeStr, onToggle, C }: any) {
  const isCompleted = task.status === 'completed';
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const priorityGrad: Record<string, [string, string]> = {
    high: ['#FF4D6A', '#FF8E53'],
    medium: ['#FFB800', '#FFD700'],
    low: ['#00C48C', '#00E5A0'],
  };
  const grad = priorityGrad[task.priority];

  return (
    <AnimatedPressable
      style={[animStyle, styles.taskRow, { backgroundColor: C.card, borderColor: C.border }]}
      onPressIn={() => { scale.value = withSpring(0.98); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.taskAccent} />
      <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onToggle(); }} style={styles.taskCheck}>
        <View style={[styles.checkCircle, { borderColor: isCompleted ? C.success : C.border, backgroundColor: isCompleted ? C.success : 'transparent' }]}>
          {isCompleted && <Ionicons name="checkmark" size={11} color="#fff" />}
        </View>
      </Pressable>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, { color: isCompleted ? C.textMuted : C.text }, isCompleted && { textDecorationLine: 'line-through' as const }]} numberOfLines={1}>
          {task.title}
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 2 }}>
          {catName && (
            <View style={[styles.catPill, { backgroundColor: (catColor ?? C.tint) + '20' }]}>
              <Text style={[styles.catPillText, { color: catColor ?? C.tint }]}>{catName}</Text>
            </View>
          )}
          {timeStr && <Text style={[styles.taskTime, { color: C.textMuted }]}>{timeStr}</Text>}
        </View>
      </View>
    </AnimatedPressable>
  );
}

function FunHabitCard({ habit, onComplete, C }: { habit: any; onComplete: (id: string) => void; C: any }) {
  const { format: fmtDate } = require('date-fns');
  const today = fmtDate(new Date(), 'yyyy-MM-dd');
  const lastDate = habit.last_completed_at ? fmtDate(new Date(habit.last_completed_at), 'yyyy-MM-dd') : null;
  const isDone = lastDate === today;

  const ICONS: Record<string, any> = {
    leaf: 'leaf', water: 'water', journal: 'journal', 'phone-portrait': 'phone-portrait',
    fitness: 'fitness', moon: 'moon', book: 'book', nutrition: 'nutrition', walk: 'walk', bed: 'bed',
  };

  return (
    <Pressable
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onComplete(habit.id); }}
      style={[styles.habitCard, !isDone && { borderWidth: 1, borderColor: C.border }]}
    >
      <LinearGradient
        colors={isDone ? [habit.color, habit.color + 'CC'] : [C.card, C.card]}
        style={styles.habitCardInner}
      >
        <View style={[styles.habitIconBox, { backgroundColor: isDone ? 'rgba(255,255,255,0.25)' : habit.color + '20' }]}>
          <Ionicons name={(ICONS[habit.icon] ?? 'star') + '-outline'} size={20} color={isDone ? '#fff' : habit.color} />
        </View>
        <Text style={[styles.habitName, { color: isDone ? '#fff' : C.text }]} numberOfLines={2}>{habit.name}</Text>
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={13} color={isDone ? '#FFD700' : C.streak} />
          <Text style={[styles.streakNum, { color: isDone ? '#FFD700' : C.streak }]}>{habit.streak_days}</Text>
        </View>
        {isDone && (
          <View style={styles.doneCheck}>
            <Ionicons name="checkmark-circle" size={18} color="#FFD700" />
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

function FunGoalCard({ goal, progress, gradient, C }: any) {
  const pct = Math.round(progress * 100);
  const ICONS: Record<string, any> = {
    book: 'book', fitness: 'fitness', card: 'card', language: 'language',
    star: 'star', heart: 'heart', trophy: 'trophy', rocket: 'rocket', leaf: 'leaf', water: 'water',
  };

  return (
    <View style={[styles.goalCard, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md }}>
        <LinearGradient colors={gradient} style={styles.goalIcon}>
          <Ionicons name={(ICONS[goal.icon] ?? 'star') + '-outline'} size={18} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[styles.goalTitle, { color: C.text }]} numberOfLines={1}>{goal.title}</Text>
          <Text style={[styles.goalSub, { color: C.textSecondary }]}>
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

function FunWeekChart({ weekDays, tasks, C, tFunc }: any) {
  const maxVal = 8;
  const data = weekDays.map((d: Date) => {
    const key = formatDateKey(d);
    const count = tasks.filter((t: any) => t.due_date === key).length;
    const done = tasks.filter((t: any) => t.due_date === key && t.status === 'completed').length;
    return { day: getDayLabel(d, 'en').slice(0, 1), count, done };
  });

  const barColors: [string, string][] = [
    ['#7C5CFC', '#A855F7'],
    ['#FF6B9D', '#FF9DB3'],
    ['#00C48C', '#00E5A0'],
    ['#FFB800', '#FFD700'],
    ['#FF6B35', '#FFB347'],
    ['#7C5CFC', '#A855F7'],
    ['#FF6B9D', '#FF9DB3'],
  ];

  return (
    <View style={[styles.chartCard, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={styles.chartBars}>
        {data.map((d: any, i: number) => {
          const h = d.count > 0 ? Math.max((d.count / maxVal) * 64, 8) : 6;
          const doneH = d.done > 0 ? Math.max((d.done / maxVal) * 64, 6) : 0;
          return (
            <View key={i} style={styles.chartCol}>
              <View style={styles.chartBar}>
                <View style={[styles.chartBarBg, { height: h, backgroundColor: C.borderLight, borderRadius: 8 }]}>
                  {doneH > 0 && (
                    <LinearGradient
                      colors={barColors[i]}
                      style={[styles.chartBarFill, { height: doneH }]}
                    />
                  )}
                </View>
              </View>
              <Text style={[styles.chartDay, { color: C.textMuted }]}>{d.day}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <LinearGradient colors={['#7C5CFC', '#A855F7']} style={styles.legendDot} />
          <Text style={[styles.legendText, { color: C.textSecondary }]}>{tFunc('chartDone')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: C.borderLight }]} />
          <Text style={[styles.legendText, { color: C.textSecondary }]}>{tFunc('chartTotal')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    position: 'relative',
    overflow: 'hidden',
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
  heroContent: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.xl },
  heroLeft: { gap: 2 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_500Medium' },
  heroTitle: { fontSize: 32, color: '#fff', fontFamily: 'Inter_700Bold', lineHeight: 36 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter_500Medium' },
  addBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  heroStat: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  heroStatNum: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  heroStatLabel: { fontSize: 10, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  // Week strip
  weekCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.sm,
    marginTop: -Spacing.xl,
    marginBottom: Spacing.lg,
  },
  dayPill: { flex: 1, borderRadius: Radius.lg, alignItems: 'center', paddingVertical: 8, gap: 2 },
  dayLbl: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  dayNum: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
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
  allDoneTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },
  allDoneSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular', marginTop: 2 },

  // Section
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  sectionAction: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  sectionActionText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },

  // Task row
  taskRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  taskAccent: { width: 4, alignSelf: 'stretch' },
  taskCheck: { padding: Spacing.md, paddingRight: Spacing.sm },
  checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  taskInfo: { flex: 1, paddingVertical: Spacing.md, paddingRight: Spacing.sm },
  taskTitle: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  taskTime: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  catPill: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  catPillText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  // Habit card
  habitCard: { width: 130, borderRadius: Radius.xl, overflow: 'hidden', shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
  habitCardInner: { padding: Spacing.md, gap: Spacing.sm, minHeight: 110, position: 'relative' },
  habitIconBox: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  habitName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', lineHeight: 17 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 'auto' as any },
  streakNum: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  doneCheck: { position: 'absolute', top: 8, right: 8 },

  // Goal card
  goalCard: {
    borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.lg,
    shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  goalIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  goalTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  goalSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  goalPct: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  goalTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', borderRadius: 4 },

  // Chart
  chartCard: {
    borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.lg,
    shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 2,
  },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 6, marginBottom: Spacing.sm },
  chartCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartBar: { width: '100%', height: 70, justifyContent: 'flex-end' },
  chartBarBg: { width: '100%', justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: '100%', borderRadius: 8 },
  chartDay: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  chartLegend: { flexDirection: 'row', gap: Spacing.md, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
});
