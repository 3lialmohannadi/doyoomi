import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import {
  FormModal, FormField, FormInput, FormPressableInput,
  PrioritySelector, CategorySelector,
} from '../../components/ui/FormModal';
import { FormDatePicker } from '../../components/ui/FormDatePicker';
import { Task, Priority, TaskStatus, Language, RecurrenceRule, RecurrenceType, Subtask } from '../../types';
import { useTasksStore } from '../../store/tasksStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t, resolveDisplayName } from '../../utils/i18n';
import { BilingualNameField } from '../../components/ui/BilingualNameField';
import { getTodayString } from '../../utils/date';
import { Radius, Spacing, F, PRIMARY, SECONDARY, GRADIENT_H, ColorScheme } from '../../theme';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  editTask?: Task | null;
  defaultDate?: string;
}

const RECURRENCE_OPTIONS: { key: RecurrenceType | 'none'; labelKey: string }[] = [
  { key: 'none',     labelKey: 'repeatNone'     },
  { key: 'daily',    labelKey: 'repeatDaily'    },
  { key: 'weekdays', labelKey: 'repeatWeekdays' },
  { key: 'weekly',   labelKey: 'repeatWeekly'   },
  { key: 'monthly',  labelKey: 'repeatMonthly'  },
];

const genSubId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

export function TaskForm({ visible, onClose, editTask, defaultDate }: TaskFormProps) {
  const { addTask, updateTask } = useTasksStore();
  const { categories } = useCategoriesStore();
  const { profile } = useSettingsStore();
  const { C } = useAppTheme();
  const lang = profile.language;
  const is12h = profile.time_format === '12h';
  const isRTL = lang === 'ar';

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [categoryId, setCategoryId] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType | 'none'>('none');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskText, setEditingSubtaskText] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const subtaskInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTitleError(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
    setSubtaskInput('');
    if (editTask) {
      setTitleAr(editTask.title_ar ?? (editTask.title && !editTask.title_en ? editTask.title : ''));
      setTitleEn(editTask.title_en ?? '');
      setDescription(editTask.description ?? '');
      setDueDate(editTask.due_date ?? getTodayString());
      setDueTime(editTask.due_time ?? '');
      setPriority(editTask.priority);
      setStatus(editTask.status);
      setCategoryId(editTask.category_id ?? '');
      setRecurrenceType(editTask.recurrence?.type ?? 'none');
      setSubtasks(editTask.subtasks ? [...editTask.subtasks] : []);
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescription('');
      setDueDate(defaultDate ?? getTodayString());
      setDueTime('');
      setPriority('medium');
      setStatus('pending');
      setCategoryId('');
      setRecurrenceType('none');
      setSubtasks([]);
    }
  }, [editTask, visible, defaultDate]);

  const handleAddSubtask = () => {
    const text = subtaskInput.trim();
    if (!text) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSubtasks(prev => [...prev, { id: genSubId(), text, done: false }]);
    setSubtaskInput('');
  };

  const handleToggleSubtask = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const handleRemoveSubtask = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (editingSubtaskId === id) {
      setEditingSubtaskId(null);
      setEditingSubtaskText('');
    }
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleStartEditSubtask = (s: Subtask) => {
    setEditingSubtaskId(s.id);
    setEditingSubtaskText(s.text);
  };

  const handleSaveEditSubtask = () => {
    const text = editingSubtaskText.trim();
    if (!text || !editingSubtaskId) return;
    setSubtasks(prev => prev.map(s => s.id === editingSubtaskId ? { ...s, text } : s));
    setEditingSubtaskId(null);
    setEditingSubtaskText('');
  };

  const handleSave = () => {
    if (!titleAr.trim() && !titleEn.trim()) {
      setTitleError(true);
      return;
    }
    const taskData = {
      title: resolveDisplayName(titleAr, titleEn, lang, titleAr || titleEn),
      title_ar: titleAr.trim() || undefined,
      title_en: titleEn.trim() || undefined,
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
      due_time: dueTime || undefined,
      priority,
      status,
      category_id: categoryId || undefined,
      is_all_day: !dueTime,
      recurrence: recurrenceType !== 'none' ? { type: recurrenceType } as RecurrenceRule : undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
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

  const doneCount = subtasks.filter(s => s.done).length;

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
        <BilingualNameField
          lang={lang}
          nameAr={titleAr}
          nameEn={titleEn}
          onChangeAr={setTitleAr}
          onChangeEn={setTitleEn}
          error={titleError}
          onClearError={() => setTitleError(false)}
          labelKey="title"
          placeholderAr="مثال: مراجعة التقرير"
          placeholderEn="e.g. Review the report"
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

      {/* Repeat / Recurrence */}
      <FormField label={t('repeatLabel', lang)}>
        <View style={[repeatStyles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {RECURRENCE_OPTIONS.map(opt => {
            const isActive = recurrenceType === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRecurrenceType(opt.key as RecurrenceType | 'none');
                }}
                style={[
                  repeatStyles.chip,
                  {
                    backgroundColor: isActive ? C.tint + '18' : C.surface,
                    borderColor: isActive ? C.tint : C.border,
                  },
                ]}
              >
                <Text style={[repeatStyles.chipText, { color: isActive ? C.tint : C.textSecondary }]}>
                  {t(opt.labelKey, lang)}
                </Text>
              </Pressable>
            );
          })}
        </View>
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

      {/* Subtasks */}
      <FormField
        label={
          subtasks.length > 0
            ? `${t('subtasks', lang)} (${doneCount}/${subtasks.length})`
            : t('subtasks', lang)
        }
      >
        {subtasks.map((s) => {
          const isEditing = editingSubtaskId === s.id;
          return (
            <View
              key={s.id}
              style={[subStyles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <Pressable
                onPress={() => { if (!isEditing) handleToggleSubtask(s.id); }}
                style={[subStyles.check, { borderColor: s.done ? C.success : C.border, backgroundColor: s.done ? C.success : 'transparent' }]}
              >
                {s.done && <Ionicons name="checkmark" size={11} color="#fff" />}
              </Pressable>

              {isEditing ? (
                <TextInput
                  value={editingSubtaskText}
                  onChangeText={setEditingSubtaskText}
                  autoFocus
                  style={[subStyles.text, subStyles.editInput, { color: C.text, flex: 1, textAlign: isRTL ? 'right' : 'left', borderColor: C.tint }]}
                  returnKeyType="done"
                  onSubmitEditing={handleSaveEditSubtask}
                  onBlur={handleSaveEditSubtask}
                />
              ) : (
                <Pressable onPress={() => handleStartEditSubtask(s)} style={{ flex: 1 }}>
                  <Text
                    style={[
                      subStyles.text,
                      { color: s.done ? C.textMuted : C.text, textAlign: isRTL ? 'right' : 'left' },
                      s.done && subStyles.strikethrough,
                    ]}
                    numberOfLines={2}
                  >
                    {s.text}
                  </Text>
                </Pressable>
              )}

              {isEditing ? (
                <Pressable onPress={handleSaveEditSubtask} hitSlop={6}>
                  <Ionicons name="checkmark-circle" size={20} color={C.success} />
                </Pressable>
              ) : (
                <Pressable onPress={() => handleRemoveSubtask(s.id)} hitSlop={6}>
                  <Ionicons name="close-circle" size={18} color={C.textMuted} />
                </Pressable>
              )}
            </View>
          );
        })}

        <View style={[subStyles.addRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderColor: C.border, backgroundColor: C.surface }]}>
          <TextInput
            ref={subtaskInputRef}
            value={subtaskInput}
            onChangeText={setSubtaskInput}
            placeholder={t('subtaskPlaceholder', lang)}
            placeholderTextColor={C.textMuted}
            style={[subStyles.input, { color: C.text }]}
            textAlign={isRTL ? 'right' : 'left'}
            returnKeyType="done"
            onSubmitEditing={handleAddSubtask}
          />
          <Pressable
            onPress={handleAddSubtask}
            style={[subStyles.addBtn, { backgroundColor: subtaskInput.trim() ? C.tint : C.tint + '40' }]}
            disabled={!subtaskInput.trim()}
          >
            <Ionicons name="add" size={16} color="#fff" />
          </Pressable>
        </View>
      </FormField>
    </FormModal>
  );
}

