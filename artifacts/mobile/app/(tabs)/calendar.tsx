import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, addWeeks, subWeeks, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { useTasksStore } from '../../src/store/tasksStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { formatTime, formatDateKey, getTodayString, isOverdue as checkOverdue } from '../../src/utils/date';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { AddButton } from '../../src/components/ui/AddButton';
import { TaskCard } from '../../src/components/ui/TaskCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { Task } from '../../src/types';
import { LinearGradient } from 'expo-linear-gradient';

type CalView = 'month' | 'week' | 'day';

export default function CalendarScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { tasks, toggleComplete, deleteTask, postponeTask, updateTask } = useTasksStore();
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

  const headerLabel = useMemo(() => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: profile.start_of_week === 'sunday' ? 0 : 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: profile.start_of_week === 'sunday' ? 0 : 1 });
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
    }
    return format(currentDate, 'EEEE, MMMM d');
  }, [currentDate, view, profile.start_of_week]);

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
        <View style={styles.navRow}>
          <Pressable onPress={() => navigate(-1)} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={C.tint} />
          </Pressable>
          <Text style={[styles.navLabel, { color: C.text }]}>{headerLabel}</Text>
          <Pressable onPress={() => navigate(1)} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={20} color={C.tint} />
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
            C={C}
          />
        )}

        {view === 'day' && (
          <DayView date={currentDate} tasks={tasks} categories={categories} C={C} />
        )}

        {/* Selected date tasks */}
        {(view === 'month' || view === 'week') && (
          <View style={styles.tasksSection}>
            <Text style={[styles.selectedDateLabel, { color: C.textSecondary }]}>
              {selectedDate === getTodayString() ? tFunc('today2') : format(new Date(selectedDate), 'MMMM d, yyyy')}
            </Text>
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

function MonthView({ date, selectedDate, onSelectDate, taskDates, startOfWeek: startDay, C }: any) {
  const weekStart = startDay === 'sunday' ? 0 : 1;
  const dayHeaders = startDay === 'sunday'
    ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

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
    <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
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
          const day = new Date(dayKey).getDate();

          return (
            <Pressable key={dayKey} onPress={() => onSelectDate(dayKey)} style={[styles.calCell, { overflow: 'hidden' }]}>
              {isSelected && (
                <LinearGradient
                  colors={['#6C8EF5', '#F0A4C8']}
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
              {hasTasks && !isSelected && (
                <View style={[styles.calDot, { backgroundColor: C.tint }]} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function WeekView({ date, selectedDate, onSelectDate, taskDates, startOfWeek: startDay, C }: any) {
  const weekStart = startDay === 'sunday' ? 0 : 1;
  const start = startOfWeek(date, { weekStartsOn: weekStart });
  const end = endOfWeek(date, { weekStartsOn: weekStart });
  const days = eachDayOfInterval({ start, end });
  const today = getTodayString();

  return (
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
            style={[styles.weekCell, { overflow: 'hidden' }]}
          >
            {isSelected && (
              <LinearGradient
                colors={['#6C8EF5', '#F0A4C8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: Radius.lg }]}
              />
            )}
            <Text style={[styles.weekDayLabel, { color: isSelected ? 'rgba(255,255,255,0.8)' : C.textMuted }]}>
              {format(day, 'EEE').slice(0, 2)}
            </Text>
            <Text style={[styles.weekDayNum, { color: isSelected ? '#fff' : isToday ? C.tint : C.text }]}>
              {format(day, 'd')}
            </Text>
            {hasTasks && !isSelected && (
              <View style={[styles.calDot, { backgroundColor: C.tint }]} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

function DayView({ date, tasks, categories, C }: any) {
  const key = formatDateKey(date);
  const dayTasks = tasks.filter((t: any) => t.due_date === key);

  return (
    <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}>
      {dayTasks.length === 0 ? (
        <EmptyState icon="calendar-outline" title="No tasks this day" />
      ) : (
        dayTasks.map((task: any) => {
          const cat = categories.find((c: any) => c.id === task.category_id);
          const accentColor = task.priority === 'high' ? C.priorityHigh : task.priority === 'medium' ? C.priorityMedium : C.priorityLow;
          return (
            <View key={task.id} style={[{ backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: Radius.lg, flexDirection: 'row', overflow: 'hidden', ...Shadow.sm }]}>
              <View style={{ width: 3, backgroundColor: accentColor }} />
              <View style={{ flex: 1, padding: Spacing.md }}>
                <Text style={{ ...Typography.bodyMedium, color: C.text, fontFamily: 'Inter_500Medium' }}>{task.title}</Text>
                {task.due_time && <Text style={{ ...Typography.caption, color: C.textMuted, marginTop: 2 }}>{task.due_time}</Text>}
                {cat && <Text style={{ ...Typography.label, color: cat.color, marginTop: 4 }}>{cat.name}</Text>}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: { ...Typography.heading2 },
  segmentContainer: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  navBtn: { padding: Spacing.sm },
  navLabel: { ...Typography.subtitle, fontFamily: 'Inter_600SemiBold' },
  dayHeadersRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  dayHeader: { flex: 1, textAlign: 'center', ...Typography.label, fontFamily: 'Inter_500Medium' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calDay: { ...Typography.caption, fontFamily: 'Inter_500Medium' },
  calDot: { width: 4, height: 4, borderRadius: 2, position: 'absolute', bottom: 4 },
  weekViewRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  weekCell: {
    flex: 1,
    borderRadius: Radius.lg,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  weekDayLabel: { ...Typography.label },
  weekDayNum: { ...Typography.subtitle, fontFamily: 'Inter_600SemiBold' },
  tasksSection: { paddingHorizontal: Spacing.lg, gap: Spacing.md, marginTop: Spacing.md },
  selectedDateLabel: { ...Typography.captionMedium, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
});
