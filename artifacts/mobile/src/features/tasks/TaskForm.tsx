import React, { useState, useEffect } from 'react';
import { Platform, View, Pressable, Text } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import {
  FormModal, FormField, FormInput, FormPressableInput,
  PrioritySelector, CategorySelector,
} from '../../components/ui/FormModal';
import { Task, Priority, TaskStatus } from '../../types';
import { useTasksStore } from '../../store/tasksStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { t } from '../../utils/i18n';
import { getTodayString } from '../../utils/date';
import { Radius } from '../../theme';

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

export function TaskForm({ visible, onClose, editTask }: TaskFormProps) {
  const { addTask, updateTask } = useTasksStore();
  const { categories } = useCategoriesStore();
  const { profile } = useSettingsStore();
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

  const dateObj = dueDate ? parseISO(dueDate) : new Date();
  const timeObj = dueTime
    ? new Date(2000, 0, 1, parseInt(dueTime.split(':')[0]), parseInt(dueTime.split(':')[1]))
    : new Date();

  const onDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) {
      setDueDate(format(selected, 'yyyy-MM-dd'));
    }
  };

  const onTimeChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selected) {
      setDueTime(format(selected, 'HH:mm'));
    }
  };

  const displayDate = dueDate
    ? format(parseISO(dueDate), 'MMM d, yyyy')
    : '';

  const displayTime = dueTime
    ? is12h
      ? format(timeObj, 'h:mm a')
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
          onPress={() => setShowDatePicker(!showDatePicker)}
        />
        {showDatePicker && (
          <View>
            <DateTimePicker
              value={dateObj}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onDateChange}
            />
            {Platform.OS === 'ios' && (
              <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
                <PickerDoneBtn onPress={() => setShowDatePicker(false)} lang={lang} />
              </View>
            )}
          </View>
        )}
      </FormField>

      <FormField label={t('time', lang)}>
        <FormPressableInput
          value={displayTime}
          placeholder={t('timePlaceholder', lang)}
          icon="time-outline"
          onPress={() => setShowTimePicker(!showTimePicker)}
        />
        {showTimePicker && (
          <View>
            <DateTimePicker
              value={timeObj}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
              is24Hour={!is12h}
            />
            {Platform.OS === 'ios' && (
              <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
                <PickerDoneBtn onPress={() => setShowTimePicker(false)} lang={lang} />
              </View>
            )}
          </View>
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

function PickerDoneBtn({ onPress, lang }: { onPress: () => void; lang: string }) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#7C5CFC', '#FF6B9D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 6 }}
      >
        <Text style={{ color: '#fff', fontSize: 13, fontFamily: 'Inter_600SemiBold' }}>
          {t('save', lang)}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
