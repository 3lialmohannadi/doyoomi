import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, useColorScheme, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { useTasksStore } from '../../src/store/tasksStore';
import { useGoalsStore } from '../../src/store/goalsStore';
import { useHabitsStore } from '../../src/store/habitsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { Colors, Spacing, Typography, Radius, Shadow, GRADIENT_PRIMARY } from '../../src/theme';
import { t, getGreeting } from '../../src/utils/i18n';
import { getTodayString, getWeekDays, getDayLabel, formatDateKey, formatTime, isOverdue } from '../../src/utils/date';
import { AddButton } from '../../src/components/ui/AddButton';
import { Card } from '../../src/components/ui/Card';
import { GradientCard } from '../../src/components/ui/GradientCard';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { HabitCard } from '../../src/components/ui/HabitCard';
import { HabitForm } from '../../src/features/habits/HabitForm';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { Task } from '../../src/types';

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { tasks, toggleComplete, deleteTask, postponeTask, updateTask } = useTasksStore();
  const { goals } = useGoalsStore();
  const { habits, completeHabit, deleteHabit, updateHabit, addHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const { categories } = useCategoriesStore();
  const lang = profile.language;

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editHabit, setEditHabit] = useState<any>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [selectedDay, setSelectedDay] = useState(getTodayString());

  const weekDays = useMemo(() => getWeekDays(profile.start_of_week), [profile.start_of_week]);
  const today = getTodayString();

  const todayTasks = useMemo(() =>
    tasks.filter(t => t.due_date === today), [tasks, today]);
  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  const overdueCount = tasks.filter(t => t.status === 'overdue' || (t.due_date && isOverdue(t.due_date) && t.status === 'pending')).length;
  const thisWeek = tasks.filter(t => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    const start = weekDays[0];
    const end = weekDays[6];
    return d >= start && d <= end;
  }).length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak_days), 0);

  const dayTasks = tasks.filter(t => t.due_date === selectedDay);
  const allDone = todayTasks.length > 0 && todayTasks.every(t => t.status === 'completed');

  const topGoals = goals.slice(0, 3);

  const handleEditHabit = (habit: any) => {
    setEditHabit(habit);
    setShowHabitForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  const tFunc = (key: string) => t(key, lang);

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPad + Spacing.md, paddingBottom: bottomPad + 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: C.textSecondary }]}>{getGreeting(lang)}</Text>
            <Text style={[styles.appName, { color: C.text }]}>My.Uoomi</Text>
          </View>
          <AddButton onPress={() => setShowTaskForm(true)} size={44} />
        </View>

        {/* Week Strip */}
        <View style={styles.weekStrip}>
          {weekDays.map((day) => {
            const key = formatDateKey(day);
            const isSelected = key === selectedDay;
            const isToday = key === today;
            const dayTasks = tasks.filter(t => t.due_date === key);

            return (
              <Pressable
                key={key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDay(key);
                }}
                style={[styles.dayPill, isSelected && styles.dayPillSelected, { overflow: 'hidden' }]}
              >
                {isSelected && (
                  <LinearGradient
                    colors={['#6C8EF5', '#F0A4C8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <Text style={[styles.dayLabel, { color: isSelected ? '#fff' : C.textMuted }]}>
                  {getDayLabel(day, lang)}
                </Text>
                <Text style={[styles.dayNum, { color: isSelected ? '#fff' : isToday ? C.tint : C.text }]}>
                  {format(day, 'd')}
                </Text>
                {dayTasks.length > 0 && !isSelected && (
                  <View style={[styles.dot, { backgroundColor: C.tint }]} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
          <StatCard icon="checkmark-circle" value={completedToday} label={tFunc('completed')} color={C.success} bg={C.success + '15'} />
          <StatCard icon="alert-circle" value={overdueCount} label={tFunc('overdue')} color={C.error} bg={C.error + '15'} />
          <StatCard icon="calendar" value={thisWeek} label={tFunc('thisWeek')} color={C.tint} bg={C.tint + '15'} />
          <StatCard icon="flame" value={maxStreak} label={tFunc('streak')} color={C.streak} bg={C.streak + '15'} />
        </ScrollView>

        {/* All done state */}
        {allDone ? (
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
            <GradientCard colors={['#6C8EF5', '#B08EF5', '#F0A4C8']} style={{ padding: Spacing.xl }}>
              <View style={styles.allDoneRow}>
                <Ionicons name="checkmark-done-circle" size={32} color="#fff" />
                <View style={{ marginLeft: Spacing.md }}>
                  <Text style={styles.allDoneTitle}>{tFunc('allDoneToday')}</Text>
                  <Text style={styles.allDoneSubtitle}>{tFunc('allDoneSubtitle')}</Text>
                </View>
              </View>
            </GradientCard>
          </View>
        ) : null}

        {/* Today Tasks Preview */}
        {!allDone && dayTasks.length > 0 ? (
          <>
            <SectionHeader title={selectedDay === today ? tFunc('today2') : format(new Date(selectedDay), 'MMM d')} />
            <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}>
              {dayTasks.slice(0, 3).map((task) => {
                const cat = categories.find(c => c.id === task.category_id);
                return (
                  <MiniTaskRow
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
          </>
        ) : null}

        {/* Habits */}
        <SectionHeader
          title={tFunc('habits')}
          actionLabel={tFunc('addNew')}
          onAction={() => { setEditHabit(null); setShowHabitForm(true); }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.habitsRow}>
          {habits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              onComplete={completeHabit}
              onEdit={handleEditHabit}
              onDelete={deleteHabit}
              compact
              t={tFunc}
            />
          ))}
        </ScrollView>

        {/* Goals Preview */}
        <SectionHeader title={tFunc('goalsSection')} />
        <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}>
          {topGoals.map(g => {
            const pct = g.target_value > 0 ? g.current_value / g.target_value : 0;
            return (
              <Card key={g.id} style={{ padding: Spacing.md }}>
                <View style={styles.goalRow}>
                  <View style={[styles.goalIcon, { backgroundColor: g.color + '20' }]}>
                    <Ionicons name="star-outline" size={16} color={g.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.goalTitle, { color: C.text }]}>{g.title}</Text>
                    <ProgressBar progress={pct} color={g.color} height={5} />
                  </View>
                  <Text style={[styles.goalPct, { color: g.color }]}>{Math.round(pct * 100)}%</Text>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Weekly Chart */}
        <SectionHeader title={tFunc('weeklyOverview')} />
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <WeeklyChart weekDays={weekDays} tasks={tasks} C={C} />
        </View>
      </ScrollView>

      <TaskForm
        visible={showTaskForm}
        onClose={() => { setShowTaskForm(false); setEditTask(null); }}
        editTask={editTask}
      />
      <HabitForm
        visible={showHabitForm}
        onClose={() => { setShowHabitForm(false); setEditHabit(null); }}
        editHabit={editHabit}
      />
    </View>
  );
}

function StatCard({ icon, value, label, color, bg }: { icon: any; value: number; label: string; color: string; bg: string }) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];
  return (
    <View style={[statStyles.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={[statStyles.iconBox, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[statStyles.value, { color: C.text }]}>{value}</Text>
      <Text style={[statStyles.label, { color: C.textSecondary }]}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    width: 100,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
  },
  iconBox: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  value: { ...Typography.heading2, fontSize: 24 },
  label: { ...Typography.label, textAlign: 'center' },
});

function MiniTaskRow({ task, catName, catColor, timeStr, onToggle, C }: any) {
  const isCompleted = task.status === 'completed';
  const accentColor = task.priority === 'high' ? C.priorityHigh : task.priority === 'medium' ? C.priorityMedium : C.priorityLow;
  return (
    <View style={[miniStyles.row, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={[miniStyles.accent, { backgroundColor: accentColor }]} />
      <Pressable onPress={onToggle} style={miniStyles.check}>
        <View style={[miniStyles.circle, { borderColor: isCompleted ? C.success : C.border, backgroundColor: isCompleted ? C.success : 'transparent' }]}>
          {isCompleted && <Ionicons name="checkmark" size={10} color="#fff" />}
        </View>
      </Pressable>
      <Text style={[miniStyles.title, { color: isCompleted ? C.textMuted : C.text }, isCompleted && { textDecorationLine: 'line-through' as const }]} numberOfLines={1}>
        {task.title}
      </Text>
      {timeStr ? <Text style={[miniStyles.time, { color: C.textMuted }]}>{timeStr}</Text> : null}
      {catName ? (
        <View style={[miniStyles.catBadge, { backgroundColor: (catColor ?? C.tint) + '20' }]}>
          <Text style={[miniStyles.catText, { color: catColor ?? C.tint }]}>{catName}</Text>
        </View>
      ) : null}
    </View>
  );
}

const miniStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    gap: Spacing.sm,
    paddingRight: Spacing.sm,
    ...Shadow.sm,
  },
  accent: { width: 3, alignSelf: 'stretch' },
  check: { padding: 10 },
  circle: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  title: { ...Typography.bodyMedium, flex: 1, fontFamily: 'Inter_500Medium' },
  time: { ...Typography.label },
  catBadge: { borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2 },
  catText: { ...Typography.label, fontFamily: 'Inter_600SemiBold', fontSize: 10 },
});

function WeeklyChart({ weekDays, tasks, C }: any) {
  const maxTasks = 8;
  const data = weekDays.map((d: Date) => {
    const key = formatDateKey(d);
    const count = tasks.filter((t: any) => t.due_date === key).length;
    const done = tasks.filter((t: any) => t.due_date === key && t.status === 'completed').length;
    return { day: getDayLabel(d, 'en'), count, done };
  });

  return (
    <Card style={{ padding: Spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, height: 70 }}>
        {data.map((d: any, i: number) => {
          const h = d.count > 0 ? Math.max((d.count / maxTasks) * 60, 6) : 4;
          const doneH = d.done > 0 ? Math.max((d.done / maxTasks) * 60, 4) : 0;
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <View style={{ width: '100%', height: 60, justifyContent: 'flex-end', borderRadius: 4, overflow: 'hidden' }}>
                <View style={{ height: h, backgroundColor: C.tint + '30', borderRadius: 4 }}>
                  {doneH > 0 && (
                    <LinearGradient colors={['#6C8EF5', '#F0A4C8']} style={{ height: doneH, borderRadius: 4 }} />
                  )}
                </View>
              </View>
              <Text style={{ ...Typography.label, color: C.textMuted }}>{d.day.slice(0, 1)}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerLeft: { gap: 2 },
  greeting: { ...Typography.caption, fontFamily: 'Inter_500Medium' },
  appName: { ...Typography.heading2 },
  weekStrip: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  dayPill: {
    flex: 1,
    borderRadius: Radius.lg,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  dayPillSelected: { ...Shadow.sm },
  dayLabel: { ...Typography.label },
  dayNum: { ...Typography.caption, fontFamily: 'Inter_600SemiBold' },
  dot: { width: 4, height: 4, borderRadius: 2 },
  statsRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
  },
  allDoneRow: { flexDirection: 'row', alignItems: 'center' },
  allDoneTitle: { ...Typography.subtitle, color: '#fff' },
  allDoneSubtitle: { ...Typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  habitsRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.md, flexDirection: 'row' },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  goalIcon: { width: 32, height: 32, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  goalTitle: { ...Typography.captionMedium, marginBottom: 4, fontFamily: 'Inter_500Medium' },
  goalPct: { ...Typography.captionMedium, fontFamily: 'Inter_700Bold', minWidth: 36, textAlign: 'right' },
});
