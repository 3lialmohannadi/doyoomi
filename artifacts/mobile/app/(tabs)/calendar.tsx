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
import { Spacing, Typography, Radius, Shadow } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { formatTime, formatDateKey, getTodayString } from '../../src/utils/date';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { AddButton } from '../../src/components/ui/AddButton';
import { TaskCard } from '../../src/components/ui/TaskCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { Task } from '../../src/types';
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
      <View style={[styles.header, { paddingTop: topPad + Spacing.sm, backgroundColor: C.background }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>{tFunc('calendar')}</Text>
        <AddButton onPress={() => { setEditTask(null); setShowTaskForm(true); }} size={40} />
      </View>

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
          <Pressable onPress={() => navigate(isRTL ? 1 : -1)} style={styles.navBtn}>
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={20} color={C.tint} />
          </Pressable>
          <Text style={[styles.navLabel, { color: C.text }]}>{headerLabel}</Text>
          <Pressable onPress={() => navigate(isRTL ? -1 : 1)} style={styles.navBtn}>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={C.tint} />
          </Pressable>
        </View>

        {/* Calendar */}
        {view === 'month' && (
          <MonthView
            date={currentDate}
            selectedDate={selectedDate}
            onSelectDate={(d) => {
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
            onSelectDate={(d) => {
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
          <DayView date={currentDate} tasks={tasks} categories={categories} C={C} tFunc={tFunc} />
        )}

        {/* Selected date tasks */}
        {(view === 'month' || view === 'week') && (
          <View style={styles.tasksSection}>
            <View style={styles.tasksSectionHeader}>
              <Text style={[styles.selectedDateLabel, { color: C.text }]}>
                {selectedDate === getTodayString() ? tFunc('today2') : format(parseISO(selectedDate), 'MMMM d, yyyy')}
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

function MonthView({ date, selectedDate, onSelectDate, taskDates, startOfWeek: startDay, lang, C }: any) {
  const isRTL = lang === 'ar';
  const weekStart = startDay === 'sunday' ? 0 : 1;

  const dayHeadersEn = startDay === 'sunday'
    ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const dayHeadersAr = startDay === 'sunday'
    ? [AR_DAYS_SHORT[0], AR_DAYS_SHORT[1], AR_DAYS_SHORT[2], AR_DAYS_SHORT[3], AR_DAYS_SHORT[4], AR_DAYS_SHORT[5], AR_DAYS_SHORT[6]]
    : [AR_DAYS_SHORT[1], AR_DAYS_SHORT[2], AR_DAYS_SHORT[3], AR_DAYS_SHORT[4], AR_DAYS_SHORT[5], AR_DAYS_SHORT[6], AR_DAYS_SHORT[0]];
  const dayHeaders = isRTL ? dayHeadersAr : dayHeadersEn;

  const daysInMonth = getDaysInMonth(date);
  const firstDay = getDay(startOfMonth(date));
  const offset = (firstDay - weekStart + 7) % 7;
  const today = getTodayString();

  const cells: (string | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(date.getFullYear(), date.getMonth(), i + 1);
      return formatDateKey(d);
    }),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={[styles.calCard, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={styles.dayHeadersRow}>
        {dayHeaders.map(d => (
          <Text key={d} style={[styles.dayHeader, { color: C.textMuted }]}>{d}</Text>
        ))}
      </View>
      <View style={styles.calGrid}>
        {cells.map((dayKey, i) => {
          if (!dayKey) return <View key={i} style={styles.calCell} />;
          const isToday = dayKey === today;
          const isSelected = dayKey === selectedDate;
          const hasTasks = taskDates.has(dayKey);
          const day = parseISO(dayKey).getDate();

          return (
            <Pressable key={dayKey} onPress={() => onSelectDate(dayKey)} style={styles.calCell}>
              <View style={[
                styles.calDayCircle,
                isSelected && styles.calDayCircleSelected,
                isToday && !isSelected && { borderWidth: 1.5, borderColor: C.tint },
              ]}>
                {isSelected && (
                  <LinearGradient
                    colors={['#7C5CFC', '#FF6B9D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
                  />
                )}
                <Text style={[
                  styles.calDay,
                  { color: isSelected ? '#fff' : isToday ? C.tint : C.text },
                  isToday && !isSelected && { fontFamily: 'Inter_700Bold' },
                ]}>
                  {day}
                </Text>
              </View>
              {hasTasks && (
                <View style={[styles.calDot, { backgroundColor: isSelected ? C.tint : C.tint }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function WeekView({ date, selectedDate, onSelectDate, taskDates, startOfWeek: startDay, lang, C }: any) {
  const isRTL = lang === 'ar';
  const weekStart = startDay === 'sunday' ? 0 : 1;
  const start = startOfWeek(date, { weekStartsOn: weekStart });
  const end = endOfWeek(date, { weekStartsOn: weekStart });
  const days = eachDayOfInterval({ start, end });
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
              style={[
                styles.weekCell,
                isSelected && styles.weekCellSelected,
                isToday && !isSelected && { borderWidth: 1.5, borderColor: C.tint },
              ]}
            >
              {isSelected && (
                <LinearGradient
                  colors={['#7C5CFC', '#FF6B9D']}
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

function DayView({ date, tasks, categories, C, tFunc }: any) {
  const key = formatDateKey(date);
  const dayTasks = tasks.filter((t: any) => t.due_date === key);

  return (
    <View style={styles.dayViewContainer}>
      {dayTasks.length === 0 ? (
        <EmptyState icon="calendar-outline" title={tFunc('noTasksThisDay')} />
      ) : (
        dayTasks.map((task: any) => {
          const cat = categories.find((c: any) => c.id === task.category_id);
          const accentColor = task.priority === 'high' ? C.priorityHigh : task.priority === 'medium' ? C.priorityMedium : C.priorityLow;
          return (
            <View key={task.id} style={[styles.dayTaskCard, { backgroundColor: C.card, borderColor: C.border }]}>
              <View style={[styles.dayTaskAccent, { backgroundColor: accentColor }]} />
              <View style={styles.dayTaskContent}>
                <Text style={[styles.dayTaskTitle, { color: C.text }]}>{task.title}</Text>
                {task.due_time && <Text style={[styles.dayTaskTime, { color: C.textMuted }]}>{task.due_time}</Text>}
                {cat && (
                  <View style={[styles.dayTaskCat, { backgroundColor: cat.color + '20' }]}>
                    <Text style={[styles.dayTaskCatText, { color: cat.color }]}>{cat.name}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerTitle: { ...Typography.heading2 },
  segmentContainer: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  navBtn: { padding: Spacing.sm },
  navLabel: { ...Typography.subtitle, fontFamily: 'Inter_600SemiBold' },

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
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
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
  calDay: { fontSize: 15, fontFamily: 'Inter_500Medium' },
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
  weekDayLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  weekDayNum: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  weekDot: { width: 4, height: 4, borderRadius: 2, marginTop: 1 },

  // Tasks section
  tasksSection: { paddingHorizontal: Spacing.lg, gap: Spacing.md, marginTop: Spacing.xxl },
  tasksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  selectedDateLabel: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  taskCount: { fontSize: 14, fontFamily: 'Inter_500Medium' },

  // Day view
  dayViewContainer: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginTop: Spacing.sm },
  dayTaskCard: {
    flexDirection: 'row', borderRadius: Radius.lg, borderWidth: 1,
    overflow: 'hidden', ...Shadow.sm,
  },
  dayTaskAccent: { width: 4, alignSelf: 'stretch' },
  dayTaskContent: { flex: 1, padding: Spacing.md, gap: 4 },
  dayTaskTitle: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  dayTaskTime: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  dayTaskCat: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 2 },
  dayTaskCatText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
});
