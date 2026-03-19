import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, addWeeks, subWeeks, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';

import * as Haptics from 'expo-haptics';

import { useTasksStore } from '../../src/store/tasksStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Spacing, Typography, Radius, Shadow, F, GRADIENT_H, GRADIENT_DARK_HEADER, GRADIENT_DARK_CARD, ColorScheme } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t, resolveDisplayName } from '../../src/utils/i18n';
import { formatTime, formatDateKey, getTodayString, formatDate } from '../../src/utils/date';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { TaskCard } from '../../src/components/ui/TaskCard';
import { SwipeableRow } from '../../src/components/ui/SwipeableRow';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import type { Task, Category, Language, StartOfWeek } from '../../src/types';
import { LinearGradient } from 'expo-linear-gradient';

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const AR_DAYS_SHORT = ['أح','إث','ثل','أر','خم','جم','سب'];
const AR_DAYS_FULL = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

function formatHeaderAr(date: Date, view: string, startDay: string) {
  if (view === 'month') return `${AR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  if (view === 'week') {
    const ws = startDay === 'sunday' ? 0 : 1;
    const s = startOfWeek(date, { weekStartsOn: ws as 0 | 1 });
    const e = endOfWeek(date, { weekStartsOn: ws as 0 | 1 });
    return `${s.getDate()} ${AR_MONTHS[s.getMonth()]} – ${e.getDate()} ${AR_MONTHS[e.getMonth()]}`;
  }
  return `${AR_DAYS_FULL[date.getDay()]}، ${date.getDate()} ${AR_MONTHS[date.getMonth()]}`;
}

type CalView = 'month' | 'week' | 'day';

export default function CalendarScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { tasks, toggleComplete, deleteTask, postponeTask } = useTasksStore();
  const { categories } = useCategoriesStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;

  const [view, setView] = useState<CalView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const tFunc = (key: string) => t(key, lang);

  const views = [
    { key: 'month', label: tFunc('month') },
    { key: 'week', label: tFunc('week') },
    { key: 'day', label: tFunc('day') },
  ];

  const taskDates = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => { if (t.due_date) set.add(t.due_date); });
    return set;
  }, [tasks]);

  const taskAllDoneDates = useMemo(() => {
    const set = new Set<string>();
    const byDate: Record<string, Task[]> = {};
    tasks.forEach(task => {
      if (task.due_date) {
        if (!byDate[task.due_date]) byDate[task.due_date] = [];
        byDate[task.due_date].push(task);
      }
    });
    Object.entries(byDate).forEach(([date, dayTasks]) => {
      if (dayTasks.length > 0 && dayTasks.every(task => task.status === 'completed')) {
        set.add(date);
      }
    });
    return set;
  }, [tasks]);

  const selectedTasks = useMemo(() =>
    tasks.filter(t => t.due_date === selectedDate),
    [tasks, selectedDate]
  );

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const navigate = (dir: 1 | -1) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (view === 'month') setCurrentDate(dir === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(dir === 1 ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    else setCurrentDate(new Date(currentDate.getTime() + dir * 86400000));
  };

  const isRTL = lang === 'ar';

  const headerLabel = useMemo(() => {
    if (isRTL) return formatHeaderAr(currentDate, view, profile.start_of_week);
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: profile.start_of_week === 'sunday' ? 0 : 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: profile.start_of_week === 'sunday' ? 0 : 1 });
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
    }
    return format(currentDate, 'EEEE, MMMM d');
  }, [currentDate, view, profile.start_of_week, isRTL]);

  const isNotCurrentPeriod = useMemo(() => {
    const todayStr = getTodayString();
    if (view === 'month') {
      return format(currentDate, 'yyyy-MM') !== format(new Date(), 'yyyy-MM');
    }
    if (view === 'week') {
      const ws = profile.start_of_week === 'sunday' ? 0 : 1;
      const weekStart = formatDateKey(startOfWeek(currentDate, { weekStartsOn: ws as 0 | 1 }));
      const weekEnd = formatDateKey(endOfWeek(currentDate, { weekStartsOn: ws as 0 | 1 }));
      return todayStr < weekStart || todayStr > weekEnd;
    }
    return formatDateKey(currentDate) !== todayStr;
  }, [currentDate, view, profile.start_of_week]);

  const jumpToToday = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentDate(new Date());
    setSelectedDate(getTodayString());
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header — Cyan/Blue gradient for distinct Calendar personality */}
      <LinearGradient
        colors={isDark ? [...GRADIENT_DARK_HEADER] : ['#06B6D4', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.md }, isDark && styles.headerDark]}
      >
        {!isDark && <View style={styles.headerDecor1} />}
        {!isDark && <View style={styles.headerDecor2} />}
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ width: 46 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.headerTitle, { color: '#fff' }]}>{tFunc('calendar')}</Text>
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setEditTask(null); setShowTaskForm(true); }}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('addTask')}
          >
            <View style={[styles.addBtnInner, isDark && { backgroundColor: C.surfaceElevated, borderColor: 'rgba(129,140,248,0.2)', borderWidth: 1 }]}>
              <Ionicons name="add" size={26} color={isDark ? C.tint : '#06B6D4'} />
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.segmentContainer}>
        <SegmentedControl
          options={views}
          selected={view}
          onSelect={(v) => setView(v as CalView)}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 100 }}>
        {/* Nav row */}
        <View style={[styles.navRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Pressable
            onPress={() => navigate(isRTL ? 1 : -1)}
            style={({ pressed }) => [styles.navBtn, { backgroundColor: C.tint + '12', opacity: pressed ? 0.6 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={isRTL ? tFunc('next') : tFunc('back')}
          >
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={20} color={C.tint} />
          </Pressable>

          <View style={styles.navCenter}>
            <Text style={[styles.navLabel, { color: C.text }]}>{headerLabel}</Text>
            {isNotCurrentPeriod && (
              <Pressable
                onPress={jumpToToday}
                style={({ pressed }) => [styles.todayChip, { backgroundColor: C.tint + '18', opacity: pressed ? 0.7 : 1 }]}
                accessibilityRole="button"
                accessibilityLabel={tFunc('today')}
              >
                <Ionicons name="today-outline" size={12} color={C.tint} />
                <Text style={[styles.todayChipText, { color: C.tint }]}>{tFunc('today')}</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => navigate(isRTL ? -1 : 1)}
            style={({ pressed }) => [styles.navBtn, { backgroundColor: C.tint + '12', opacity: pressed ? 0.6 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={isRTL ? tFunc('back') : tFunc('next')}
          >
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={C.tint} />
          </Pressable>
        </View>

        {/* Calendar */}
        {view === 'month' && (
          <MonthView
            date={currentDate}
            selectedDate={selectedDate}
            onSelectDate={(d: string) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedDate(d);
            }}
            taskDates={taskDates}
            taskAllDoneDates={taskAllDoneDates}
            startOfWeek={profile.start_of_week}
            lang={lang}
            C={C}
          />
        )}

        {view === 'week' && (
          <WeekView
            date={currentDate}
            selectedDate={selectedDate}
            onSelectDate={(d: string) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedDate(d);
            }}
            taskDates={taskDates}
            startOfWeek={profile.start_of_week}
            lang={lang}
            C={C}
          />
        )}

        {view === 'day' && (
          <DayView
            date={currentDate}
            tasks={tasks}
            categories={categories}
            C={C}
            tFunc={tFunc}
            isRTL={isRTL}
            lang={lang}
            onToggle={toggleComplete}
            onDelete={deleteTask}
            onPostpone={postponeTask}
            onEdit={(task) => { setEditTask(task); setShowTaskForm(true); }}
            timeFormat={profile.time_format}
          />
        )}

        {/* Selected date tasks */}
        {(view === 'month' || view === 'week') && (
          <View style={styles.tasksSection}>
            <View style={[styles.tasksSectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.tasksSectionLine, { backgroundColor: C.tint, alignSelf: isRTL ? 'flex-end' : 'flex-start' }]} />
              <Text style={[styles.selectedDateLabel, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {selectedDate === getTodayString() ? tFunc('today2') : formatDate(selectedDate, lang)}
              </Text>
              <View style={[styles.taskCountPill, { backgroundColor: C.tint + '15' }]}>
                <Text style={[styles.taskCount, { color: C.tint }]}>
                  {selectedTasks.length}
                </Text>
              </View>
            </View>
            {selectedTasks.length === 0 ? (
              <EmptyState
                icon="calendar-outline"
                title={tFunc('noTasksToday')}
                gradient={['#06B6D4', '#3B82F6']}
                actionLabel={tFunc('addTask')}
                onAction={() => { setEditTask(null); setShowTaskForm(true); }}
              />
            ) : (
              <View style={{ gap: Spacing.sm }}>
                {selectedTasks.map(task => {
                  const cat = categories.find(c => c.id === task.category_id);
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleComplete}
                      onDelete={deleteTask}
                      onPostpone={postponeTask}
                      onEdit={(t) => { setEditTask(t); setShowTaskForm(true); }}
                      priorityLabel={tFunc(task.priority)}
                      timeStr={task.due_time ? formatTime(task.due_time, profile.time_format === '12h') : undefined}
                      categoryName={cat?.name}
                      categoryColor={cat?.color}
                      t={tFunc}
                    />
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <TaskForm
        visible={showTaskForm}
        onClose={() => { setShowTaskForm(false); setEditTask(null); }}
        editTask={editTask}
        defaultDate={editTask ? undefined : selectedDate}
      />
    </View>
  );
}

interface CalendarViewProps {
  date: Date; selectedDate: string; onSelectDate: (d: string) => void;
  taskDates: Set<string>; taskAllDoneDates?: Set<string>; startOfWeek: StartOfWeek; lang: Language; C: ColorScheme;
}

function MonthView({ date, selectedDate, onSelectDate, taskDates, taskAllDoneDates, startOfWeek: startDay, lang, C }: CalendarViewProps) {
  const isRTL = lang === 'ar';
  const { scheme: monthScheme } = useAppTheme();
  const isMonthDark = monthScheme === 'dark';
  const weekStart = startDay === 'sunday' ? 0 : 1;

  const dayHeadersEn = startDay === 'sunday'
    ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const dayHeadersArBase = startDay === 'sunday'
    ? [AR_DAYS_SHORT[0], AR_DAYS_SHORT[1], AR_DAYS_SHORT[2], AR_DAYS_SHORT[3], AR_DAYS_SHORT[4], AR_DAYS_SHORT[5], AR_DAYS_SHORT[6]]
    : [AR_DAYS_SHORT[1], AR_DAYS_SHORT[2], AR_DAYS_SHORT[3], AR_DAYS_SHORT[4], AR_DAYS_SHORT[5], AR_DAYS_SHORT[6], AR_DAYS_SHORT[0]];

  const dayHeaders = isRTL ? [...dayHeadersArBase].reverse() : dayHeadersEn;

  const daysInMonth = getDaysInMonth(date);
  const firstDay = getDay(startOfMonth(date));
  const offset = (firstDay - weekStart + 7) % 7;
  const today = getTodayString();

  const ltrCells: (string | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(date.getFullYear(), date.getMonth(), i + 1);
      return formatDateKey(d);
    }),
  ];
  while (ltrCells.length % 7 !== 0) ltrCells.push(null);

  const rows: (string | null)[][] = [];
  for (let i = 0; i < ltrCells.length; i += 7) {
    const row = ltrCells.slice(i, i + 7);
    rows.push(isRTL ? [...row].reverse() : row);
  }
  const cells = rows.flat();

  return (
    <View style={[styles.calCard, { borderColor: C.border, overflow: 'hidden' }]}>
      {isMonthDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isMonthDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <View style={styles.dayHeadersRow}>
        {dayHeaders.map((d, idx) => (
          <Text key={`${d}-${idx}`} style={[styles.dayHeader, { color: C.tint }]}>{d}</Text>
        ))}
      </View>
      <View style={styles.calGrid}>
        {cells.map((dayKey, i) => {
          if (!dayKey) return <View key={`empty-${i}`} style={styles.calCell} />;
          const isToday = dayKey === today;
          const isSelected = dayKey === selectedDate;
          const hasTasks = taskDates.has(dayKey);
          const allDone = taskAllDoneDates?.has(dayKey) ?? false;
          const day = parseISO(dayKey).getDate();

          return (
            <Pressable
              key={dayKey}
              onPress={() => onSelectDate(dayKey)}
              style={({ pressed }) => [styles.calCell, { opacity: pressed ? 0.7 : 1 }]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={dayKey}
            >
              <View style={[
                styles.calDayCircle,
                isSelected && styles.calDayCircleSelected,
                isToday && !isSelected && { borderWidth: 2, borderColor: C.tint },
              ]}>
                {isSelected && (
                  <LinearGradient
                    colors={[...GRADIENT_H]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
                  />
                )}
                <Text style={[
                  styles.calDay,
                  { color: isSelected ? '#fff' : isToday ? C.tint : C.text },
                  isToday && !isSelected && { fontFamily: F.black },
                ]}>
                  {day}
                </Text>
              </View>
              {hasTasks && (
                allDone
                  ? <View style={[styles.calDotAllDone, { backgroundColor: isSelected ? '#fff' : C.tint }]} />
                  : <View style={[styles.calDot, { backgroundColor: isSelected ? '#fff' : C.tintSecondary }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function WeekView({ date, selectedDate, onSelectDate, taskDates, startOfWeek: startDay, lang, C }: CalendarViewProps) {
  const isRTL = lang === 'ar';
  const weekStart = startDay === 'sunday' ? 0 : 1;
  const start = startOfWeek(date, { weekStartsOn: weekStart });
  const end = endOfWeek(date, { weekStartsOn: weekStart });
  const ltrDays = eachDayOfInterval({ start, end });
  const days = isRTL ? [...ltrDays].reverse() : ltrDays;
  const today = getTodayString();
  const { scheme: weekScheme } = useAppTheme();
  const isWeekDark = weekScheme === 'dark';

  return (
    <View style={[styles.weekCard, { borderColor: C.border, overflow: 'hidden' }]}>
      {isWeekDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isWeekDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <View style={styles.weekViewRow}>
        {days.map(day => {
          const key = formatDateKey(day);
          const isSelected = key === selectedDate;
          const isToday = key === today;
          const hasTasks = taskDates.has(key);

          return (
            <Pressable
              key={key}
              onPress={() => onSelectDate(key)}
              style={({ pressed }) => [
                styles.weekCell,
                isSelected && styles.weekCellSelected,
                isToday && !isSelected && { borderWidth: 2, borderColor: C.tint },
                { opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={key}
            >
              {isSelected && (
                <LinearGradient
                  colors={[...GRADIENT_H]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: Radius.md }]}
                />
              )}
              <Text style={[styles.weekDayLabel, { color: isSelected ? 'rgba(255,255,255,0.8)' : C.textMuted }]}>
                {isRTL ? AR_DAYS_SHORT[day.getDay()] : format(day, 'EEE').slice(0, 2)}
              </Text>
              <Text style={[styles.weekDayNum, { color: isSelected ? '#fff' : isToday ? C.tint : C.text }, isToday && !isSelected && { fontFamily: F.black }]}>
                {format(day, 'd')}
              </Text>
              {hasTasks && (
                <View style={[styles.weekDot, { backgroundColor: isSelected ? '#fff' : C.tintSecondary }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface DayViewProps {
  date: Date;
  tasks: Task[];
  categories: Category[];
  C: ColorScheme;
  tFunc: (k: string) => string;
  isRTL: boolean;
  lang: Language;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPostpone: (id: string) => void;
  onEdit: (task: Task) => void;
  timeFormat: string;
}

function DayView({ date, tasks, categories, C, tFunc, isRTL, lang, onToggle, onDelete, onPostpone, onEdit, timeFormat }: DayViewProps) {
  const key = formatDateKey(date);
  const dayTasks = tasks.filter((t) => t.due_date === key);

  return (
    <View style={styles.dayViewContainer}>
      {dayTasks.length === 0 ? (
        <EmptyState icon="calendar-outline" title={tFunc('noTasksThisDay')} gradient={['#06B6D4', '#3B82F6']} />
      ) : (
        <View style={{ gap: Spacing.sm }}>
          {dayTasks.map((task) => {
            const cat = categories.find((c) => c.id === task.category_id);
            return (
              <SwipeableRow
                key={task.id}
                isRTL={isRTL}
                onComplete={() => onPostpone(task.id)}
                onDelete={() => onDelete(task.id)}
                completeLabel={tFunc('postpone')}
                deleteLabel={tFunc('delete')}
                completeIcon="time-outline"
                completeColor="#8B5CF6"
                completeHaptic="light"
              >
                <TaskCard
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onPostpone={onPostpone}
                  onEdit={onEdit}
                  onPress={onEdit}
                  priorityLabel={tFunc(task.priority)}
                  timeStr={task.due_time ? formatTime(task.due_time, timeFormat === '12h') : undefined}
                  categoryName={cat ? resolveDisplayName(cat.name_ar, cat.name_en, lang, cat.name) : undefined}
                  categoryColor={cat?.color}
                  t={tFunc}
                />
              </SwipeableRow>
            );
          })}
        </View>
      )}
    </View>
  );
}

const DAY_CIRCLE_SIZE = 40;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor1: {
    position: 'absolute', right: -40, top: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  headerDecor2: {
    position: 'absolute', left: 20, bottom: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerRow: { alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 30, fontFamily: F.black, textAlign: 'center' },
  headerDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(129,140,248,0.08)',
  },
  addBtn: {},
  addBtnInner: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
  segmentContainer: { paddingHorizontal: Spacing.lg, marginTop: Spacing.md, marginBottom: Spacing.sm },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  navBtn: {
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  navLabel: { ...Typography.subtitle, fontFamily: F.bold },
  todayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  todayChipText: {
    fontSize: 11,
    fontFamily: F.bold,
  },

  calCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
    ...Shadow.sm,
  },
  dayHeadersRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 13, fontFamily: F.black },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
  },
  calDayCircle: {
    width: DAY_CIRCLE_SIZE,
    height: DAY_CIRCLE_SIZE,
    borderRadius: DAY_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  calDayCircleSelected: {
    overflow: 'hidden',
  },
  calDay: { fontSize: 15, fontFamily: F.bold },
  calDot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
  calDotAllDone: { width: 7, height: 7, borderRadius: 4, marginTop: 2 },

  weekCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.sm,
    ...Shadow.sm,
  },
  weekViewRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  weekCell: {
    flex: 1,
    borderRadius: Radius.md,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 4,
    overflow: 'hidden',
  },
  weekCellSelected: {
    overflow: 'hidden',
  },
  weekDayLabel: { fontSize: 12, fontFamily: F.bold },
  weekDayNum: { fontSize: 18, fontFamily: F.black },
  weekDot: { width: 5, height: 5, borderRadius: 3, marginTop: 1 },

  tasksSection: { paddingHorizontal: Spacing.lg, gap: Spacing.md, marginTop: Spacing.xxl },
  tasksSectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm,
  },
  tasksSectionLine: { width: 4, height: 20, borderRadius: 2 },
  selectedDateLabel: { fontSize: 17, fontFamily: F.black, flex: 1 },
  taskCountPill: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  taskCount: { fontSize: 13, fontFamily: F.black },

  dayViewContainer: { padding: Spacing.lg, gap: Spacing.sm },
});
