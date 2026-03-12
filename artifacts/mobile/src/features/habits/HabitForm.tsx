import React, { useState, useEffect } from 'react';
import { FormModal, FormField, FormInput, FormSelect } from '../../components/ui/FormModal';
import { Habit } from '../../types';
import { useHabitsStore } from '../../store/habitsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { t } from '../../utils/i18n';

interface HabitFormProps {
  visible: boolean;
  onClose: () => void;
  editHabit?: Habit | null;
}

const ICONS = ['leaf', 'water', 'journal', 'phone-portrait', 'fitness', 'moon', 'book', 'nutrition', 'walk', 'bed'];
const COLORS = ['#4CAF82', '#6C8EF5', '#9B6EF5', '#F0A4C8', '#F5A623', '#E05E5E', '#FF8A50', '#5CC2C2'];

export function HabitForm({ visible, onClose, editHabit }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('leaf');
  const [color, setColor] = useState('#4CAF82');

  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name);
      setIcon(editHabit.icon);
      setColor(editHabit.color);
    } else {
      setName('');
      setIcon('leaf');
      setColor('#4CAF82');
    }
  }, [editHabit, visible]);

  const handleSave = () => {
    if (!name.trim()) return;
    const data = { name: name.trim(), icon, color, streak_days: editHabit?.streak_days ?? 0, last_completed_at: editHabit?.last_completed_at };
    if (editHabit) {
      updateHabit(editHabit.id, data);
    } else {
      addHabit(data);
    }
    onClose();
  };

  const iconOptions = ICONS.map(i => ({ key: i, label: i }));
  const colorOptions = COLORS.map(c => ({ key: c, label: c }));

  return (
    <FormModal
      visible={visible}
      title={editHabit ? t('editHabit', lang) : t('addHabit', lang)}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={t('save', lang)}
      cancelLabel={t('cancel', lang)}
    >
      <FormField label={t('habitName', lang)}>
        <FormInput value={name} onChangeText={setName} placeholder={t('habitNamePlaceholder', lang)} />
      </FormField>

      <FormField label={t('icon', lang)}>
        <FormSelect options={iconOptions} value={icon} onChange={setIcon} />
      </FormField>

      <FormField label={t('color', lang)}>
        <FormSelect options={colorOptions} value={color} onChange={setColor} />
      </FormField>
    </FormModal>
  );
}
