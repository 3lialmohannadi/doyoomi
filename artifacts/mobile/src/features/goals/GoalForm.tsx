import React, { useState, useEffect } from 'react';
import { FormModal, FormField, FormInput, FormSelect } from '../../components/ui/FormModal';
import { Goal, GoalType } from '../../types';
import { useGoalsStore } from '../../store/goalsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { t } from '../../utils/i18n';

interface GoalFormProps {
  visible: boolean;
  onClose: () => void;
  editGoal?: Goal | null;
}

const ICONS = ['book', 'fitness', 'card', 'language', 'star', 'heart', 'trophy', 'rocket', 'leaf', 'water'];
const COLORS = ['#6C8EF5', '#F0A4C8', '#4CAF82', '#9B6EF5', '#F5A623', '#E05E5E', '#FF8A50', '#5CC2C2'];

export function GoalForm({ visible, onClose, editGoal }: GoalFormProps) {
  const { addGoal, updateGoal } = useGoalsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('monthly');
  const [targetValue, setTargetValue] = useState('10');
  const [currentValue, setCurrentValue] = useState('0');
  const [icon, setIcon] = useState('star');
  const [color, setColor] = useState('#6C8EF5');

  useEffect(() => {
    if (editGoal) {
      setTitle(editGoal.title);
      setDescription(editGoal.description ?? '');
      setType(editGoal.type);
      setTargetValue(String(editGoal.target_value));
      setCurrentValue(String(editGoal.current_value));
      setIcon(editGoal.icon);
      setColor(editGoal.color);
    } else {
      setTitle('');
      setDescription('');
      setType('monthly');
      setTargetValue('10');
      setCurrentValue('0');
      setIcon('star');
      setColor('#6C8EF5');
    }
  }, [editGoal, visible]);

  const handleSave = () => {
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      target_value: Number(targetValue) || 10,
      current_value: Number(currentValue) || 0,
      icon,
      color,
    };
    if (editGoal) {
      updateGoal(editGoal.id, data);
    } else {
      addGoal(data);
    }
    onClose();
  };

  const typeOptions = [
    { key: 'monthly', label: t('monthly', lang) },
    { key: 'yearly', label: t('yearly', lang) },
  ];

  const iconOptions = ICONS.map(i => ({ key: i, label: i }));
  const colorOptions = COLORS.map(c => ({ key: c, label: c }));

  return (
    <FormModal
      visible={visible}
      title={editGoal ? t('editGoal', lang) : t('addGoal', lang)}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={t('save', lang)}
    >
      <FormField label={t('title', lang)}>
        <FormInput value={title} onChangeText={setTitle} placeholder="Goal title" />
      </FormField>

      <FormField label={t('description', lang)}>
        <FormInput value={description} onChangeText={setDescription} placeholder="Description..." multiline />
      </FormField>

      <FormField label={t('goalType', lang)}>
        <FormSelect options={typeOptions} value={type} onChange={(v) => setType(v as GoalType)} />
      </FormField>

      <FormField label={t('targetValue', lang)}>
        <FormInput value={targetValue} onChangeText={setTargetValue} keyboardType="numeric" />
      </FormField>

      <FormField label={t('currentValue', lang)}>
        <FormInput value={currentValue} onChangeText={setCurrentValue} keyboardType="numeric" />
      </FormField>

      <FormField label="Icon">
        <FormSelect options={iconOptions} value={icon} onChange={setIcon} />
      </FormField>

      <FormField label="Color">
        <FormSelect options={colorOptions} value={color} onChange={setColor} />
      </FormField>
    </FormModal>
  );
}
