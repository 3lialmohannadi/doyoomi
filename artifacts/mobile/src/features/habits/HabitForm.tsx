import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { FormModal, FormField } from '../../components/ui/FormModal';
import { BilingualNameField } from '../../components/ui/BilingualNameField';
import { IconColorPicker } from '../../components/ui/IconColorPicker';
import { Habit, HabitFrequency } from '../../types';
import { useHabitsStore } from '../../store/habitsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t, resolveDisplayName } from '../../utils/i18n';
import { SHARED_ICONS, SHARED_COLORS } from '../../constants/pickerOptions';
import { Radius, F } from '../../theme';

interface HabitFormProps {
  visible: boolean;
  onClose: () => void;
  editHabit?: Habit | null;
}

const FREQ_OPTIONS: { key: HabitFrequency; labelKey: string }[] = [
  { key: 'daily',     labelKey: 'freqDaily'    },
  { key: '3x_week',  labelKey: 'freq3xWeek'   },
  { key: '5x_week',  labelKey: 'freq5xWeek'   },
  { key: 'weekdays', labelKey: 'freqWeekdays'  },
  { key: 'weekends', labelKey: 'freqWeekends'  },
  { key: 'weekly',   labelKey: 'freqWeekly'   },
];

export function HabitForm({ visible, onClose, editHabit }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const { C } = useAppTheme();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [icon, setIcon] = useState(SHARED_ICONS[0]);
  const [color, setColor] = useState(SHARED_COLORS[0]);
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setNameError(false);
    if (editHabit) {
      setNameAr(editHabit.name_ar ?? (editHabit.name && !editHabit.name_en ? editHabit.name : ''));
      setNameEn(editHabit.name_en ?? '');
      setIcon(editHabit.icon);
      setColor(editHabit.color);
      setFrequency(editHabit.frequency ?? 'daily');
    } else {
      setNameAr('');
      setNameEn('');
      setIcon(SHARED_ICONS[0]);
      setColor(SHARED_COLORS[0]);
      setFrequency('daily');
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
      frequency,
      streak_days: editHabit?.streak_days ?? 0,
      best_streak: editHabit?.best_streak ?? 0,
      last_completed_at: editHabit?.last_completed_at,
      completion_history: editHabit?.completion_history ?? [],
    };
    if (editHabit) {
      updateHabit(editHabit.id, data);
    } else {
      addHabit({ name: data.name, name_ar: data.name_ar, name_en: data.name_en, icon, color, frequency });
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

      <FormField label={t('habitFrequency', lang)}>
        <View style={[freqStyles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {FREQ_OPTIONS.map(opt => {
            const isActive = frequency === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFrequency(opt.key);
                }}
                style={[
                  freqStyles.chip,
                  {
                    backgroundColor: isActive ? C.tint + '18' : C.surface,
                    borderColor: isActive ? C.tint : C.border,
                  },
                ]}
              >
                <Text style={[freqStyles.chipText, { color: isActive ? C.tint : C.textSecondary }]}>
                  {t(opt.labelKey, lang)}
                </Text>
              </Pressable>
            );
          })}
        </View>
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

const freqStyles = StyleSheet.create({
  row: { flexWrap: 'wrap', gap: 6 },
  chip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12, fontFamily: F.med },
});
