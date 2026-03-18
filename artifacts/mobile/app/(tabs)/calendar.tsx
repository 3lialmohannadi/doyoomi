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
import { Spacing, Typography, Radius, Shadow, F, PRIMARY, SECONDARY, GRADIENT_H, cardShadow, ColorScheme } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t, resolveDisplayName } from '../../src/utils/i18n';
import { formatTime, formatDateKey, getTodayString, formatDate } from '../../src/utils/date';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { TaskCard } from '../../src/components/ui/TaskCard';
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
  const { C } = useAppTheme();
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

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[...GRADIENT_H]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.md }]}
      >
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ width: 46 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>{tFunc('calendar')}</Text>
            <Text style={styles.headerSub}>{headerLabel}</Text>
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setEditTask(null); setShowTaskForm(true); }}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('addTask')}
          >
            <View style={styles.addBtnInner}>
              <Ionicons name="add" size={26} color={PRIMARY} />
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
            style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={isRTL ? tFunc('next') : tFunc('back')}
          >
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={20} color={C.tint} />
          </Pressable>
          <Text style={[styles.navLabel, { color: C.text }]}>{headerLabel}</Text>
          <Pressable
            onPress={() => navigate(isRTL ? -1 : 1)}
            style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
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
          <DayView date={currentDate} tasks={tasks} categories={categories} C={C} tFunc={tFunc} isRTL={isRTL} />
        )}

        {/* Selected date tasks */}
        {(view === 'month' || view === 'week') && (
          <View style={styles.tasksSection}>
            <View style={[styles.tasksSectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.selectedDateLabel, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>
                {selectedDate === getTodayString() ? tFunc('today2') : formatDate(selectedDate, lang)}
              </Text>
              <Text style={[styles.taskCount, { color: C.textMuted }]}>
                {selectedTasks.length} {tFunc('taskCount')}
              </Text>
            </View>
            {selectedTasks.length === 0 ? (
              <EmptyState icon="calendar-outline" title={tFunc('noTasksToday')} />
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
      />
    </View>
  );
}

interface CalendarViewProps {
  date: Date; selectedDate: string; onSelectDate: (d: string) => void;
  taskDates: Set<string>; startOfWeek: StartOfWeek; lang: Language; C: ColorScheme;
}

function MonthView({ date, selectedDate, onSelectDate, taskDates, startOfWeek: startDay, lang, C }: CalendarViewProps) {
  const isRTL = lang === 'ar';
  const weekStart = startDay === 'sunday' ? 0 : 1;

  const dayHeadersEn = startDay === 'sunday'
    ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const dayHeadersArBase = startDay === 'sunday'
    ? [AR_DAYS_SHORT[0], AR_DAYS_SHORT[1], AR_DAYS_SHORT[2], AR_DAYS_SHORT[3], AR_DAYS_SHORT[4], AR_DAYS_SHORT[5], AR_DAYS_SHORT[6]]
    : [AR_DAYS_SHORT[1], AR_DAYS_SHORT[2], AR_DAYS_SHORT[3], AR_DAYS_SHORT[4], AR_DAYS_SHORT[5], AR_DAYS_SHORT[6], AR_DAYS_SHORT[0]];

  // In RTL: reverse headers so Sunday appears on the right
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

  // Build rows; in RTL reverse each row so the grid reads right-to-left
  const rows: (string | null)[][] = [];
  for (let i = 0; i < ltrCells.length; i += 7) {
    const row = ltrCells.slice(i, i + 7);
    rows.push(isRTL ? [...row].reverse() : row);
  }
  const cells = rows.flat();

  return (
    <View style={[styles.calCard, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={styles.dayHeadersRow}>
        {dayHeaders.map((d, idx) => (
          <Text key={`${d}-${idx}`} style={[styles.dayHeader, { color: C.textMuted }]}>{d}</Text>
        ))}
      </View>
      <View style={styles.calGrid}>
        {cells.map((dayKey, i) => {
          if (!dayKey) return <View key={`empty-${i}`} style={styles.calCell} />;
          const isToday = dayKey === today;
          const isSelected = dayKey === selectedDate;
          const hasTasks = taskDates.has(dayKey);
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
                isToday && !isSelected && { borderWidth: 1.5, borderColor: C.tint },
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
                  isToday && !isSelected && { fontFamily: F.bold },
                ]}>
                  {day}
                </Text>
              </View>
              {hasTasks && (
                <View style={[styles.calDot, { backgroundColor: C.tint }]} />
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
  // In RTL: reverse so Sunday appears on the right
  const days = isRTL ? [...ltrDays].reverse() : ltrDays;
  const today = getTodayString();

  return (
    <View style={[styles.weekCard, { backgroundColor: C.card, borderColor: C.border }]}>
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
                isToday && !isSelected && { borderWidth: 1.5, borderColor: C.tint },
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
              <Text style={[styles.weekDayNum, { color: isSelected ? '#fff' : isToday ? C.tint : C.text }]}>
                {format(day, 'd')}
              </Text>
              {hasTasks && (
                <View style={[styles.weekDot, { backgroundColor: isSelected ? '#fff' : C.tint }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

interface DayViewProps {
  date: Date; tasks: Task[]; categories: Category[]; C: ColorScheme; tFunc: (k: string) => string; isRTL: boolean;
}

function DayView({ date, tasks, categories, C, tFunc, isRTL }: DayViewProps) {
  const key = formatDateKey(date);
  const dayTasks = tasks.filter((t) => t.due_date === key);

  return (
    <View style={styles.dayViewContainer}>
      {dayTasks.length === 0 ? (
        <EmptyState icon="calendar-outline" title={tFunc('noTasksThisDay')} />
      ) : (
        dayTasks.map((task) => {
          const cat = categories.find((c) => c.id === task.category_id);
          const accentColor = task.priority === 'high' ? C.priorityHigh : task.priority === 'medium' ? C.priorityMedium : C.priorityLow;
          return (
            <View key={task.id} style={[styles.dayTaskCard, { backgroundColor: C.card, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.dayTaskAccent, { backgroundColor: accentColor }]} />
              <View style={[styles.dayTaskContent, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.dayTaskTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{resolveDisplayName(task.title_ar, task.title_en, lang, task.title)}</Text>
                {task.due_time && <Text style={[styles.dayTaskTime, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>{task.due_time}</Text>}
                {cat && (
                  <View style={[styles.dayTaskCat, { backgroundColor: cat.color + '20', alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.dayTaskCatText, { color: cat.color }]}>{resolveDisplayName(cat.name_ar, cat.name_en, lang, cat.name)}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const DAY_CIRCLE_SIZE = 38;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor1: {
    position: 'absolute', right: -30, top: -30,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerDecor2: {
    position: 'absolute', left: 20, bottom: -10,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerRow: { alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 28, fontFamily: F.bold, color: '#fff', textAlign: 'center' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: F.med, marginTop: 2, textAlign: 'center' },
  addBtn: {},
  addBtnInner: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
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
  navBtn: { padding: Spacing.sm },
  navLabel: { ...Typography.subtitle, fontFamily: F.med },

  // Month calendar card
  calCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
    ...Shadow.sm,
  },
  dayHeadersRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 13, fontFamily: F.med },
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
  calDay: { fontSize: 15, fontFamily: F.med },
  calDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },

  // Week view
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
  weekDayLabel: { fontSize: 12, fontFamily: F.med },
  weekDayNum: { fontSize: 18, fontFamily: F.bold },
  weekDot: { width: 4, height: 4, borderRadius: 2, marginTop: 1 },

  // Tasks section
  tasksSection: { paddingHorizontal: Spacing.lg, gap: Spacing.md, marginTop: Spacing.xxl },
  tasksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  selectedDateLabel: { fontSize: 19, fontFamily: F.bold },
  taskCount: { fontSize: 14, fontFamily: F.med },

  // Day view
  dayViewContainer: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginTop: Spacing.sm },
  dayTaskCard: {
    flexDirection: 'row', borderRadius: Radius.lg, borderWidth: 1,
    overflow: 'hidden', ...Shadow.sm,
  },
  dayTaskAccent: { width: 4, alignSelf: 'stretch' },
  dayTaskContent: { flex: 1, padding: Spacing.md, gap: 4 },
  dayTaskTitle: { fontSize: 17, fontFamily: F.med },
  dayTaskTime: { fontSize: 14, fontFamily: F.reg },
  dayTaskCat: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 2 },
  dayTaskCatText: { fontSize: 11, fontFamily: F.med },
});
