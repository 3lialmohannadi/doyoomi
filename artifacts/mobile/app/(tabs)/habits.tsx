import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, View, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { useHabitsStore } from '../../src/store/habitsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Spacing, Radius, Shadow } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { HabitForm } from '../../src/features/habits/HabitForm';
import { Toast } from '../../src/components/ui/Toast';
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog';
import { Habit } from '../../src/types';

export default function HabitsScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { habits, completeHabit, uncompleteHabit, deleteHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [confirmHabit, setConfirmHabit] = useState<Habit | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;
  const today = format(new Date(), 'yyyy-MM-dd');

  const doneToday = habits.filter(h => {
    const lastDate = h.last_completed_at ? format(new Date(h.last_completed_at), 'yyyy-MM-dd') : null;
    return lastDate === today;
  }).length;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <LinearGradient
        colors={['#A855F7', '#7C5CFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.md }]}
      >
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />

        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View>
            <Text style={[styles.headerTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('habits')}</Text>
            <Text style={[styles.headerSub, { textAlign: isRTL ? 'right' : 'left' }]}>
              {doneToday}/{habits.length} {tFunc('doneToday')}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setEditHabit(null);
              setShowForm(true);
            }}
            style={styles.addBtn}
          >
            <View style={styles.addBtnInner}>
              <Ionicons name="add" size={26} color="#A855F7" />
            </View>
          </Pressable>
        </View>

        {habits.length > 0 && (
          <View style={[styles.progressWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: '#fff',
                    width: `${Math.round((doneToday / habits.length) * 100)}%`,
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {Math.round((doneToday / habits.length) * 100)}%
            </Text>
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: bottomPad + 100, gap: Spacing.md }}
        renderItem={({ item }) => {
          const lastDate = item.last_completed_at
            ? format(new Date(item.last_completed_at), 'yyyy-MM-dd')
            : null;
          const isDoneToday = lastDate === today;

          return (
            <View
              style={[
                styles.habitCard,
                { backgroundColor: C.card, borderColor: isDoneToday ? item.color + '60' : C.border, flexDirection: isRTL ? 'row-reverse' : 'row' },
                Shadow.sm,
              ]}
            >
              <View style={[styles.habitAccent, { backgroundColor: item.color }]} />

              <View style={[styles.iconBox, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={(item.icon + '-outline') as any} size={22} color={item.color} />
              </View>

              <View style={[styles.habitInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.habitName, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={[styles.streakRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Ionicons name="flame" size={13} color="#FF6B35" />
                  <Text style={[styles.streakText, { color: '#FF6B35' }]}>
                    {item.streak_days} {tFunc('days')}
                  </Text>
                  {isDoneToday && (
                    <View style={[styles.doneBadge, { backgroundColor: item.color + '18', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Ionicons name="checkmark-circle" size={11} color={item.color} />
                      <Text style={[styles.doneBadgeText, { color: item.color }]}>
                        {tFunc('doneToday')}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={[styles.habitActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    if (isDoneToday) {
                      uncompleteHabit(item.id);
                      showToast(tFunc('habitUncompleted'), 'info');
                    } else {
                      completeHabit(item.id);
                      showToast(tFunc('habitCompleted'), 'success');
                    }
                  }}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isDoneToday ? item.color + '20' : C.surface,
                      borderColor: isDoneToday ? item.color : C.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={isDoneToday ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={18}
                    color={isDoneToday ? item.color : C.textMuted}
                  />
                </Pressable>

                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setEditHabit(item);
                    setShowForm(true);
                  }}
                  style={[styles.actionBtn, { backgroundColor: C.tint + '12', borderColor: C.tint + '30' }]}
                >
                  <Ionicons name="pencil-outline" size={15} color={C.tint} />
                </Pressable>

                <Pressable
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setConfirmHabit(item); }}
                  style={[styles.actionBtn, { backgroundColor: C.error + '12', borderColor: C.error + '30' }]}
                >
                  <Ionicons name="trash-outline" size={15} color={C.error} />
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="leaf-outline"
            title={tFunc('noHabits')}
            subtitle={tFunc('noHabitsSubtitle')}
          />
        )}
      />

      <HabitForm
        visible={showForm}
        onClose={() => { setShowForm(false); setEditHabit(null); }}
        editHabit={editHabit}
      />

      <ConfirmDialog
        visible={!!confirmHabit}
        title={tFunc('deleteHabit')}
        message={confirmHabit?.name}
        confirmLabel={tFunc('delete')}
        cancelLabel={tFunc('cancel')}
        type="danger"
        onConfirm={() => {
          if (confirmHabit) {
            deleteHabit(confirmHabit.id);
            showToast(tFunc('habitDeleted'), 'error');
          }
          setConfirmHabit(null);
        }}
        onCancel={() => setConfirmHabit(null)}
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

  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor1: {
    position: 'absolute', right: -30, top: -30,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerDecor2: {
    position: 'absolute', right: 50, top: 40,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerRow: {
    alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_500Medium', marginTop: 2 },
  addBtn: {},
  addBtnInner: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5,
  },
  progressWrap: {
    alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.lg,
  },
  progressTrack: {
    flex: 1, height: 6, borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: {
    fontSize: 13, fontFamily: 'Inter_700Bold', color: '#fff', minWidth: 36, textAlign: 'center',
  },

  habitCard: {
    alignItems: 'center', gap: Spacing.md,
    borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
    paddingVertical: Spacing.md, paddingRight: Spacing.md,
  },
  habitAccent: { width: 4, alignSelf: 'stretch' },
  iconBox: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  habitInfo: { flex: 1, gap: 3 },
  habitName: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  streakRow: { alignItems: 'center', gap: 4 },
  streakText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  doneBadge: {
    alignItems: 'center', gap: 3,
    borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 2,
    marginLeft: 4,
  },
  doneBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  habitActions: { gap: 6 },
  actionBtn: {
    width: 32, height: 32, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
});
