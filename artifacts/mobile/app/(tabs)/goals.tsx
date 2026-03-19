import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, View, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { router } from 'expo-router';
import { useGoalsStore } from '../../src/store/goalsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Spacing, Radius, F, PRIMARY, SECONDARY, GRADIENT_H, GRADIENT_AMBER, GRADIENT_CYAN, GRADIENT_CORAL, GRADIENT_ROSE, GRADIENT_SAGE, ColorScheme, GRADIENT_DARK_CARD, GRADIENT_DARK_HEADER } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { GoalForm } from '../../src/features/goals/GoalForm';
import { Toast } from '../../src/components/ui/Toast';
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog';
import { Goal } from '../../src/types';

const GOAL_GRADIENTS: readonly (readonly [string, string])[] = [
  GRADIENT_H,
  GRADIENT_AMBER,
  GRADIENT_CYAN,
  GRADIENT_CORAL,
  GRADIENT_ROSE,
  GRADIENT_SAGE,
];

export default function GoalsScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
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

  const avgProgress = goals.length > 0
    ? goals.reduce((sum, g) => sum + (g.target_value > 0 ? Math.min(g.current_value / g.target_value, 1) : 0), 0) / goals.length
    : 0;
  const pctDone = Math.round(avgProgress * 100);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header — Purple/Rose gradient for distinct Goals personality */}
      <LinearGradient
        colors={isDark ? [...GRADIENT_DARK_HEADER] : ['#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.md }, isDark && styles.headerDark]}
      >
        {!isDark && <View style={styles.headerDecor1} />}
        {!isDark && <View style={styles.headerDecor2} />}
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ width: 46 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.headerTitle, { textAlign: 'center', color: '#fff' }]}>{tFunc('goals')}</Text>
            <Text style={[styles.headerSub, { textAlign: 'center', color: 'rgba(255,255,255,0.75)' }]}>{goals.length} {tFunc('activeGoals')}</Text>
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setEditGoal(null); setShowForm(true); }}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('addGoal')}
          >
            <View style={[styles.addBtnInner, isDark && { backgroundColor: C.surfaceElevated, borderColor: 'rgba(129,140,248,0.2)', borderWidth: 1 }]}>
              <Ionicons name="add" size={26} color={isDark ? C.tintSecondary : '#8B5CF6'} />
            </View>
          </Pressable>
        </View>
        {goals.length > 0 && (
          <View style={styles.headerProgress}>
            <View style={[styles.headerProgressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.22)' }]}>
              <LinearGradient
                colors={isDark ? [C.tint, C.tintSecondary] : ['#fff', 'rgba(255,255,255,0.8)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.headerProgressFill, { width: `${pctDone}%` as `${number}%` }]}
              />
            </View>
            <Text style={[styles.headerProgressLabel, { color: isDark ? C.tint : '#fff' }]}>{pctDone}% {tFunc('completed')}</Text>
          </View>
        )}
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
            <View style={[
              styles.goalCard,
              { borderColor: grad[0] + '30', overflow: 'hidden' },
              {
                shadowColor: grad[0],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.3 : 0.10,
                shadowRadius: 14,
                elevation: 5,
              },
            ]}>
              {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
              {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}

              {/* Bold colored top stripe */}
              <LinearGradient
                colors={grad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.goalTopLine}
              />

              <View style={styles.goalContent}>
                <View style={[styles.goalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <LinearGradient colors={grad} style={styles.goalIconBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Ionicons name={iconName} size={22} color="#fff" />
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
                    style={({ pressed }) => [styles.editIconBtn, { backgroundColor: grad[0] + '12', opacity: pressed ? 0.6 : 1 }]}
                    accessibilityRole="button"
                    accessibilityLabel={tFunc('editGoal')}
                  >
                    <Ionicons name="pencil" size={14} color={grad[0]} />
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

                {/* Bold progress bar */}
                <View style={[styles.track, { backgroundColor: grad[0] + '18' }]}>
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
                      { borderColor: grad[0] + '40', backgroundColor: grad[0] + '12', flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.7 : 1 },
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
            gradient={['#8B5CF6', '#EC4899']}
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
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(129,140,248,0.08)',
  },
  headerDecor1: {
    position: 'absolute', right: -40, top: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  headerDecor2: {
    position: 'absolute', right: 60, top: 50,
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerRow: { alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 30, fontFamily: F.black },
  headerSub: { fontSize: 13, fontFamily: F.med, marginTop: 2 },
  headerProgress: { marginTop: Spacing.md, gap: 6 },
  headerProgressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  headerProgressFill: { height: '100%', borderRadius: 4 },
  headerProgressLabel: { fontSize: 11, fontFamily: F.bold, textAlign: 'center' },
  addBtn: {},
  addBtnInner: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  goalCard: {
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  goalTopLine: { height: 5, width: '100%' },
  goalContent: { padding: Spacing.lg, gap: Spacing.md },
  goalHeader: { alignItems: 'center', gap: Spacing.md },
  goalIconBox: {
    width: 46, height: 46, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  editIconBtn: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  goalTitle: { fontSize: 17, fontFamily: F.black, marginBottom: 4 },
  typeBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: 11, fontFamily: F.bold },
  goalDesc: { fontSize: 13, fontFamily: F.reg, lineHeight: 18 },
  progressRow: { justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 13, fontFamily: F.med },
  progressPct: { fontSize: 22, fontFamily: F.black },
  track: { height: 12, borderRadius: 6, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 6 },
  actions: { gap: Spacing.sm },
  actionBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 1.5,
    paddingVertical: 10, gap: 5,
  },
  actionBtnIcon: {
    width: 42, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 1.5,
    paddingVertical: 10,
  },
  actionText: { fontSize: 13, fontFamily: F.bold },
});
