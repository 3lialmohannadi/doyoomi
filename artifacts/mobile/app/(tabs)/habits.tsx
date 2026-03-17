import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, View, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { router, useLocalSearchParams } from 'expo-router';
import { useHabitsStore } from '../../src/store/habitsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Spacing, Radius, Shadow, F, PRIMARY, SECONDARY, GRADIENT_H, cardShadow } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { HabitForm } from '../../src/features/habits/HabitForm';
import { Toast } from '../../src/components/ui/Toast';
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog';
import { Habit } from '../../src/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HabitsScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { from } = useLocalSearchParams<{ from?: string }>();

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
      {/* Header */}
      <LinearGradient
        colors={[...GRADIENT_H]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.md }]}
      >
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />

        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              from === 'more' ? router.navigate('/settings') : router.back();
            }}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
            accessibilityRole="button"
          >
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{tFunc('habits')}</Text>
            <Text style={[styles.headerSub, { textAlign: 'center' }]}>
              {doneToday}/{habits.length} {tFunc('doneToday')}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setEditHabit(null);
              setShowForm(true);
            }}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('addHabit')}
          >
            <View style={styles.addBtnInner}>
              <Ionicons name="add" size={26} color={PRIMARY} />
            </View>
          </Pressable>
        </View>

        {habits.length > 0 && (
          <View style={[styles.progressWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: '#fff',
                    width: `${Math.round((doneToday / habits.length) * 100)}%` as any,
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
            <HabitCard
              item={item}
              isDoneToday={isDoneToday}
              isRTL={isRTL}
              C={C}
              tFunc={tFunc}
              onToggle={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                if (isDoneToday) {
                  uncompleteHabit(item.id);
                  showToast(tFunc('habitUncompleted'), 'info');
                } else {
                  completeHabit(item.id);
                  showToast(tFunc('habitCompleted'), 'success');
                }
              }}
              onEdit={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setEditHabit(item);
                setShowForm(true);
              }}
              onDelete={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setConfirmHabit(item);
              }}
            />
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

function HabitCard({
  item, isDoneToday, isRTL, C, tFunc, onToggle, onEdit, onDelete,
}: {
  item: Habit;
  isDoneToday: boolean;
  isRTL: boolean;
  C: any;
  tFunc: (k: string) => string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={[
        animStyle,
        styles.habitCard,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: isDoneToday ? item.color + '12' : C.card,
          borderColor: isDoneToday ? item.color + '60' : C.border,
        },
        Shadow.sm,
      ]}
      onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ checked: isDoneToday }}
      accessibilityLabel={item.name}
    >
      {/* Gradient accent bar */}
      <LinearGradient
        colors={isDoneToday ? [item.color, item.color + 'AA'] : [...GRADIENT_H]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.habitAccent}
      />

      {/* Card content */}
      <View style={[styles.habitBody, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* Icon */}
        <View style={[
          styles.habitIconWrap,
          {
            backgroundColor: isDoneToday ? item.color + '25' : item.color + '15',
            borderColor: isDoneToday ? item.color + '40' : 'transparent',
            borderWidth: 1,
          },
        ]}>
          <Ionicons
            name={(item.icon + (isDoneToday ? '' : '-outline')) as any}
            size={24}
            color={item.color}
          />
        </View>

        {/* Info */}
        <View style={[styles.habitInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text
            style={[
              styles.habitName,
              {
                color: isDoneToday ? item.color : C.text,
                textAlign: isRTL ? 'right' : 'left',
                textDecorationLine: isDoneToday ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <View style={[styles.habitMeta, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.streakBadge, { backgroundColor: '#FB923C' + '15', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons name="flame" size={12} color="#FB923C" />
              <Text style={styles.streakText}>{item.streak_days} {tFunc('days')}</Text>
            </View>

            {isDoneToday && (
              <View style={[styles.doneBadge, { backgroundColor: item.color + '15', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Ionicons name="checkmark-circle" size={12} color={item.color} />
                <Text style={[styles.doneBadgeText, { color: item.color }]}>{tFunc('doneToday')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={[styles.habitActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* Complete / Uncomplete toggle */}
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onToggle(); }}
            style={({ pressed }) => [
              styles.completeBtn,
              {
                borderColor: isDoneToday ? item.color : C.border,
                overflow: 'hidden',
                opacity: pressed ? 0.75 : 1,
                backgroundColor: isDoneToday ? 'transparent' : C.surface,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={isDoneToday ? tFunc('habitUncompleted') : tFunc('completeHabit')}
          >
            {isDoneToday && (
              <LinearGradient
                colors={[...GRADIENT_H]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Ionicons
              name={isDoneToday ? 'checkmark' : 'checkmark-outline'}
              size={18}
              color={isDoneToday ? '#fff' : C.textMuted}
            />
          </Pressable>

          {/* Edit */}
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onEdit(); }}
            style={({ pressed }) => [
              styles.smallActionBtn,
              { backgroundColor: C.tint + '12', borderColor: C.tint + '30', opacity: pressed ? 0.7 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('editHabit')}
          >
            <Ionicons name="pencil-outline" size={13} color={C.tint} />
          </Pressable>

          {/* Delete */}
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onDelete(); }}
            style={({ pressed }) => [
              styles.smallActionBtn,
              { backgroundColor: C.error + '12', borderColor: C.error + '30', opacity: pressed ? 0.7 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('deleteHabit')}
          >
            <Ionicons name="trash-outline" size={13} color={C.error} />
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor1: {
    position: 'absolute', right: -30, top: -30,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerDecor2: {
    position: 'absolute', left: 20, bottom: -10,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerRow: {
    alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 28, fontFamily: F.bold, color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: F.med, marginTop: 2 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
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
    fontSize: 13, fontFamily: F.bold, color: '#fff', minWidth: 40, textAlign: 'center',
  },

  habitCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    overflow: 'hidden',
  },
  habitAccent: { width: 4 },
  habitBody: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  habitIconWrap: {
    width: 50, height: 50, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  habitInfo: {
    flex: 1,
    gap: 5,
  },
  habitName: { fontSize: 16, fontFamily: F.med },
  habitMeta: { alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  streakBadge: {
    alignItems: 'center', gap: 3,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  streakText: { fontSize: 11, fontFamily: F.med, color: '#FB923C' },
  doneBadge: {
    alignItems: 'center', gap: 3,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  doneBadgeText: { fontSize: 11, fontFamily: F.med },

  habitActions: { alignItems: 'center', gap: 6 },
  completeBtn: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  smallActionBtn: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
});
