import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { FormModal, FormField, FormInput } from '../../components/ui/FormModal';
import { Habit } from '../../types';
import { useHabitsStore } from '../../store/habitsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t } from '../../utils/i18n';
import { Radius, Spacing } from '../../theme';
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

  const [name, setName] = useState('');
  const [icon, setIcon] = useState(SHARED_ICONS[0]);
  const [color, setColor] = useState(SHARED_COLORS[0]);

  useEffect(() => {
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
    if (!name.trim()) return;
    const data = { name: name.trim(), icon, color, streak_days: editHabit?.streak_days ?? 0, last_completed_at: editHabit?.last_completed_at };
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
        <FormInput value={name} onChangeText={setName} placeholder={t('habitNamePlaceholder', lang)} />
      </FormField>

      <FormField label={t('icon', lang)}>
        <View style={styles.iconGrid}>
          {SHARED_ICONS.map(ic => {
            const isActive = ic === icon;
            return (
              <Pressable
                key={ic}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIcon(ic); }}
                style={[styles.iconBtn, {
                  backgroundColor: isActive ? color + '25' : C.surface,
                  borderColor: isActive ? color : C.border,
                  borderWidth: isActive ? 2 : 1,
                }]}
              >
                <Ionicons name={(ic + '-outline') as any} size={22} color={isActive ? color : C.textMuted} />
              </Pressable>
            );
          })}
        </View>
      </FormField>

      <FormField label={t('color', lang)}>
        <View style={styles.colorGrid}>
          {SHARED_COLORS.map(cl => {
            const isActive = cl === color;
            return (
              <Pressable
                key={cl}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setColor(cl); }}
                style={[styles.colorBtn, { backgroundColor: cl, borderWidth: isActive ? 3 : 0, borderColor: '#fff' }]}
              >
                {isActive && <Ionicons name="checkmark" size={18} color="#fff" />}
              </Pressable>
            );
          })}
        </View>
      </FormField>
    </FormModal>
  );
}

const styles = StyleSheet.create({
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  iconBtn: {
    width: 46, height: 46, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm + 2 },
  colorBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
});
