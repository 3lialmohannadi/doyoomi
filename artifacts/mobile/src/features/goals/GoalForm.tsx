import React, { useState, useEffect } from 'react';
import { FormModal, FormField, FormInput, FormSelect } from '../../components/ui/FormModal';
import { BilingualNameField } from '../../components/ui/BilingualNameField';
import { IconColorPicker } from '../../components/ui/IconColorPicker';
import { Goal, GoalType } from '../../types';
import { useGoalsStore } from '../../store/goalsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { t, resolveDisplayName } from '../../utils/i18n';
import { SHARED_COLORS } from '../../constants/pickerOptions';

interface GoalFormProps {
  visible: boolean;
  onClose: () => void;
  editGoal?: Goal | null;
}

export function GoalForm({ visible, onClose, editGoal }: GoalFormProps) {
  const { addGoal, updateGoal } = useGoalsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('monthly');
  const [targetValue, setTargetValue] = useState('10');
  const [currentValue, setCurrentValue] = useState('0');
  const [icon, setIcon] = useState('star');
  const [color, setColor] = useState(SHARED_COLORS[0]);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    setTitleError(false);
    if (editGoal) {
      setTitleAr(editGoal.title_ar ?? (editGoal.title && !editGoal.title_en ? editGoal.title : ''));
      setTitleEn(editGoal.title_en ?? '');
      setDescription(editGoal.description ?? '');
      setType(editGoal.type);
      setTargetValue(String(editGoal.target_value));
      setCurrentValue(String(editGoal.current_value));
      setIcon(editGoal.icon);
      setColor(editGoal.color);
    } else {
      setTitleAr('');
      setTitleEn('');
      setDescription('');
      setType('monthly');
      setTargetValue('10');
      setCurrentValue('0');
      setIcon('star');
      setColor(SHARED_COLORS[0]);
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
