import React, { useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { FormModal, FormField, FormInput, FormSelect, FormPressableInput } from '../../components/ui/FormModal';
import { BilingualNameField } from '../../components/ui/BilingualNameField';
import { IconColorPicker } from '../../components/ui/IconColorPicker';
import { FormDatePicker } from '../../components/ui/FormDatePicker';
import { Goal, GoalType } from '../../types';
import { useGoalsStore } from '../../store/goalsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t, resolveDisplayName } from '../../utils/i18n';
import { SHARED_COLORS } from '../../constants/pickerOptions';
import { Radius, F, Spacing } from '../../theme';

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

interface GoalFormProps {
  visible: boolean;
  onClose: () => void;
  editGoal?: Goal | null;
}

export function GoalForm({ visible, onClose, editGoal }: GoalFormProps) {
  const { addGoal, updateGoal } = useGoalsStore();
  const { profile } = useSettingsStore();
  const { C } = useAppTheme();
  const lang = profile.language;

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('monthly');
  const [targetValue, setTargetValue] = useState('10');
  const [currentValue, setCurrentValue] = useState('0');
  const [icon, setIcon] = useState('star');
  const [color, setColor] = useState(SHARED_COLORS[0]);
  const [deadline, setDeadline] = useState('');
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    setTitleError(false);
    setShowDeadlinePicker(false);
    if (editGoal) {
      setTitleAr(editGoal.title_ar ?? (editGoal.title && !editGoal.title_en ? editGoal.title : ''));
      setTitleEn(editGoal.title_en ?? '');
      setDescription(editGoal.description ?? '');
      setType(editGoal.type);
      setTargetValue(String(editGoal.target_value));
      setCurrentValue(String(editGoal.current_value));
      setIcon(editGoal.icon);
      setColor(editGoal.color);
      setDeadline(editGoal.deadline ?? '');
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescription('');
      setType('monthly');
      setTargetValue('10');
      setCurrentValue('0');
      setIcon('star');
      setColor(SHARED_COLORS[0]);
      setDeadline('');
    }
  }, [editGoal, visible]);

  const handleSave = () => {
    if (!titleAr.trim() && !titleEn.trim()) {
      setTitleError(true);
      return;
    }
    const data = {
      title: resolveDisplayName(titleAr, titleEn, lang, titleAr || titleEn),
      title_ar: titleAr.trim() || undefined,
      title_en: titleEn.trim() || undefined,
      description: description.trim() || undefined,
      type,
      target_value: Number(targetValue) || 10,
      current_value: Number(currentValue) || 0,
      icon,
      color,
      deadline: deadline || undefined,
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

  const displayDeadline = deadline
    ? lang === 'ar'
      ? (() => { const d = parseISO(deadline); return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`; })()
      : format(parseISO(deadline), 'MMM d, yyyy')
    : '';

  return (
    <FormModal
      visible={visible}
      title={editGoal ? t('editGoal', lang) : t('addGoal', lang)}
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
          placeholderAr="مثال: حفظ القرآن"
          placeholderEn="e.g. Learn a new skill"
        />
      </FormField>

      <FormField label={t('description', lang)}>
        <FormInput
          value={description}
          onChangeText={setDescription}
          placeholder={t('goalDescPlaceholder', lang)}
          multiline
        />
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

      <FormField label={t('goalDeadline', lang)}>
        <View>
          <View style={dlStyles.row}>
            <View style={{ flex: 1 }}>
              <FormPressableInput
                value={displayDeadline}
                placeholder={t('noDeadline', lang)}
                icon="calendar-outline"
                onPress={() => setShowDeadlinePicker(!showDeadlinePicker)}
              />
            </View>
            {deadline ? (
              <Pressable
                onPress={() => { setDeadline(''); setShowDeadlinePicker(false); }}
                style={[dlStyles.clearBtn, { backgroundColor: C.error + '14', borderColor: C.error + '30' }]}
                hitSlop={6}
              >
                <Ionicons name="close" size={15} color={C.error} />
              </Pressable>
            ) : null}
          </View>
          {showDeadlinePicker && (
            <FormDatePicker
              selected={deadline || new Date().toISOString().split('T')[0]}
              onSelect={(d) => { setDeadline(d); setShowDeadlinePicker(false); }}
              C={C}
              lang={lang}
              startOfWeek={profile.start_of_week}
            />
          )}
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

const dlStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  clearBtn: {
    width: 36, height: 36, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
});
