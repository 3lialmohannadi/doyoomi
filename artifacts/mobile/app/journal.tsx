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
import { Spacing, Radius, Shadow, F, PRIMARY, SECONDARY, GRADIENT_H, GRADIENT_D, BOLD_GREEN, BOLD_GOLD, BOLD_ORANGE, BOLD_RED, BOLD_CYAN, BOLD_TEAL } from '../src/theme';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { t } from '../src/utils/i18n';
import { formatDate } from '../src/utils/date';
import { EmptyState } from '../src/components/ui/EmptyState';
import { JournalForm } from '../src/features/journal/JournalForm';
import { Toast } from '../src/components/ui/Toast';
import { ConfirmDialog } from '../src/components/ui/ConfirmDialog';
import { JournalEntry, Mood } from '../src/types';

const MOOD_CONFIG: Partial<Record<Mood, { icon: string; color: string }>> = {
  happy:       { icon: 'happy',                   color: BOLD_GREEN },
  excited:     { icon: 'rocket-outline',           color: BOLD_GOLD },
  energetic:   { icon: 'flash-outline',            color: BOLD_ORANGE },
  grateful:    { icon: 'heart-outline',            color: '#EC4899' },
  optimistic:  { icon: 'sunny-outline',            color: BOLD_GOLD },
  proud:       { icon: 'ribbon-outline',           color: PRIMARY },
  satisfied:   { icon: 'thumbs-up-outline',        color: BOLD_GREEN },
  good:        { icon: 'happy-outline',            color: BOLD_GREEN },
  reassured:   { icon: 'shield-checkmark-outline', color: BOLD_CYAN },
  comfortable: { icon: 'leaf-outline',             color: BOLD_GREEN },
  calm:        { icon: 'water-outline',            color: BOLD_TEAL },
  surprised:   { icon: 'star-outline',             color: BOLD_GOLD },
  neutral:     { icon: 'remove-circle-outline',    color: '#9090A0' },
  hesitant:    { icon: 'help-circle-outline',      color: '#7B7B90' },
  distracted:  { icon: 'git-branch-outline',       color: '#9090A0' },
  bored:       { icon: 'time-outline',             color: SECONDARY },
  lazy:        { icon: 'bed-outline',              color: '#7B7B90' },
  tired:       { icon: 'battery-half-outline',     color: BOLD_ORANGE },
  exhausted:   { icon: 'battery-dead-outline',     color: PRIMARY },
  anxious:     { icon: 'alert-circle-outline',     color: BOLD_ORANGE },
  stressed:    { icon: 'thunderstorm-outline',     color: PRIMARY },
  scared:      { icon: 'warning-outline',          color: BOLD_RED },
  lonely:      { icon: 'person-outline',           color: '#9090A0' },
  frustrated:  { icon: 'close-circle-outline',     color: BOLD_RED },
  sad:         { icon: 'rainy-outline',            color: SECONDARY },
  bad:         { icon: 'sad-outline',              color: BOLD_RED },
  sick:        { icon: 'medkit-outline',           color: BOLD_RED },
  depressed:   { icon: 'cloud-outline',            color: '#9090A0' },
  angry:       { icon: 'flame-outline',            color: BOLD_RED },
};

export default function JournalScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
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
      {/* Header — Rose/Pink gradient for distinct Journal personality */}
      <LinearGradient
        colors={isDark ? ['#1A1A2E', '#0B0B14'] : ['#EC4899', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: topPad + Spacing.md }, isDark && styles.heroDark]}
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
            <View style={[styles.addBtnInner, isDark && { backgroundColor: C.surfaceElevated, borderColor: 'rgba(129,140,248,0.2)', borderWidth: 1 }]}>
              <Ionicons name="add" size={26} color={isDark ? C.tint : '#EC4899'} />
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
              <View style={[
                styles.entryCard,
                {
                  backgroundColor: C.card,
                  borderColor: moodCfg ? moodCfg.color + '28' : C.border,
                  shadowColor: moodCfg ? moodCfg.color : C.tint,
                },
              ]}>
                {/* Left accent bar with mood color */}
                <View style={[styles.entryAccent, { backgroundColor: moodCfg ? moodCfg.color : C.tint }]} />

                <View style={{ flex: 1, gap: Spacing.sm }}>
                  {/* Date & mood header */}
                  <View style={[styles.entryHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.entryDate, { color: C.textMuted }]}>
                      {formatDate(item.date, lang)}
                    </Text>
                    {moodCfg && (
                      <View style={[styles.moodBadge, { backgroundColor: moodCfg.color + '18', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Ionicons name={moodCfg.icon as React.ComponentProps<typeof Ionicons>['name']} size={14} color={moodCfg.color} />
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
                        <View key={tag} style={[styles.tagPill, { backgroundColor: C.tint + '14' }]}>
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
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="book-outline"
            title={search ? tFunc('noSearchResults') : tFunc('noEntries')}
            subtitle={!search ? tFunc('noEntriesSubtitle') : undefined}
            gradient={['#EC4899', '#8B5CF6']}
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
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative',
    overflow: 'hidden',
  },
  heroDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(129,140,248,0.08)',
  },
  heroDecor1: {
    position: 'absolute', right: -40, top: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroDecor2: {
    position: 'absolute', right: 60, top: 50,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerRow: { alignItems: 'center', gap: Spacing.md },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 30, fontFamily: F.black, color: '#fff' },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: F.med, marginTop: 2 },
  addBtn: {},
  addBtnInner: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  searchBar: {
    alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.lg, marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: F.reg, padding: 0 },

  entryCard: {
    borderRadius: Radius.xl, borderWidth: 1.5,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  entryAccent: { width: 5, alignSelf: 'stretch' },
  entryHeader: {
    alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingBottom: 0,
  },
  entryDate: { fontSize: 13, fontFamily: F.med },
  moodBadge: {
    alignItems: 'center', gap: 4,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  moodText: { fontSize: 11, fontFamily: F.bold },
  entryTitle: { fontSize: 17, fontFamily: F.black, paddingHorizontal: Spacing.md },
  entryContent: { fontSize: 14, fontFamily: F.reg, lineHeight: 20, paddingHorizontal: Spacing.md },
  entryFooter: {
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.md,
  },
  tagsRow: { gap: 6, flex: 1 },
  tagPill: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 11, fontFamily: F.bold },
  entryActions: { gap: 6 },
  actionBtn: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
});
