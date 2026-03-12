import React, { useState, useEffect, useMemo } from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  format, parseISO, startOfMonth, getDaysInMonth, getDay,
  addMonths, subMonths,
} from 'date-fns';
import * as Haptics from 'expo-haptics';
import {
  FormModal, FormField, FormInput, FormPressableInput,
  PrioritySelector, CategorySelector,
} from '../../components/ui/FormModal';
import { Task, Priority, TaskStatus } from '../../types';
import { useTasksStore } from '../../store/tasksStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t } from '../../utils/i18n';
import { getTodayString, formatDateKey } from '../../utils/date';
import { Radius, Spacing } from '../../theme';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

export function TaskForm({ visible, onClose, editTask }: TaskFormProps) {
  const { addTask, updateTask } = useTasksStore();
  const { categories } = useCategoriesStore();
  const { profile } = useSettingsStore();
  const { C } = useAppTheme();
  const lang = profile.language;
  const is12h = profile.time_format === '12h';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [categoryId, setCategoryId] = useState('');
  const [titleError, setTitleError] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    setTitleError(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description ?? '');
      setDueDate(editTask.due_date ?? getTodayString());
      setDueTime(editTask.due_time ?? '');
      setPriority(editTask.priority);
      setStatus(editTask.status);
      setCategoryId(editTask.category_id ?? '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(getTodayString());
      setDueTime('');
      setPriority('medium');
      setStatus('pending');
      setCategoryId('');
    }
  }, [editTask, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
      due_time: dueTime || undefined,
      priority,
      status,
      category_id: categoryId || undefined,
      is_all_day: !dueTime,
    };

    if (editTask) {
      updateTask(editTask.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const priorityOptions = [
    { key: 'low', label: t('low', lang) },
    { key: 'medium', label: t('medium', lang) },
    { key: 'high', label: t('high', lang) },
  ];

  const catOptions = [
    { key: '', label: t('none', lang), color: undefined, icon: undefined },
    ...categories.map(c => ({ key: c.id, label: c.name, color: c.color, icon: c.icon })),
  ];

  const displayDate = dueDate
    ? format(parseISO(dueDate), 'MMM d, yyyy')
    : '';

  const displayTime = dueTime
    ? is12h
      ? format(new Date(2000, 0, 1, parseInt(dueTime.split(':')[0]), parseInt(dueTime.split(':')[1])), 'h:mm a')
      : dueTime
    : '';

  return (
    <FormModal
      visible={visible}
      title={editTask ? t('editTask', lang) : t('addTask', lang)}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={t('save', lang)}
      cancelLabel={t('cancel', lang)}
    >
      <FormField label={t('title', lang)}>
        <FormInput
          value={title}
          onChangeText={(v) => { setTitle(v); if (v.trim()) setTitleError(false); }}
          placeholder={t('taskTitlePlaceholder', lang)}
          error={titleError}
        />
      </FormField>

      <FormField label={t('description', lang)}>
        <FormInput
          value={description}
          onChangeText={setDescription}
          placeholder={t('descriptionPlaceholder', lang)}
          multiline
        />
      </FormField>

      <FormField label={t('date', lang)}>
        <FormPressableInput
          value={displayDate}
          placeholder={t('datePlaceholder', lang)}
          icon="calendar-outline"
          onPress={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
        />
        {showDatePicker && (
          <InlineCalendar
            selected={dueDate}
            onSelect={(d) => { setDueDate(d); setShowDatePicker(false); }}
            C={C}
            startOfWeek={profile.start_of_week}
          />
        )}
      </FormField>

      <FormField label={t('time', lang)}>
        <FormPressableInput
          value={displayTime}
          placeholder={t('timePlaceholder', lang)}
          icon="time-outline"
          onPress={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
        />
        {showTimePicker && (
          <InlineTimePicker
            value={dueTime}
            onChange={(t) => setDueTime(t)}
            is12h={is12h}
            C={C}
            onDone={() => setShowTimePicker(false)}
          />
        )}
      </FormField>

      <FormField label={t('priority', lang)}>
        <PrioritySelector
          options={priorityOptions}
          value={priority}
          onChange={(v) => setPriority(v as Priority)}
        />
      </FormField>

      <FormField label={t('category', lang)}>
        <CategorySelector
          options={catOptions}
          value={categoryId}
          onChange={setCategoryId}
        />
      </FormField>
    </FormModal>
  );
}

// ── Pure JS Inline Calendar ──
function InlineCalendar({ selected, onSelect, C, startOfWeek: startDay }: any) {
  const [viewDate, setViewDate] = useState(() => selected ? parseISO(selected) : new Date());

  const weekStart = startDay === 'sunday' ? 0 : 1;
  const dayHeaders = startDay === 'sunday'
    ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getDay(startOfMonth(viewDate));
  const offset = (firstDay - weekStart + 7) % 7;
  const today = getTodayString();

  const cells: (string | null)[] = useMemo(() => {
    const c: (string | null)[] = [
      ...Array(offset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1);
        return formatDateKey(d);
      }),
    ];
    while (c.length % 7 !== 0) c.push(null);
    return c;
  }, [viewDate, offset, daysInMonth]);

  return (
    <View style={[calStyles.container, { backgroundColor: C.card, borderColor: C.border }]}>
      {/* Nav */}
      <View style={calStyles.nav}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(subMonths(viewDate, 1)); }}>
          <Ionicons name="chevron-back" size={20} color={C.tint} />
        </Pressable>
        <Text style={[calStyles.navLabel, { color: C.text }]}>{format(viewDate, 'MMMM yyyy')}</Text>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(addMonths(viewDate, 1)); }}>
          <Ionicons name="chevron-forward" size={20} color={C.tint} />
        </Pressable>
      </View>

      {/* Day headers */}
      <View style={calStyles.headerRow}>
        {dayHeaders.map(d => (
          <Text key={d} style={[calStyles.headerDay, { color: C.textMuted }]}>{d}</Text>
        ))}
      </View>

      {/* Grid */}
      <View style={calStyles.grid}>
        {cells.map((dayKey, i) => {
          if (!dayKey) return <View key={i} style={calStyles.cell} />;
          const isSelected = dayKey === selected;
          const isToday = dayKey === today;
          const day = parseISO(dayKey).getDate();

          return (
            <Pressable
              key={dayKey}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSelect(dayKey); }}
              style={[calStyles.cell, { overflow: 'hidden' }]}
            >
              {isSelected && (
                <LinearGradient
                  colors={['#7C5CFC', '#FF6B9D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
                />
              )}
              <Text style={[
                calStyles.dayText,
                { color: isSelected ? '#fff' : isToday ? C.tint : C.text },
                isToday && !isSelected && { fontFamily: 'Inter_700Bold' },
              ]}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const calStyles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  navLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  headerRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  headerDay: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
});

// ── Pure JS Time Picker ──
function InlineTimePicker({ value, onChange, is12h, C, onDone }: any) {
  const currentHour = value ? parseInt(value.split(':')[0]) : new Date().getHours();
  const currentMin = value ? parseInt(value.split(':')[1]) : 0;

  const [hour, setHour] = useState(currentHour);
  const [minute, setMinute] = useState(currentMin);

  useEffect(() => {
    const hh = hour.toString().padStart(2, '0');
    const mm = minute.toString().padStart(2, '0');
    onChange(`${hh}:${mm}`);
  }, [hour, minute]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const formatHour = (h: number) => {
    if (!is12h) return h.toString().padStart(2, '0');
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12} ${period}`;
  };

  return (
    <View style={[timeStyles.container, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={timeStyles.row}>
        {/* Hour picker */}
        <View style={timeStyles.col}>
          <Text style={[timeStyles.label, { color: C.textMuted }]}>
            {is12h ? 'Hour' : 'Hour'}
          </Text>
          <ScrollView style={timeStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {hours.map(h => (
              <Pressable
                key={h}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setHour(h); }}
                style={[timeStyles.option, hour === h && { backgroundColor: C.tint + '20' }]}
              >
                <Text style={[timeStyles.optionText, { color: hour === h ? C.tint : C.text, fontFamily: hour === h ? 'Inter_700Bold' : 'Inter_400Regular' }]}>
                  {formatHour(h)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Text style={[timeStyles.colon, { color: C.text }]}>:</Text>

        {/* Minute picker */}
        <View style={timeStyles.col}>
          <Text style={[timeStyles.label, { color: C.textMuted }]}>
            Min
          </Text>
          <ScrollView style={timeStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {minutes.map(m => (
              <Pressable
                key={m}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setMinute(m); }}
                style={[timeStyles.option, minute === m && { backgroundColor: C.tint + '20' }]}
              >
                <Text style={[timeStyles.optionText, { color: minute === m ? C.tint : C.text, fontFamily: minute === m ? 'Inter_700Bold' : 'Inter_400Regular' }]}>
                  {m.toString().padStart(2, '0')}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      <Pressable onPress={onDone} style={timeStyles.doneBtn}>
        <LinearGradient
          colors={['#7C5CFC', '#FF6B9D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: Radius.md }]}
        />
        <Ionicons name="checkmark" size={16} color="#fff" />
        <Text style={timeStyles.doneBtnText}>{t('save', 'en')}</Text>
      </Pressable>
    </View>
  );
}

const timeStyles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  col: { flex: 1 },
  label: { fontSize: 11, fontFamily: 'Inter_600SemiBold', textAlign: 'center', marginBottom: Spacing.xs, textTransform: 'uppercase' },
  scroll: { height: 160 },
  option: { paddingVertical: 8, borderRadius: Radius.sm, alignItems: 'center' },
  optionText: { fontSize: 16 },
  colon: { fontSize: 24, fontFamily: 'Inter_700Bold', marginTop: 30 },
  doneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.md,
    paddingVertical: 10,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  doneBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
