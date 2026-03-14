import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormModal, FormField, FormInput } from '../../components/ui/FormModal';
import { IconColorPicker } from '../../components/ui/IconColorPicker';
import { Habit } from '../../types';
import { useHabitsStore } from '../../store/habitsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t } from '../../utils/i18n';

import { SHARED_ICONS, SHARED_COLORS } from '../../constants/pickerOptions';

interface HabitFormProps {
  visible: boolean;
  onClose: () => void;
  editHabit?: Habit | null;
}

export function HabitForm({ visible, onClose, editHabit }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const { C } = useAppTheme();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [name, setName] = useState('');
  const [icon, setIcon] = useState(SHARED_ICONS[0]);
  const [color, setColor] = useState(SHARED_COLORS[0]);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setNameError(false);
    if (editHabit) {
      setName(editHabit.name);
      setIcon(editHabit.icon);
      setColor(editHabit.color);
    } else {
      setName('');
      setIcon(SHARED_ICONS[0]);
      setColor(SHARED_COLORS[0]);
    }
  }, [editHabit, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    const data = {
      name: name.trim(),
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
        <FormInput
          value={name}
          onChangeText={(v) => { setName(v); if (v.trim()) setNameError(false); }}
          placeholder={t('habitNamePlaceholder', lang)}
          error={nameError}
        />
        {nameError && (
          <View style={[styles.errorRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="alert-circle-outline" size={14} color={C.error} />
            <Text style={[styles.errorText, { color: C.error }]}>{t('fieldRequired', lang)}</Text>
          </View>
        )}
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

const styles = StyleSheet.create({
  errorRow: {
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
