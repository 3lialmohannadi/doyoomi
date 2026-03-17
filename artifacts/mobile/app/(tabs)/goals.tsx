import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, View, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { router, useLocalSearchParams } from 'expo-router';
import { useGoalsStore } from '../../src/store/goalsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Spacing, Radius, F, PRIMARY, SECONDARY, GRADIENT_H, cardShadow, ColorScheme } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { GoalForm } from '../../src/features/goals/GoalForm';
import { Toast } from '../../src/components/ui/Toast';
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog';
import { Goal } from '../../src/types';

const GOAL_GRADIENTS: [string, string][] = [
  [PRIMARY, SECONDARY],
  ['#FB923C', '#FFB347'],
  ['#4ADE80', '#00B8A9'],
  ['#F87171', '#FF8E53'],
  ['#A78BFA', PRIMARY],
  ['#FFB800', '#FB923C'],
];

export default function GoalsScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { from } = useLocalSearchParams<{ from?: string }>();

  const { goals, deleteGoal, incrementProgress } = useGoalsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [confirmGoal, setConfirmGoal] = useState<Goal | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
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
            <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{tFunc('goals')}</Text>
            <Text style={[styles.headerSub, { textAlign: 'center' }]}>{goals.length} {tFunc('activeGoals')}</Text>
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setEditGoal(null); setShowForm(true); }}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('addGoal')}
          >
            <View style={styles.addBtnInner}>
              <Ionicons name="add" size={26} color={PRIMARY} />
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: bottomPad + 100, gap: Spacing.md }}
        renderItem={({ item, index }) => {
          const grad = GOAL_GRADIENTS[index % GOAL_GRADIENTS.length];
          const pct = item.target_value > 0 ? item.current_value / item.target_value : 0;
          const iconName = (item.icon + '-outline') as React.ComponentProps<typeof Ionicons>['name'];

          return (
            <View style={[styles.goalCard, { backgroundColor: C.card, borderColor: C.border }]}>
              <LinearGradient
                colors={grad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.goalTopLine}
              />

              <View style={styles.goalContent}>
                <View style={[styles.goalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <LinearGradient colors={grad} style={styles.goalIconBox}>
                    <Ionicons name={iconName} size={20} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.goalTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>{item.title}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: grad[0] + '18', alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
                      <Text style={[styles.typeText, { color: grad[0] }]}>{tFunc(item.type)}</Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEditGoal(item); setShowForm(true); }}
                    hitSlop={10}
                    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                    accessibilityRole="button"
                    accessibilityLabel={tFunc('editGoal')}
                  >
                    <Ionicons name="pencil" size={16} color={C.textMuted} />
                  </Pressable>
                </View>

                {item.description ? (
                  <Text style={[styles.goalDesc, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>{item.description}</Text>
                ) : null}

                <View style={[styles.progressRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.progressLabel, { color: C.textSecondary }]}>
                    {item.current_value} / {item.target_value}
                  </Text>
                  <Text style={[styles.progressPct, { color: grad[0] }]}>
                    {Math.round(pct * 100)}%
                  </Text>
                </View>
                <View style={[styles.track, { backgroundColor: C.borderLight }]}>
                  <LinearGradient
                    colors={grad}
                    start={{ x: isRTL ? 1 : 0, y: 0 }}
                    end={{ x: isRTL ? 0 : 1, y: 0 }}
                    style={[styles.trackFill, { width: `${Math.min(pct * 100, 100)}%`, alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
                  />
                </View>

                <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Pressable
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); incrementProgress(item.id); }}
                    style={({ pressed }) => [
                      styles.actionBtn,
                      { borderColor: grad[0] + '40', backgroundColor: grad[0] + '10', flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.7 : 1 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`+1 ${t('progress', lang)}`}
                  >
                    <Ionicons name="add-circle-outline" size={16} color={grad[0]} />
                    <Text style={[styles.actionText, { color: grad[0] }]}>+1 {t('progress', lang)}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setConfirmGoal(item); }}
                    style={({ pressed }) => [
                      styles.actionBtnIcon,
                      { borderColor: C.error + '30', backgroundColor: C.error + '10', opacity: pressed ? 0.7 : 1 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={tFunc('deleteGoal')}
                  >
                    <Ionicons name="trash-outline" size={16} color={C.error} />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="trophy-outline"
            title={tFunc('noGoals')}
            subtitle={tFunc('noGoalsSubtitle')}
          />
        )}
      />

      <GoalForm visible={showForm} onClose={() => { setShowForm(false); setEditGoal(null); }} editGoal={editGoal} />

      <ConfirmDialog
        visible={!!confirmGoal}
        title={tFunc('deleteGoal')}
        message={confirmGoal?.title}
        confirmLabel={tFunc('delete')}
        cancelLabel={tFunc('cancel')}
        type="danger"
        onConfirm={() => {
          if (confirmGoal) {
            deleteGoal(confirmGoal.id);
            showToast(tFunc('goalDeleted'), 'error');
          }
          setConfirmGoal(null);
        }}
        onCancel={() => setConfirmGoal(null)}
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
  headerRow: { alignItems: 'center', justifyContent: 'space-between' },
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
  goalCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  goalTopLine: { height: 4, width: '100%' },
  goalContent: { padding: Spacing.lg, gap: Spacing.md },
  goalHeader: { alignItems: 'center', gap: Spacing.md },
  goalIconBox: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  goalTitle: { fontSize: 16, fontFamily: F.bold, marginBottom: 4 },
  typeBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: 11, fontFamily: F.med },
  goalDesc: { fontSize: 13, fontFamily: F.reg, lineHeight: 18 },
  progressRow: { justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 12, fontFamily: F.med },
  progressPct: { fontSize: 20, fontFamily: F.bold },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 4 },
  actions: { gap: Spacing.sm },
  actionBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 1,
    paddingVertical: 8, gap: 5,
  },
  actionBtnIcon: {
    width: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 1,
  },
  actionText: { fontSize: 13, fontFamily: F.med },
});
