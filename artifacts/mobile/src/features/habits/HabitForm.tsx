import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { FormModal, FormField } from '../../components/ui/FormModal';
import { BilingualNameField } from '../../components/ui/BilingualNameField';
import { IconColorPicker } from '../../components/ui/IconColorPicker';
import { Habit } from '../../types';
import { useHabitsStore } from '../../store/habitsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t, resolveDisplayName } from '../../utils/i18n';
import { SHARED_ICONS, SHARED_COLORS } from '../../constants/pickerOptions';

interface HabitFormProps {
  visible: boolean;
  onClose: () => void;
  editHabit?: Habit | null;
}

export function HabitForm({ visible, onClose, editHabit }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [icon, setIcon] = useState(SHARED_ICONS[0]);
  const [color, setColor] = useState(SHARED_COLORS[0]);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setNameError(false);
    if (editHabit) {
      setNameAr(editHabit.name_ar ?? (editHabit.name && !editHabit.name_en ? editHabit.name : ''));
      setNameEn(editHabit.name_en ?? '');
      setIcon(editHabit.icon);
      setColor(editHabit.color);
    } else {
      setNameAr('');
      setNameEn('');
      setIcon(SHARED_ICONS[0]);
      setColor(SHARED_COLORS[0]);
    }
  }, [editHabit, visible]);

  const handleSave = () => {
    if (!nameAr.trim() && !nameEn.trim()) {
      setNameError(true);
      return;
    }
    const data = {
      name: resolveDisplayName(nameAr, nameEn, lang, nameAr || nameEn),
      name_ar: nameAr.trim() || undefined,
      name_en: nameEn.trim() || undefined,
      icon,
      color,
      streak_days: editHabit?.streak_days ?? 0,
      last_completed_at: editHabit?.last_completed_at,
    };
    if (editHabit) {
      updateHabit(editHabit.id, data);
    } else {
      addHabit(data);
    }
    onClose();
  };

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
        <BilingualNameField
          lang={lang}
          nameAr={nameAr}
          nameEn={nameEn}
          onChangeAr={setNameAr}
          onChangeEn={setNameEn}
          error={nameError}
          onClearError={() => setNameError(false)}
          labelKey="name"
          placeholderAr="مثال: رياضة"
          placeholderEn="e.g. Workout"
        />
      </FormField>

      <FormField label={`${t('icon', lang)} & ${t('color', lang)}`}>
        <IconColorPicker
          selectedIcon={icon}
          selectedColor={color}
          onIconChange={setIcon}
          onColorChange={setColor}
        />
      </FormField>
    </FormModal>
  );
}
