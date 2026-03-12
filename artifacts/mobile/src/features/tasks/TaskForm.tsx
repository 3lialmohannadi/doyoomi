import React, { useState, useEffect } from 'react';
import { FormModal, FormField, FormInput, FormSelect } from '../../components/ui/FormModal';
import { Task, Priority, TaskStatus } from '../../types';
import { useTasksStore } from '../../store/tasksStore';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { t } from '../../utils/i18n';
import { getTodayString } from '../../utils/date';

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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
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
    if (!title.trim()) return;
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

  const statusOptions = [
    { key: 'pending', label: t('pending', lang) },
    { key: 'completed', label: t('done', lang) },
    { key: 'postponed', label: t('postponed', lang) },
  ];

  const catOptions = [
    { key: '', label: 'None' },
    ...categories.map(c => ({ key: c.id, label: c.name })),
  ];

  return (
    <FormModal
      visible={visible}
      title={editTask ? t('editTask', lang) : t('addTask', lang)}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={t('save', lang)}
    >
      <FormField label={t('title', lang)}>
        <FormInput
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
        />
      </FormField>

      <FormField label={t('description', lang)}>
        <FormInput
          value={description}
          onChangeText={setDescription}
          placeholder="Add a description..."
          multiline
        />
      </FormField>

      <FormField label={t('date', lang)}>
        <FormInput
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
        />
      </FormField>

      <FormField label={t('time', lang)}>
        <FormInput
          value={dueTime}
          onChangeText={setDueTime}
          placeholder="HH:MM"
        />
      </FormField>

      <FormField label={t('priority', lang)}>
        <FormSelect options={priorityOptions} value={priority} onChange={(v) => setPriority(v as Priority)} />
      </FormField>

      <FormField label={t('category', lang)}>
        <FormSelect options={catOptions} value={categoryId} onChange={setCategoryId} />
      </FormField>
    </FormModal>
  );
}
