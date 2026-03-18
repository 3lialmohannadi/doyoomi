import React, { useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { FormModal, FormField, FormInput, FormPressableInput } from '../../components/ui/FormModal';
import { FormDatePicker } from '../../components/ui/FormDatePicker';
import { JournalEntry, Mood } from '../../types';
import { useJournalStore } from '../../store/journalStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { t } from '../../utils/i18n';
import { getTodayString } from '../../utils/date';
import { Radius, Spacing, F, PRIMARY, SECONDARY, WARM_ERROR, WARM_AMBER, WARM_CORAL, GRADIENT_H } from '../../theme';

interface JournalFormProps {
  visible: boolean;
  onClose: () => void;
  editEntry?: JournalEntry | null;
}

const MOODS: { key: Mood; icon: string; color: string; labelKey: string }[] = [
  // ── Positive ──
  { key: 'happy',       icon: 'happy',                   color: SECONDARY,  labelKey: 'moodHappy' },
  { key: 'excited',     icon: 'rocket-outline',           color: PRIMARY,    labelKey: 'moodExcited' },
  { key: 'energetic',   icon: 'flash-outline',            color: WARM_CORAL, labelKey: 'moodEnergetic' },
  { key: 'grateful',    icon: 'heart-outline',            color: SECONDARY,  labelKey: 'moodGrateful' },
  { key: 'optimistic',  icon: 'sunny-outline',            color: WARM_AMBER, labelKey: 'moodOptimistic' },
  { key: 'proud',       icon: 'ribbon-outline',           color: PRIMARY,    labelKey: 'moodProud' },
  { key: 'satisfied',   icon: 'thumbs-up-outline',        color: SECONDARY,  labelKey: 'moodSatisfied' },
  { key: 'good',        icon: 'happy-outline',            color: SECONDARY,  labelKey: 'moodGood' },
  { key: 'reassured',   icon: 'shield-checkmark-outline', color: SECONDARY,  labelKey: 'moodReassured' },
  { key: 'comfortable', icon: 'leaf-outline',             color: SECONDARY,  labelKey: 'moodComfortable' },
  { key: 'calm',        icon: 'water-outline',            color: SECONDARY,  labelKey: 'moodCalm' },
  { key: 'surprised',   icon: 'star-outline',             color: WARM_AMBER, labelKey: 'moodSurprised' },
  // ── Neutral ──
  { key: 'neutral',     icon: 'remove-circle-outline',   color: '#9B8072',   labelKey: 'moodNeutral' },
  { key: 'hesitant',    icon: 'help-circle-outline',      color: '#B09B87',  labelKey: 'moodHesitant' },
  { key: 'distracted',  icon: 'git-branch-outline',       color: '#B09B87',  labelKey: 'moodDistracted' },
  { key: 'bored',       icon: 'time-outline',             color: SECONDARY,  labelKey: 'moodBored' },
  { key: 'lazy',        icon: 'bed-outline',              color: '#B09B87',  labelKey: 'moodLazy' },
  // ── Negative ──
  { key: 'tired',       icon: 'battery-half-outline',     color: WARM_CORAL, labelKey: 'moodTired' },
  { key: 'exhausted',   icon: 'battery-dead-outline',     color: PRIMARY,    labelKey: 'moodExhausted' },
  { key: 'anxious',     icon: 'alert-circle-outline',     color: WARM_CORAL, labelKey: 'moodAnxious' },
  { key: 'stressed',    icon: 'thunderstorm-outline',     color: PRIMARY,    labelKey: 'moodStressed' },
  { key: 'scared',      icon: 'warning-outline',          color: WARM_CORAL, labelKey: 'moodScared' },
  { key: 'lonely',      icon: 'person-outline',           color: '#9B8072',  labelKey: 'moodLonely' },
  { key: 'frustrated',  icon: 'close-circle-outline',     color: WARM_CORAL, labelKey: 'moodFrustrated' },
  { key: 'sad',         icon: 'rainy-outline',            color: SECONDARY,  labelKey: 'moodSad' },
  { key: 'bad',         icon: 'sad-outline',              color: WARM_ERROR, labelKey: 'moodBad' },
  { key: 'sick',        icon: 'medkit-outline',           color: WARM_ERROR, labelKey: 'moodSick' },
  { key: 'depressed',   icon: 'cloud-outline',            color: '#9B8072',  labelKey: 'moodDepressed' },
  { key: 'angry',       icon: 'flame-outline',            color: WARM_ERROR, labelKey: 'moodAngry' },
];

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

export function JournalForm({ visible, onClose, editEntry }: JournalFormProps) {
  const { addEntry, updateEntry } = useJournalStore();
  const { profile } = useSettingsStore();
  const { C } = useAppTheme();
  const lang = profile.language;

  const [entryDate, setEntryDate] = useState(getTodayString());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [tagsStr, setTagsStr] = useState('');
  const [contentError, setContentError] = useState(false);

  useEffect(() => {
    setContentError(false);
    setShowDatePicker(false);
    if (editEntry) {
      setEntryDate(editEntry.date ?? getTodayString());
      setTitle(editEntry.title ?? '');
      setContent(editEntry.content);
      setMood(editEntry.mood);
      setTagsStr(editEntry.tags?.join(', ') ?? '');
    } else {
      setEntryDate(getTodayString());
      setTitle('');
      setContent('');
      setMood(undefined);
      setTagsStr('');
    }
  }, [editEntry, visible]);

  const handleSave = () => {
    if (!content.trim()) {
      setContentError(true);
      return;
    }

    const tags = tagsStr.trim()
      ? tagsStr.split(',').map(tag => tag.trim()).filter(Boolean)
      : undefined;

    const data = {
      date: entryDate,
      title: title.trim() || undefined,
      content: content.trim(),
      mood,
      tags,
    };

    if (editEntry) {
      updateEntry(editEntry.id, data);
    } else {
      addEntry(data);
    }
    onClose();
  };

  const displayDate = entryDate
    ? lang === 'ar'
      ? (() => { const d = parseISO(entryDate); return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`; })()
      : format(parseISO(entryDate), 'MMM d, yyyy')
    : '';

  return (
    <FormModal
      visible={visible}
      title={editEntry ? t('editEntry', lang) : t('addEntry', lang)}
      onClose={onClose}
      onSave={handleSave}
      saveLabel={t('save', lang)}
      cancelLabel={t('cancel', lang)}
    >
      <FormField label={t('date', lang)}>
        <FormPressableInput
          value={displayDate}
          placeholder={t('datePlaceholder', lang)}
          icon="calendar-outline"
          onPress={() => { setShowDatePicker(!showDatePicker); }}
        />
        {showDatePicker && (
          <FormDatePicker
            selected={entryDate}
            onSelect={(d: string) => { setEntryDate(d); setShowDatePicker(false); }}
            C={C}
            lang={lang}
            startOfWeek={profile.start_of_week}
          />
        )}
      </FormField>

      <FormField label={t('entryTitle', lang)}>
        <FormInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('entryTitlePlaceholder', lang)}
        />
      </FormField>

      <FormField label={t('entryContent', lang)}>
        <FormInput
          value={content}
          onChangeText={(v) => { setContent(v); if (v.trim()) setContentError(false); }}
          placeholder={t('entryContentPlaceholder', lang)}
          multiline
          error={contentError}
        />
      </FormField>

      <FormField label={t('mood', lang)}>
        <View style={styles.moodGrid}>
          {MOODS.map(m => {
            const isActive = mood === m.key;
            return (
              <View key={m.key} style={styles.moodCell}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMood(isActive ? undefined : m.key);
                  }}
                  style={[
                    styles.moodBtn,
                    {
                      backgroundColor: isActive ? m.color + '20' : C.surface,
                      borderColor: isActive ? m.color : C.border,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  <Ionicons name={m.icon as React.ComponentProps<typeof Ionicons>['name']} size={22} color={isActive ? m.color : C.textMuted} />
                  <Text style={[styles.moodLabel, { color: isActive ? m.color : C.textSecondary }]} numberOfLines={1}>
                    {t(m.labelKey, lang)}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </FormField>

      <FormField label={t('tags', lang)}>
        <FormInput
          value={tagsStr}
          onChangeText={setTagsStr}
          placeholder={t('tagsPlaceholder', lang)}
        />
      </FormField>
    </FormModal>
  );
}

const styles = StyleSheet.create({
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moodCell: {
    width: '20%',
    padding: 3,
  },
  moodBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: 2,
  },
  moodLabel: {
    fontSize: 11,
    fontFamily: F.med,
    textAlign: 'center',
  },
});
