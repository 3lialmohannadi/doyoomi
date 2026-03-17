import React, { useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import {
  FormModal, FormField, FormInput, FormPressableInput,
  PrioritySelector, CategorySelector,
} from '../../components/ui/FormModal';
import { FormDatePicker } from '../../components/ui/FormDatePicker';
import { Task, Priority, TaskStatus } from '../../types';
import { useTasksStore } from '../../store/tasksStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t } from '../../utils/i18n';
import { getTodayString } from '../../utils/date';
import { Radius, Spacing, F, PRIMARY, SECONDARY, GRADIENT_H, ColorScheme } from '../../theme';

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
          <FormDatePicker
            selected={dueDate}
            onSelect={(d: string) => { setDueDate(d); setShowDatePicker(false); }}
            C={C}
            lang={lang}
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

// ── Inline Time Picker ────────────────────────────────────────────────────────
function InlineTimePicker({ value, onChange, is12h, C, onDone, lang }: { value?: string; onChange: (v: string) => void; is12h: boolean; C: ColorScheme; onDone: () => void; lang: string }) {
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
    <View style={[timeStyles.container, { backgroundColor: C.surface, borderColor: C.border }]}>
      <View style={timeStyles.row}>
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
                <Text style={[timeStyles.optionText, { color: hour === h ? C.tint : C.text, fontFamily: hour === h ? F.bold : F.reg }]}>
                  {formatHour(h)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Text style={[timeStyles.colon, { color: C.text }]}>:</Text>

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
                <Text style={[timeStyles.optionText, { color: minute === m ? C.tint : C.text, fontFamily: minute === m ? F.bold : F.reg }]}>
                  {m.toString().padStart(2, '0')}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      <Pressable onPress={onDone} style={timeStyles.doneBtn}>
        <LinearGradient
          colors={[...GRADIENT_H]}
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
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  col: { flex: 1 },
  label: { fontSize: 11, fontFamily: F.med, textAlign: 'center', marginBottom: Spacing.xs, textTransform: 'uppercase' },
  scroll: { height: 160 },
  option: { paddingVertical: 8, borderRadius: Radius.sm, alignItems: 'center' },
  optionText: { fontSize: 16 },
  colon: { fontSize: 24, fontFamily: F.bold, marginTop: 30 },
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
  doneBtnText: { color: '#fff', fontSize: 14, fontFamily: F.med },
});
