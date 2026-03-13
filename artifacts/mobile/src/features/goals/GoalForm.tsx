import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormModal, FormField, FormInput, FormSelect } from '../../components/ui/FormModal';
import { IconColorPicker } from '../../components/ui/IconColorPicker';
import { Goal, GoalType } from '../../types';
import { useGoalsStore } from '../../store/goalsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t } from '../../utils/i18n';
import { Spacing } from '../../theme';
import { SHARED_COLORS } from '../../constants/pickerOptions';

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

  const [title, setTitle] = useState('');
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
      setColor(SHARED_COLORS[0]);
    }
  }, [editGoal, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
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
        <FormInput
          value={title}
          onChangeText={(v) => { setTitle(v); if (v.trim()) setTitleError(false); }}
          placeholder={t('goalTitlePlaceholder', lang)}
          error={titleError}
        />
        {titleError && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={14} color={C.error} />
            <Text style={[styles.errorText, { color: C.error }]}>{t('fieldRequired', lang)}</Text>
          </View>
        )}
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

const styles = StyleSheet.create({
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
