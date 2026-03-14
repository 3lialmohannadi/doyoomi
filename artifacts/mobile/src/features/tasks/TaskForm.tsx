import React, { useState, useEffect, useMemo } from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  format, parseISO, startOfMonth, getDaysInMonth, getDay,
  addMonths, subMonths, addYears, subYears,
} from 'date-fns';
import * as Haptics from 'expo-haptics';
import {
  FormModal, FormField, FormInput, FormPressableInput,
  PrioritySelector, CategorySelector,
} from '../../components/ui/FormModal';
import { Task, Priority, TaskStatus, Language } from '../../types';
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

  const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const displayDate = dueDate
    ? lang === 'ar'
      ? (() => { const d = parseISO(dueDate); return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`; })()
      : format(parseISO(dueDate), 'MMM d, yyyy')
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
            onSelect={(d: string) => { setDueDate(d); setShowDatePicker(false); }}
            C={C}
            startOfWeek={profile.start_of_week}
            lang={lang}
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
            onChange={(v: string) => setDueTime(v)}
            is12h={is12h}
            C={C}
            lang={lang}
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
const AR_MONTHS_CAL = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const AR_DAY_HEADERS_SUN = ['أح','اث','ثل','أر','خم','جم','سب'];
const AR_DAY_HEADERS_MON = ['اث','ثل','أر','خم','جم','سب','أح'];
const EN_DAY_HEADERS_SUN = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const EN_DAY_HEADERS_MON = ['Mo','Tu','We','Th','Fr','Sa','Su'];

interface InlineCalendarProps {
  selected: string;
  onSelect: (d: string) => void;
  C: Record<string, string>;
  startOfWeek: string;
  lang: Language;
}

function InlineCalendar({ selected, onSelect, C, startOfWeek: startDay, lang }: InlineCalendarProps) {
  const [viewDate, setViewDate] = useState(() => selected ? parseISO(selected) : new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const isAr = lang === 'ar';

  const weekStart = startDay === 'sunday' ? 0 : 1;
  const dayHeaders = isAr
    ? (startDay === 'sunday' ? AR_DAY_HEADERS_SUN : AR_DAY_HEADERS_MON)
    : (startDay === 'sunday' ? EN_DAY_HEADERS_SUN : EN_DAY_HEADERS_MON);

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

  const currentYear = viewDate.getFullYear();
  const yearRange = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

  return (
    <View style={[calStyles.container, { backgroundColor: C.card, borderColor: C.border }]}>
      {/* Nav row: year back | month back | Month+Year label | month fwd | year fwd */}
      <View style={[calStyles.nav, { flexDirection: isAr ? 'row-reverse' : 'row' }]}>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(subYears(viewDate, 1)); setShowYearPicker(false); }}
          style={[calStyles.navYearBtn, { backgroundColor: C.tint + '15', flexDirection: isAr ? 'row-reverse' : 'row' }]}
          accessibilityLabel="Previous year"
        >
          <Ionicons name={isAr ? 'chevron-forward' : 'chevron-back'} size={12} color={C.tint} />
          <Ionicons name={isAr ? 'chevron-forward' : 'chevron-back'} size={12} color={C.tint} style={{ marginLeft: isAr ? 0 : -6, marginRight: isAr ? -6 : 0 }} />
        </Pressable>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(subMonths(viewDate, 1)); setShowYearPicker(false); }}>
          <Ionicons name={isAr ? 'chevron-forward' : 'chevron-back'} size={20} color={C.tint} />
        </Pressable>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowYearPicker(v => !v); }}
          style={calStyles.navLabelBtn}
        >
          <Text style={[calStyles.navLabel, { color: C.text }]}>
            {isAr ? `${AR_MONTHS_CAL[viewDate.getMonth()]} ${viewDate.getFullYear()}` : format(viewDate, 'MMM yyyy')}
          </Text>
          <Ionicons name={showYearPicker ? 'chevron-up' : 'chevron-down'} size={12} color={C.textMuted} />
        </Pressable>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(addMonths(viewDate, 1)); setShowYearPicker(false); }}>
          <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={20} color={C.tint} />
        </Pressable>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(addYears(viewDate, 1)); setShowYearPicker(false); }}
          style={[calStyles.navYearBtn, { backgroundColor: C.tint + '15', flexDirection: isAr ? 'row-reverse' : 'row' }]}
          accessibilityLabel="Next year"
        >
          <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={12} color={C.tint} />
          <Ionicons name={isAr ? 'chevron-back' : 'chevron-forward'} size={12} color={C.tint} style={{ marginLeft: isAr ? 0 : -6, marginRight: isAr ? -6 : 0 }} />
        </Pressable>
      </View>

      {/* Year picker grid */}
      {showYearPicker && (
        <View style={calStyles.yearGrid}>
          {yearRange.map(yr => {
            const isActive = yr === currentYear;
            return (
              <Pressable
                key={yr}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  const d = new Date(viewDate);
                  d.setFullYear(yr);
                  setViewDate(d);
                  setShowYearPicker(false);
                }}
                style={[calStyles.yearCell, { overflow: 'hidden' }]}
              >
                {isActive && (
                  <LinearGradient
                    colors={['#7C5CFC', '#FF6B9D']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
                  />
                )}
                <Text style={[calStyles.yearText, { color: isActive ? '#fff' : C.text, fontFamily: isActive ? 'Inter_700Bold' : 'Inter_400Regular' }]}>
                  {yr}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {!showYearPicker && (
        <>
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
        </>
      )}
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
  },
  navYearBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 6, paddingHorizontal: 4, paddingVertical: 4,
  },
  navLabelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 4, paddingVertical: 2,
  },
  navLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  yearGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  yearCell: {
    width: `${100 / 4}%`,
    paddingVertical: 8,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 8,
  },
  yearText: { fontSize: 13 },
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
interface InlineTimePickerProps {
  value: string;
  onChange: (v: string) => void;
  is12h: boolean;
  C: Record<string, string>;
  onDone: () => void;
  lang: Language;
}

function InlineTimePicker({ value, onChange, is12h, C, onDone, lang }: InlineTimePickerProps) {
  const currentHour = value ? parseInt(value.split(':')[0]) : new Date().getHours();
  const currentMin = value ? parseInt(value.split(':')[1]) : 0;

  const [hour, setHour] = useState(currentHour);
  const [minute, setMinute] = useState(currentMin);

  const commit = (h: number, m: number) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    onChange(`${hh}:${mm}`);
  };

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
      <View style={[timeStyles.row, { flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }]}>
        {/* Hour picker */}
        <View style={timeStyles.col}>
          <Text style={[timeStyles.label, { color: C.textMuted }]}>{t('hourLabel', lang)}</Text>
          <ScrollView style={timeStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {hours.map(h => (
              <Pressable
                key={h}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setHour(h);
                  commit(h, minute);
                }}
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
          <Text style={[timeStyles.label, { color: C.textMuted }]}>{t('minLabel', lang)}</Text>
          <ScrollView style={timeStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {minutes.map(m => (
              <Pressable
                key={m}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMinute(m);
                  commit(hour, m);
                }}
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
        <Text style={timeStyles.doneBtnText}>{t('save', lang)}</Text>
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
