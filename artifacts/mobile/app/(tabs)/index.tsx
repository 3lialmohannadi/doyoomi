import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';

import { useTasksStore } from '../../src/store/tasksStore';
import { useGoalsStore } from '../../src/store/goalsStore';
import { useHabitsStore } from '../../src/store/habitsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { useJournalStore } from '../../src/store/journalStore';
import { Spacing, Typography, Radius, Shadow } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t, getGreeting } from '../../src/utils/i18n';
import { getTodayString, getWeekDays, getDayLabel, formatDateKey, formatTime, isOverdue } from '../../src/utils/date';
import { HabitForm } from '../../src/features/habits/HabitForm';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { JournalForm } from '../../src/features/journal/JournalForm';
import { Task, Habit, Mood, JournalEntry } from '../../src/types';

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
  const { entries: journalEntries } = useJournalStore();
  const lang = profile.language;

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [selectedDay, setSelectedDay] = useState(getTodayString());
  const isRTL = lang === 'ar';

  const weekDays = useMemo(() => getWeekDays(profile.start_of_week), [profile.start_of_week]);
  const today = getTodayString();
  const tFunc = (key: string) => t(key, lang);

  const todayTasks = useMemo(() => tasks.filter(task => task.due_date === today), [tasks, today]);
  const completedToday = todayTasks.filter(task => task.status === 'completed').length;
  const overdueCount = tasks.filter(task => task.status === 'overdue' || (task.due_date && isOverdue(task.due_date) && task.status === 'pending')).length;
  const thisWeek = tasks.filter(task => {
    if (!task.due_date) return false;
    const d = new Date(task.due_date);
    return d >= weekDays[0] && d <= weekDays[6];
  }).length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak_days), 0);
  const dayTasks = tasks.filter(task => task.due_date === selectedDay);
  const allDone = todayTasks.length > 0 && todayTasks.every(task => task.status === 'completed');
  const topGoals = goals.slice(0, 2);
  const todayJournal = journalEntries.find(e => e.date === today);
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

          <View style={[styles.heroContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.heroLeft, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.greeting, { textAlign: isRTL ? 'right' : 'left' }]}>{getGreeting(lang)}</Text>
              <Text style={[styles.heroTitle, { textAlign: isRTL ? 'right' : 'left' }]}>Do.Yoomi</Text>
              <Text style={[styles.heroSub, { textAlign: isRTL ? 'right' : 'left' }]}>يومي</Text>
            </View>
            <AddBtn onPress={() => setShowTaskForm(true)} />
          </View>

        </LinearGradient>

        {/* Stats Cards */}
        <View style={[styles.statsRow, { backgroundColor: C.card, borderColor: C.border }]}>
          <HeroStat icon="checkmark-circle" value={completedToday} label={tFunc('completed')} color="#00C48C" C={C} />
          <HeroStat icon="alert-circle" value={overdueCount} label={tFunc('overdue')} color="#FF4D6A" C={C} />
          <HeroStat icon="calendar" value={thisWeek} label={tFunc('thisWeek')} color={C.tint} C={C} />
          <HeroStat icon="flame" value={maxStreak} label={tFunc('streak')} color="#FF6B35" C={C} />
        </View>

        {/* Week Strip */}
        <View style={[styles.weekCard, { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, ...Shadow.sm }]}>
          {weekDays.map((day) => {
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
        {dayTasks.length > 0 && (
          <Section
            title={selectedDay === today ? tFunc('today2') : format(parseISO(selectedDay), 'MMM d')}
            C={C} isRTL={isRTL}
            action={tFunc('addNew')}
            onAction={() => setShowTaskForm(true)}
            onTitlePress={() => router.push('/tasks')}
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
                    C={C} isRTL={isRTL}
                  />
                );
              })}
            </View>
          </Section>
        )}

        {/* Habits */}
        <Section
          title={tFunc('habits')}
          C={C} isRTL={isRTL}
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
          <Section title={tFunc('goalsSection')} C={C} isRTL={isRTL} onTitlePress={() => router.push('/goals')}>
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
                  <Pressable key={g.id} onPress={() => router.push('/goals')}>
                    <FunGoalCard goal={g} progress={pct} gradient={grad} C={C} isRTL={isRTL} />
                  </Pressable>
                );
              })}
            </View>
          </Section>
        )}

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

        {/* Weekly vibe chart */}
        <Section title={tFunc('weeklyAchievement')} C={C} isRTL={isRTL}>
          <FunWeekChart weekDays={weekDays} tasks={tasks} C={C} tFunc={tFunc} lang={lang} />
        </Section>
      </ScrollView>

      <TaskForm visible={showTaskForm} onClose={() => { setShowTaskForm(false); setEditTask(null); }} editTask={editTask} />
      <HabitForm visible={showHabitForm} onClose={() => { setShowHabitForm(false); setEditHabit(null); }} editHabit={editHabit} />
      <JournalForm visible={showJournalForm} onClose={() => setShowJournalForm(false)} />
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

