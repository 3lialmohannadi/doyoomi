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
import { Radius, F, Spacing } from '../../theme';

interface HabitFormProps {
  visible: boolean;
  onClose: () => void;
  editHabit?: Habit | null;
}

type FreqPreset = 'daily' | 'weekdays' | '3x_week' | 'custom';

const FREQ_PRESETS: { key: FreqPreset; labelKey: string }[] = [
  { key: 'daily',    labelKey: 'freqDaily'   },
  { key: 'weekdays', labelKey: 'freqWeekdays' },
  { key: '3x_week',  labelKey: 'freq3xWeek'  },
  { key: 'custom',   labelKey: 'freqCustom'  },
];

const DAY_KEYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAY_KEYS_AR = ['أح', 'اث', 'ثل', 'أر', 'خم', 'جم', 'سب'];

function presetToFrequency(preset: FreqPreset, daysPerWeek: number, specificDays: number[]): HabitFrequency {
  if (preset === 'daily') return { type: 'daily' };
  if (preset === 'weekdays') return { type: 'weekdays' };
  if (preset === '3x_week') return { type: 'custom', days_per_week: 3 };
  return { type: 'custom', days_per_week: daysPerWeek, specific_days: specificDays.length > 0 ? specificDays : undefined };
}

function frequencyToPreset(freq: HabitFrequency): FreqPreset {
  if (freq.type === 'daily') return 'daily';
  if (freq.type === 'weekdays') return 'weekdays';
  if (freq.type === 'custom') {
    const dpw = freq.days_per_week ?? 3;
    const sd = freq.specific_days;
    if (!sd || sd.length === 0) {
      if (dpw === 3) return '3x_week';
    }
    return 'custom';
  }
  return 'daily';
}

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
  const [preset, setPreset] = useState<FreqPreset>('daily');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [specificDays, setSpecificDays] = useState<number[]>([]);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    setNameError(false);
    if (editHabit) {
      setNameAr(editHabit.name_ar ?? (editHabit.name && !editHabit.name_en ? editHabit.name : ''));
      setNameEn(editHabit.name_en ?? '');
      setIcon(editHabit.icon);
      setColor(editHabit.color);
      const freq = editHabit.frequency ?? { type: 'daily' };
      const p = frequencyToPreset(freq);
      setPreset(p);
      setDaysPerWeek(freq.days_per_week ?? 3);
      setSpecificDays(freq.specific_days ?? []);
    } else {
      setNameAr('');
      setNameEn('');
      setIcon(SHARED_ICONS[0]);
      setColor(SHARED_COLORS[0]);
      setPreset('daily');
      setDaysPerWeek(3);
      setSpecificDays([]);
    }
  }, [editHabit, visible]);

  const handleSave = () => {
    if (!nameAr.trim() && !nameEn.trim()) {
      setNameError(true);
      return;
    }
    const frequency = presetToFrequency(preset, daysPerWeek, specificDays);
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

  const dayLabels = lang === 'ar' ? DAY_KEYS_AR : DAY_KEYS_EN;

  const toggleDay = (day: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSpecificDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
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
          {FREQ_PRESETS.map(opt => {
            const isActive = preset === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPreset(opt.key);
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

        {/* Custom frequency options */}
        {preset === 'custom' && (
          <View style={freqStyles.customSection}>
            {/* Days per week selector */}
            <View style={[freqStyles.daysPerWeekRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[freqStyles.customLabel, { color: C.textSecondary }]}>
                {t('freqDaysPerWeek', lang)}:
              </Text>
              <View style={[freqStyles.daysPerWeekPicker, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {[1, 2, 3, 4, 5, 6, 7].map(n => {
                  const isActive = daysPerWeek === n && specificDays.length === 0;
                  return (
                    <Pressable
                      key={n}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setDaysPerWeek(n);
                        setSpecificDays([]);
                      }}
                      style={[
                        freqStyles.numChip,
                        {
                          backgroundColor: isActive ? C.tint + '18' : C.surface,
                          borderColor: isActive ? C.tint : C.border,
                        },
                      ]}
                    >
                      <Text style={[freqStyles.numChipText, { color: isActive ? C.tint : C.textSecondary }]}>
                        {n}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Specific days selector */}
            <Text style={[freqStyles.customLabel, { color: C.textSecondary, marginTop: 8 }]}>
              {t('freqSpecificDays', lang)}:
            </Text>
            <View style={[freqStyles.dayRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {Array.from({ length: 7 }, (_, i) => {
                const isActive = specificDays.includes(i);
                return (
                  <Pressable
                    key={i}
                    onPress={() => toggleDay(i)}
                    style={[
                      freqStyles.dayChip,
                      {
                        backgroundColor: isActive ? C.tint + '18' : C.surface,
                        borderColor: isActive ? C.tint : C.border,
                      },
                    ]}
                  >
                    <Text style={[freqStyles.dayChipText, { color: isActive ? C.tint : C.textSecondary }]}>
                      {dayLabels[i]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
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

const freqStyles = StyleSheet.create({
  row: { flexWrap: 'wrap', gap: 6 },
  chip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12, fontFamily: F.med },
  customSection: { marginTop: 10, gap: 6 },
  customLabel: { fontSize: 12, fontFamily: F.med },
  daysPerWeekRow: { alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  daysPerWeekPicker: { gap: 5, flexWrap: 'wrap' },
  numChip: {
    width: 30, height: 30, borderRadius: 8, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  numChipText: { fontSize: 13, fontFamily: F.bold },
  dayRow: { gap: 4, flexWrap: 'wrap', marginTop: 2 },
  dayChip: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  dayChipText: { fontSize: 11, fontFamily: F.bold },
});