// ── Inline Time Picker ────────────────────────────────────────────────────────
function InlineTimePicker({ value, onChange, is12h, C, onDone, lang }: { value?: string; onChange: (v: string) => void; is12h: boolean; C: ColorScheme; onDone: () => void; lang: Language }) {
  const initHour = value ? parseInt(value.split(':')[0]) : new Date().getHours();
  const initMin  = value ? Math.round(parseInt(value.split(':')[1]) / 5) * 5 : 0;

  const [hour24, setHour24] = useState(initHour);
  const [minute, setMinute] = useState(initMin % 60);
  const [isPm, setIsPm] = useState(initHour >= 12);

  const commit = (h: number, m: number) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    onChange(`${hh}:${mm}`);
  };

  const stepHour = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (is12h) {
      const h12 = hour24 % 12 || 12;
      const newH12 = ((h12 - 1 + delta + 12) % 12) + 1;
      const newH24 = isPm ? (newH12 === 12 ? 12 : newH12 + 12) : (newH12 === 12 ? 0 : newH12);
      setHour24(newH24);
      commit(newH24, minute);
    } else {
      const newH = (hour24 + delta + 24) % 24;
      setHour24(newH);
      commit(newH, minute);
    }
  };

  const stepMinute = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newM = (minute + delta * 5 + 60) % 60;
    setMinute(newM);
    commit(hour24, newM);
  };

  const togglePm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newPm = !isPm;
    setIsPm(newPm);
    const h12 = hour24 % 12 || 12;
    const newH24 = newPm ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
    setHour24(newH24);
    commit(newH24, minute);
  };

  const displayHour = is12h ? (hour24 % 12 || 12).toString().padStart(2, '0') : hour24.toString().padStart(2, '0');
  const displayMin  = minute.toString().padStart(2, '0');

  return (
    <View style={[timeStyles.container, { backgroundColor: C.surface, borderColor: C.border }]}>
      <View style={timeStyles.row}>
        {/* Hour */}
        <View style={timeStyles.col}>
          <Text style={[timeStyles.label, { color: C.textMuted }]}>{t('hourLabel', lang)}</Text>
          <Pressable onPress={() => stepHour(1)} style={({ pressed }) => [timeStyles.stepBtn, { backgroundColor: C.tint + '12', opacity: pressed ? 0.7 : 1 }]}>
            <Ionicons name="chevron-up" size={20} color={C.tint} />
          </Pressable>
          <View style={[timeStyles.valueBox, { backgroundColor: C.tint + '10', borderColor: C.tint + '30' }]}>
            <Text style={[timeStyles.valueText, { color: C.text }]}>{displayHour}</Text>
          </View>
          <Pressable onPress={() => stepHour(-1)} style={({ pressed }) => [timeStyles.stepBtn, { backgroundColor: C.tint + '12', opacity: pressed ? 0.7 : 1 }]}>
            <Ionicons name="chevron-down" size={20} color={C.tint} />
          </Pressable>
        </View>

        <Text style={[timeStyles.colon, { color: C.textSecondary }]}>:</Text>

        {/* Minute */}
        <View style={timeStyles.col}>
          <Text style={[timeStyles.label, { color: C.textMuted }]}>{t('minLabel', lang)}</Text>
          <Pressable onPress={() => stepMinute(1)} style={({ pressed }) => [timeStyles.stepBtn, { backgroundColor: C.tint + '12', opacity: pressed ? 0.7 : 1 }]}>
            <Ionicons name="chevron-up" size={20} color={C.tint} />
          </Pressable>
          <View style={[timeStyles.valueBox, { backgroundColor: C.tint + '10', borderColor: C.tint + '30' }]}>
            <Text style={[timeStyles.valueText, { color: C.text }]}>{displayMin}</Text>
          </View>
          <Pressable onPress={() => stepMinute(-1)} style={({ pressed }) => [timeStyles.stepBtn, { backgroundColor: C.tint + '12', opacity: pressed ? 0.7 : 1 }]}>
            <Ionicons name="chevron-down" size={20} color={C.tint} />
          </Pressable>
        </View>

        {/* AM/PM (12h only) */}
        {is12h && (
          <View style={timeStyles.col}>
            <Text style={[timeStyles.label, { color: C.textMuted }]}> </Text>
            <Pressable onPress={togglePm} style={[timeStyles.ampmBtn, { backgroundColor: isPm ? C.tint + '15' : C.tint, borderColor: C.tint }]}>
              <Text style={[timeStyles.ampmText, { color: isPm ? C.text : '#fff' }]}>AM</Text>
            </Pressable>
            <Pressable onPress={togglePm} style={[timeStyles.ampmBtn, { backgroundColor: isPm ? C.tint : C.tint + '15', borderColor: C.tint, marginTop: 6 }]}>
              <Text style={[timeStyles.ampmText, { color: isPm ? '#fff' : C.text }]}>PM</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Pressable onPress={onDone} style={timeStyles.doneBtn}>
        <LinearGradient colors={[...GRADIENT_H]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: Radius.md }]} />
        <Ionicons name="checkmark" size={16} color="#fff" />
        <Text style={timeStyles.doneBtnText}>{t('save', lang)}</Text>
      </Pressable>
    </View>
  );
}