function HeroStat({ icon, value, label, color, C }: { icon: any; value: number; label: string; color: string; C: any }) {
  return (
    <View style={styles.heroStat}>
      <View style={[styles.heroStatIcon, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.heroStatNum, { color: C.text }]}>{value}</Text>
      <Text style={[styles.heroStatLabel, { color: C.textSecondary }]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function Section({ title, children, C, action, onAction, onTitlePress, isRTL }: any) {
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Pressable onPress={onTitlePress} style={[styles.sectionTitleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]} disabled={!onTitlePress}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>{title}</Text>
          {onTitlePress && <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textMuted} />}
        </Pressable>
        {action && (
          <Pressable onPress={onAction} style={[styles.sectionAction, { backgroundColor: C.tint + '15', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="add" size={14} color={C.tint} />
            <Text style={[styles.sectionActionText, { color: C.tint }]}>{action}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

function FunTaskRow({ task, catName, catColor, timeStr, onToggle, C, isRTL }: any) {
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
      style={[animStyle, styles.taskRow, { backgroundColor: C.card, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      onPressIn={() => { scale.value = withSpring(0.98); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.taskAccent} />
      <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onToggle(); }} style={styles.taskCheck}>
        <View style={[styles.checkCircle, { borderColor: isCompleted ? C.success : C.border, backgroundColor: isCompleted ? C.success : 'transparent' }]}>
          {isCompleted && <Ionicons name="checkmark" size={11} color="#fff" />}
        </View>
      </Pressable>
      <View style={[styles.taskInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.taskTitle, { color: isCompleted ? C.textMuted : C.text, textAlign: isRTL ? 'right' : 'left' }, isCompleted && { textDecorationLine: 'line-through' as const }]} numberOfLines={1}>
          {task.title}
        </Text>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 6, alignItems: 'center', marginTop: 2 }}>
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
  const today = format(new Date(), 'yyyy-MM-dd');
  const lastDate = habit.last_completed_at ? format(new Date(habit.last_completed_at), 'yyyy-MM-dd') : null;
  const isDone = lastDate === today;

  return (
    <Pressable
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onComplete(habit.id); }}
      style={[styles.habitCard, { borderWidth: 1, borderColor: isDone ? habit.color : C.border }]}
    >
      <LinearGradient
        colors={isDone ? [habit.color, habit.color + 'CC'] : [C.card, C.card]}
        style={styles.habitCardInner}
      >
        <View style={styles.habitTopRow}>
          <View style={[styles.habitIconBox, { backgroundColor: isDone ? 'rgba(255,255,255,0.25)' : habit.color + '20' }]}>
            <Ionicons name={(habit.icon + '-outline') as any} size={22} color={isDone ? '#fff' : habit.color} />
          </View>
          {isDone && <Ionicons name="checkmark-circle" size={20} color="#FFD700" />}
        </View>
        <Text style={[styles.habitName, { color: isDone ? '#fff' : C.text }]} numberOfLines={2}>{habit.name}</Text>
        <View style={styles.streakRow}>
          <Ionicons name="flame" size={14} color={isDone ? '#FFD700' : C.streak} />
          <Text style={[styles.streakNum, { color: isDone ? '#FFD700' : C.streak }]}>{habit.streak_days}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function FunGoalCard({ goal, progress, gradient, C, isRTL }: any) {
  const pct = Math.round(progress * 100);

  return (
    <View style={[styles.goalCard, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md }}>
        <LinearGradient colors={gradient} style={styles.goalIcon}>
          <Ionicons name={((goal.icon ?? 'star') + '-outline') as any} size={18} color="#fff" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={[styles.goalTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>{goal.title}</Text>
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

const MOOD_ICONS: Record<Mood, { icon: string; color: string }> = {
  excellent:  { icon: 'happy',                  color: '#00C48C' },
  veryGood:   { icon: 'happy-outline',          color: '#4CAF82' },
  good:       { icon: 'thumbs-up-outline',      color: '#7C5CFC' },
  neutral:    { icon: 'remove-circle-outline',  color: '#FFB800' },
  tired:      { icon: 'bed-outline',            color: '#FF8A50' },
  stressed:   { icon: 'flash-outline',          color: '#FF6B35' },
  sad:        { icon: 'rainy-outline',          color: '#A855F7' },
  bad:        { icon: 'sad-outline',            color: '#FF4D6A' },
};

function JournalHomeCard({ entry, onWrite, onOpen, C, tFunc, isRTL }: { entry?: JournalEntry; onWrite: () => void; onOpen: () => void; C: any; tFunc: (k: string) => string; isRTL?: boolean }) {
  if (entry) {
    const moodCfg = entry.mood ? MOOD_ICONS[entry.mood] : null;
    return (
      <Pressable onPress={onOpen}>
        <View style={[styles.journalCard, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={[styles.journalCardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.journalIconBox, { backgroundColor: '#9B6EF5' + '18' }]}>
              <Ionicons name="book-outline" size={20} color="#9B6EF5" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.journalCardTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {entry.title || tFunc('todayEntry')}
              </Text>
              {moodCfg && (
                <View style={[styles.journalMoodBadge, { backgroundColor: moodCfg.color + '18', flexDirection: isRTL ? 'row-reverse' : 'row', alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
                  <Ionicons name={moodCfg.icon as any} size={12} color={moodCfg.color} />
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
    <Pressable onPress={onWrite}>
      <View style={[styles.journalCard, { backgroundColor: C.card, borderColor: C.border }]}>
        <View style={[styles.journalCardHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.journalIconBox, { backgroundColor: '#9B6EF5' + '18' }]}>
            <Ionicons name="book-outline" size={20} color="#9B6EF5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.journalCardTitle, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
              {tFunc('noEntryToday')}
            </Text>
          </View>
        </View>
        <Pressable onPress={onWrite} style={[styles.journalWriteBtn, { backgroundColor: '#9B6EF5' + '15', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Ionicons name="create-outline" size={16} color="#9B6EF5" />
          <Text style={[styles.journalWriteText, { color: '#9B6EF5' }]}>{tFunc('startWriting')}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function FunWeekChart({ weekDays, tasks, C, tFunc, lang }: any) {
  const maxVal = 8;
  const data = weekDays.map((d: Date) => {
    const key = formatDateKey(d);
    const count = tasks.filter((task: any) => task.due_date === key).length;
    const done = tasks.filter((task: any) => task.due_date === key && task.status === 'completed').length;
    return { day: getDayLabel(d, lang).slice(0, 1), count, done };
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
    paddingBottom: Spacing.xxxl + Spacing.md,
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
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.xxl,
    marginBottom: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroStat: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  heroStatIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  heroStatNum: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  heroStatLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', textAlign: 'center' },

  // Week strip
  weekCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    padding: Spacing.sm,
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
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
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
  habitCard: { width: 140, borderRadius: Radius.xl, overflow: 'hidden', shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
  habitCardInner: { padding: Spacing.md, gap: Spacing.sm, minHeight: 130 },
  habitTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  habitIconBox: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  habitName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', lineHeight: 19 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto' as any },
  streakNum: { fontSize: 14, fontFamily: 'Inter_700Bold' },

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

  // Journal card
  journalCard: {
    borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  journalCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  journalIconBox: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  journalCardTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  journalMoodBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2,
    alignSelf: 'flex-start', marginTop: 4,
  },
  journalMoodText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  journalPreview: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  journalWriteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderRadius: Radius.lg, paddingVertical: Spacing.sm + 2, marginTop: Spacing.xs,
  },
  journalWriteText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
