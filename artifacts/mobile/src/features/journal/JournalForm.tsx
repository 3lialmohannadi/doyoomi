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
import { Radius, Spacing } from '../../theme';

interface JournalFormProps {
  visible: boolean;
  onClose: () => void;
  editEntry?: JournalEntry | null;
}

const MOODS: { key: Mood; icon: string; color: string; labelKey: string }[] = [
  // ── Positive ──
  { key: 'happy',       icon: 'happy',                   color: '#00C48C', labelKey: 'moodHappy' },
  { key: 'excited',     icon: 'rocket-outline',           color: '#7C5CFC', labelKey: 'moodExcited' },
  { key: 'energetic',   icon: 'flash-outline',            color: '#FF9500', labelKey: 'moodEnergetic' },
  { key: 'grateful',    icon: 'heart-outline',            color: '#FF6B9D', labelKey: 'moodGrateful' },
  { key: 'optimistic',  icon: 'sunny-outline',            color: '#FFB800', labelKey: 'moodOptimistic' },
  { key: 'proud',       icon: 'ribbon-outline',           color: '#5E5CE6', labelKey: 'moodProud' },
  { key: 'satisfied',   icon: 'thumbs-up-outline',        color: '#4CAF82', labelKey: 'moodSatisfied' },
  { key: 'good',        icon: 'happy-outline',            color: '#34C759', labelKey: 'moodGood' },
  { key: 'reassured',   icon: 'shield-checkmark-outline', color: '#30B0C7', labelKey: 'moodReassured' },
  { key: 'comfortable', icon: 'leaf-outline',             color: '#65B040', labelKey: 'moodComfortable' },
  { key: 'calm',        icon: 'water-outline',            color: '#64B5F6', labelKey: 'moodCalm' },
  { key: 'surprised',   icon: 'star-outline',             color: '#BF5AF2', labelKey: 'moodSurprised' },
  // ── Neutral ──
  { key: 'neutral',     icon: 'remove-circle-outline',   color: '#8E8E93', labelKey: 'moodNeutral' },
  { key: 'hesitant',    icon: 'help-circle-outline',      color: '#AEAEB2', labelKey: 'moodHesitant' },
  { key: 'distracted',  icon: 'git-branch-outline',       color: '#C7B065', labelKey: 'moodDistracted' },
  { key: 'bored',       icon: 'time-outline',             color: '#A0A0A0', labelKey: 'moodBored' },
  { key: 'lazy',        icon: 'bed-outline',              color: '#B0A0D0', labelKey: 'moodLazy' },
  // ── Negative ──
  { key: 'tired',       icon: 'battery-half-outline',     color: '#FF8A50', labelKey: 'moodTired' },
  { key: 'exhausted',   icon: 'battery-dead-outline',     color: '#FF6B35', labelKey: 'moodExhausted' },
  { key: 'anxious',     icon: 'alert-circle-outline',     color: '#FF9F0A', labelKey: 'moodAnxious' },
  { key: 'stressed',    icon: 'thunderstorm-outline',     color: '#FF6B35', labelKey: 'moodStressed' },
  { key: 'scared',      icon: 'warning-outline',          color: '#C0664A', labelKey: 'moodScared' },
  { key: 'lonely',      icon: 'person-outline',           color: '#9B59B6', labelKey: 'moodLonely' },
  { key: 'frustrated',  icon: 'close-circle-outline',     color: '#E67E22', labelKey: 'moodFrustrated' },
  { key: 'sad',         icon: 'rainy-outline',            color: '#A855F7', labelKey: 'moodSad' },
  { key: 'bad',         icon: 'sad-outline',              color: '#FF4D6A', labelKey: 'moodBad' },
  { key: 'sick',        icon: 'medkit-outline',           color: '#E74C3C', labelKey: 'moodSick' },
  { key: 'depressed',   icon: 'cloud-outline',            color: '#7F8C8D', labelKey: 'moodDepressed' },
  { key: 'angry',       icon: 'flame-outline',            color: '#FF3B30', labelKey: 'moodAngry' },
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
                  <Ionicons name={m.icon as any} size={22} color={isActive ? m.color : C.textMuted} />
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
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
});
