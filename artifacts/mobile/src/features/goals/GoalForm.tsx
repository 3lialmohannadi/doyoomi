import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { FormModal, FormField, FormInput, FormSelect } from '../../components/ui/FormModal';
import { Goal, GoalType } from '../../types';
import { useGoalsStore } from '../../store/goalsStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t } from '../../utils/i18n';
import { Radius, Spacing } from '../../theme';
import { SHARED_ICONS, SHARED_COLORS } from '../../constants/pickerOptions';

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
      setColor(SHARED_COLORS[0]);
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
        <FormInput value={title} onChangeText={setTitle} placeholder={t('goalTitlePlaceholder', lang)} />
      </FormField>

      <FormField label={t('description', lang)}>
        <FormInput value={description} onChangeText={setDescription} placeholder={t('goalDescPlaceholder', lang)} multiline />
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
