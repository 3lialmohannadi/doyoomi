import React, { useState, useMemo } from 'react';
import {
  FlatList, StyleSheet, Text, View, TextInput, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useJournalStore } from '../src/store/journalStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { Spacing, Radius, Shadow } from '../src/theme';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { t } from '../src/utils/i18n';
import { formatDate } from '../src/utils/date';
import { EmptyState } from '../src/components/ui/EmptyState';
import { JournalForm } from '../src/features/journal/JournalForm';
import { Toast } from '../src/components/ui/Toast';
import { ConfirmDialog } from '../src/components/ui/ConfirmDialog';
import { JournalEntry, Mood } from '../src/types';

const MOOD_CONFIG: Record<Mood, { icon: string; color: string }> = {
  excellent: { icon: 'happy',                  color: '#00C48C' },
  veryGood:  { icon: 'happy-outline',          color: '#4CAF82' },
  good:      { icon: 'thumbs-up-outline',      color: '#7C5CFC' },
  neutral:   { icon: 'remove-circle-outline',  color: '#FFB800' },
  tired:     { icon: 'bed-outline',            color: '#FF8A50' },
  stressed:  { icon: 'flash-outline',          color: '#FF6B35' },
  sad:       { icon: 'rainy-outline',          color: '#A855F7' },
  bad:       { icon: 'sad-outline',            color: '#FF4D6A' },
};

export default function JournalScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { entries, deleteEntry } = useJournalStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);
  const [confirmEntry, setConfirmEntry] = useState<JournalEntry | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const filteredEntries = useMemo(() => {
    let result = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags?.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [entries, search]);

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#9B6EF5', '#7C5CFC', '#FF6B9D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: topPad + Spacing.md }]}
      >
        <View style={styles.heroDecor1} />
        <View style={styles.heroDecor2} />
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel={tFunc('back')}
          >
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text style={[styles.heroTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('journal')}</Text>
            <Text style={[styles.heroSub, { textAlign: isRTL ? 'right' : 'left' }]}>{filteredEntries.length} {tFunc('entries')}</Text>
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setEditEntry(null); setShowForm(true); }}
            style={styles.addBtn}
          >
            <View style={styles.addBtnInner}>
              <Ionicons name="add" size={26} color="#7C5CFC" />
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: C.surface, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Ionicons name="search" size={16} color={C.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={tFunc('searchEntries')}
          placeholderTextColor={C.textMuted}
          textAlign={isRTL ? 'right' : 'left'}
          style={[styles.searchInput, { color: C.text }]}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={C.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Entries List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: bottomPad + 100, gap: Spacing.md }}
        renderItem={({ item }) => {
          const moodCfg = item.mood ? MOOD_CONFIG[item.mood] : null;

          return (
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEditEntry(item); setShowForm(true); }}
            >
              <View style={[styles.entryCard, { backgroundColor: C.card, borderColor: C.border }]}>
                {/* Date & mood header */}
                <View style={[styles.entryHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.entryDate, { color: C.textSecondary }]}>
                    {formatDate(item.date, lang)}
                  </Text>
                  {moodCfg && (
                    <View style={[styles.moodBadge, { backgroundColor: moodCfg.color + '18', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Ionicons name={moodCfg.icon as any} size={14} color={moodCfg.color} />
                      <Text style={[styles.moodText, { color: moodCfg.color }]}>
                        {tFunc(`mood${item.mood!.charAt(0).toUpperCase() + item.mood!.slice(1)}`)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Title */}
                {item.title && (
                  <Text style={[styles.entryTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                )}

                {/* Content preview */}
                <Text style={[styles.entryContent, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={3}>
                  {item.content}
                </Text>

                {/* Tags & actions */}
                <View style={[styles.entryFooter, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.tagsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    {item.tags?.slice(0, 3).map(tag => (
                      <View key={tag} style={[styles.tagPill, { backgroundColor: C.tint + '12' }]}>
                        <Text style={[styles.tagText, { color: C.tint }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.entryActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Pressable
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEditEntry(item); setShowForm(true); }}
                      style={[styles.actionBtn, { backgroundColor: C.tint + '12' }]}
                      hitSlop={4}
                    >
                      <Ionicons name="pencil-outline" size={14} color={C.tint} />
                    </Pressable>
                    <Pressable
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setConfirmEntry(item); }}
                      style={[styles.actionBtn, { backgroundColor: C.error + '12' }]}
                      hitSlop={4}
                    >
                      <Ionicons name="trash-outline" size={14} color={C.error} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="book-outline"
            title={search ? tFunc('noSearchResults') : tFunc('noEntries')}
            subtitle={!search ? tFunc('noEntriesSubtitle') : undefined}
          />
        )}
      />

      <JournalForm
        visible={showForm}
        onClose={() => { setShowForm(false); setEditEntry(null); }}
        editEntry={editEntry}
      />

      <ConfirmDialog
        visible={!!confirmEntry}
        title={tFunc('deleteEntry')}
        message={confirmEntry?.title || confirmEntry?.content.slice(0, 60)}
        confirmLabel={tFunc('delete')}
        cancelLabel={tFunc('cancel')}
        type="danger"
        onConfirm={() => {
          if (confirmEntry) {
            deleteEntry(confirmEntry.id);
            setToast({ message: tFunc('entryDeleted'), type: 'error' });
          }
          setConfirmEntry(null);
        }}
        onCancel={() => setConfirmEntry(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  heroDecor1: {
    position: 'absolute', right: -30, top: -30,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroDecor2: {
    position: 'absolute', right: 50, top: 40,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerRow: { alignItems: 'center', gap: Spacing.md },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#fff' },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_500Medium', marginTop: 2 },
  addBtn: {},
  addBtnInner: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5,
  },
  searchBar: {
    alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.lg, marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', padding: 0 },

  entryCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  entryHeader: {
    alignItems: 'center', justifyContent: 'space-between',
  },
  entryDate: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  moodBadge: {
    alignItems: 'center', gap: 4,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  moodText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  entryTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  entryContent: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  entryFooter: {
    alignItems: 'center', justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  tagsRow: { gap: 6, flex: 1 },
  tagPill: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  entryActions: { gap: 6 },
  actionBtn: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
});