const repeatStyles = StyleSheet.create({
  row: { flexWrap: 'wrap', gap: 6 },
  chip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12, fontFamily: F.med },
});

const subStyles = StyleSheet.create({
  row: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  check: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  text: { fontSize: 14, fontFamily: F.reg },
  editInput: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 14,
    fontFamily: F.reg,
  },
  strikethrough: { textDecorationLine: 'line-through', opacity: 0.5 },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    marginTop: 8,
    overflow: 'hidden',
  },
  input: { flex: 1, fontSize: 14, fontFamily: F.reg, paddingHorizontal: 12, paddingVertical: 9 },
  addBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', margin: 2, borderRadius: Radius.sm },
});

const timeStyles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  col: { flex: 1, alignItems: 'center', gap: 6 },
  label: { fontSize: 11, fontFamily: F.med, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  stepBtn: { width: '100%', height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  valueBox: { width: '100%', height: 52, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  valueText: { fontSize: 26, fontFamily: F.bold, letterSpacing: 1 },
  colon: { fontSize: 28, fontFamily: F.bold, marginTop: 42, marginHorizontal: -4 },
  ampmBtn: { width: '100%', height: 36, borderRadius: Radius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ampmText: { fontSize: 13, fontFamily: F.bold },
  doneBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderRadius: Radius.md, paddingVertical: 11, marginTop: Spacing.md, overflow: 'hidden',
  },
  doneBtnText: { color: '#fff', fontSize: 14, fontFamily: F.med },
});
