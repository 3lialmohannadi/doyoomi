import React, { useState, useMemo } from 'react';
import {
  FlatList, StyleSheet, Text, View, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { useGoalsStore } from '../../src/store/goalsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Spacing, Radius, F, GRADIENT_H, GRADIENT_AMBER, GRADIENT_CYAN, GRADIENT_CORAL, GRADIENT_ROSE, GRADIENT_SAGE, GRADIENT_DARK_CARD, GRADIENT_DARK_HEADER, Shadow, ShadowDark } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { resolveDisplayName } from '../../src/utils/i18n';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { GoalForm } from '../../src/features/goals/GoalForm';
import { Toast } from '../../src/components/ui/Toast';
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog';
import { SwipeableRow } from '../../src/components/ui/SwipeableRow';
import { Goal } from '../../src/types';
import { StreakCelebration } from '../../src/components/ui/StreakCelebration';

const GOAL_GRADIENTS: readonly (readonly [string, string])[] = [
  GRADIENT_H,
  GRADIENT_AMBER,
  GRADIENT_CYAN,
  GRADIENT_CORAL,
  GRADIENT_ROSE,
  GRADIENT_SAGE,
];

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function formatDeadline(deadline: string, lang: string) {
  const d = parseISO(deadline);
  if (lang === 'ar') return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return format(d, 'MMM d, yyyy');
}

export default function GoalsScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { goals, deleteGoal, archiveGoal, unarchiveGoal, incrementProgress, decrementProgress } = useGoalsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [confirmGoal, setConfirmGoal] = useState<Goal | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [celebrationGoal, setCelebrationGoal] = useState<Goal | null>(null);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const activeGoals = useMemo(() => goals.filter(g => !g.is_archived), [goals]);
  const archivedGoals = useMemo(() => goals.filter(g => g.is_archived), [goals]);

  type ListItem =
    | { kind: 'goal'; goal: Goal; idx: number }
    | { kind: 'archived-header' }
    | { kind: 'archived-goal'; goal: Goal; idx: number };

  const listData = useMemo((): ListItem[] => {
    const items: ListItem[] = activeGoals.map((g, i) => ({ kind: 'goal', goal: g, idx: i }));
    if (archivedGoals.length > 0) {
      items.push({ kind: 'archived-header' });
      if (showArchived) {
        archivedGoals.forEach((g, i) => items.push({ kind: 'archived-goal', goal: g, idx: i }));
      }
    }
    return items;
  }, [activeGoals, archivedGoals, showArchived]);

  const avgProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, g) => sum + (g.target_value > 0 ? Math.min(g.current_value / g.target_value, 1) : 0), 0) / activeGoals.length
    : 0;
  const pctDone = Math.round(avgProgress * 100);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const today = new Date();

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
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
            <Text style={[styles.headerSub, { textAlign: 'center', color: 'rgba(255,255,255,0.75)' }]}>
              {activeGoals.length} {tFunc('activeGoals')}
            </Text>
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

        {activeGoals.length > 0 && (
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
        data={listData}
        keyExtractor={(item) => {
          if (item.kind === 'archived-header') return 'archived-header';
          return item.goal.id + '-' + item.kind;
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: bottomPad + 100, gap: Spacing.md }}
        renderItem={({ item }) => {
          if (item.kind === 'archived-header') {
            return (
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowArchived(v => !v); }}
                style={[styles.archivedHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                accessibilityRole="button"
              >
                <Ionicons name="archive-outline" size={16} color={C.textMuted} />
                <Text style={[styles.archivedHeaderText, { color: C.textMuted, flex: 1, textAlign: isRTL ? 'right' : 'left' }]}>
                  {tFunc('archivedGoals')} ({archivedGoals.length})
                </Text>
                <Ionicons name={showArchived ? 'chevron-up' : 'chevron-down'} size={16} color={C.textMuted} />
              </Pressable>
            );
          }

          const goal = item.goal;
          const isArchived = item.kind === 'archived-goal';
          const gradIdx = item.idx;
          const grad = GOAL_GRADIENTS[gradIdx % GOAL_GRADIENTS.length];
          const pct = goal.target_value > 0 ? goal.current_value / goal.target_value : 0;
          const iconName = (goal.icon + '-outline') as React.ComponentProps<typeof Ionicons>['name'];
          const isCompleted = goal.current_value >= goal.target_value;

          const daysLeft = goal.deadline
            ? differenceInCalendarDays(parseISO(goal.deadline), today)
            : null;
          const isOverdueDeadline = daysLeft !== null && daysLeft < 0 && !isCompleted;
          const isDueSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && !isCompleted;

          const cardContent = (
            <View style={[
              styles.goalCard,
              { borderColor: grad[0] + '30', overflow: 'hidden' },
              isDark ? ShadowDark.sm : Shadow.sm,
              isArchived && { opacity: 0.75 },
            ]}>
              {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
              {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}

              <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.goalTopLine} />

              <View style={styles.goalContent}>
                <View style={[styles.goalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <LinearGradient colors={grad} style={styles.goalIconBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Ionicons name={iconName} size={22} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.goalTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                      {resolveDisplayName(goal.title_ar, goal.title_en, lang, goal.title)}
                    </Text>
                    <View style={[styles.badgesRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <View style={[styles.typeBadge, { backgroundColor: grad[0] + '18' }]}>
                        <Text style={[styles.typeText, { color: grad[0] }]}>{tFunc(goal.type)}</Text>
                      </View>
                      {isCompleted && (
                        <View style={[styles.typeBadge, { backgroundColor: C.success + '18' }]}>
                          <Ionicons name="checkmark-circle" size={11} color={C.success} />
                          <Text style={[styles.typeText, { color: C.success }]}>{tFunc('done')}</Text>
                        </View>
                      )}
                      {isArchived && (
                        <View style={[styles.typeBadge, { backgroundColor: C.textMuted + '20' }]}>
                          <Ionicons name="archive" size={11} color={C.textMuted} />
                          <Text style={[styles.typeText, { color: C.textMuted }]}>{tFunc('archived')}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={[styles.headerActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    {!isArchived ? (
                      <Pressable
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEditGoal(goal); setShowForm(true); }}
                        hitSlop={10}
                        style={({ pressed }) => [styles.editIconBtn, { backgroundColor: grad[0] + '12', opacity: pressed ? 0.6 : 1 }]}
                        accessibilityRole="button"
                        accessibilityLabel={tFunc('editGoal')}
                      >
                        <Ionicons name="pencil" size={14} color={grad[0]} />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); unarchiveGoal(goal.id); showToast(tFunc('goalUnarchived'), 'info'); }}
                        hitSlop={10}
                        style={({ pressed }) => [styles.editIconBtn, { backgroundColor: C.textMuted + '10', opacity: pressed ? 0.6 : 1 }]}
                        accessibilityRole="button"
                        accessibilityLabel={tFunc('restoreGoal')}
                      >
                        <Ionicons name="arrow-undo-outline" size={14} color={C.textMuted} />
                      </Pressable>
                    )}
                  </View>
                </View>

                {goal.description ? (
                  <Text style={[styles.goalDesc, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
                    {goal.description}
                  </Text>
                ) : null}

                {goal.deadline && (
                  <View style={[styles.deadlineRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Ionicons name="calendar-outline" size={13} color={isOverdueDeadline ? C.error : isDueSoon ? '#F97316' : C.textMuted} />
                    <Text style={[styles.deadlineText, { color: isOverdueDeadline ? C.error : isDueSoon ? '#F97316' : C.textMuted }]}>
                      {formatDeadline(goal.deadline, lang)}
                      {daysLeft !== null && !isCompleted && (
                        isOverdueDeadline
                          ? ` · ${tFunc('overdue')}`
                          : ` · ${Math.abs(daysLeft)} ${tFunc('daysLeft')}`
                      )}
                    </Text>
                  </View>
                )}

                <View style={[styles.progressRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.progressLabel, { color: C.textSecondary }]}>
                    {goal.current_value} / {goal.target_value}
                  </Text>
                  <Text style={[styles.progressPct, { color: grad[0] }]}>
                    {Math.round(pct * 100)}%
                  </Text>
                </View>

                <View style={[styles.track, { backgroundColor: grad[0] + '18' }]}>
                  <LinearGradient
                    colors={grad}
                    start={{ x: isRTL ? 1 : 0, y: 0 }}
                    end={{ x: isRTL ? 0 : 1, y: 0 }}
                    style={[styles.trackFill, { width: `${Math.min(pct * 100, 100)}%`, alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
                  />
                </View>

                {!isArchived && (
                  <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <Pressable
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); decrementProgress(goal.id); }}
                      style={({ pressed }) => [styles.decrBtn, { borderColor: grad[0] + '35', backgroundColor: grad[0] + '10', opacity: pressed ? 0.7 : 1 }]}
                      accessibilityRole="button"
                      accessibilityLabel="-1"
                    >
                      <Ionicons name="remove" size={18} color={grad[0]} />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        const wasComplete = goal.current_value >= goal.target_value;
                        incrementProgress(goal.id);
                        if (!wasComplete && goal.current_value + 1 >= goal.target_value) {
                          setCelebrationGoal(goal);
                        }
                      }}
                      style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.85 : 1, overflow: 'hidden' }]}
                      accessibilityRole="button"
                      accessibilityLabel="+1"
                    >
                      <LinearGradient colors={grad} start={{ x: isRTL ? 1 : 0, y: 0 }} end={{ x: isRTL ? 0 : 1, y: 0 }} style={StyleSheet.absoluteFill} />
                      <Ionicons name="add" size={18} color="#fff" />
                      <Text style={styles.actionText}>+1</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          );

          if (isArchived) {
            return cardContent;
          }

          return (
            <SwipeableRow
              isRTL={isRTL}
              onComplete={() => { archiveGoal(goal.id); showToast(tFunc('goalArchived'), 'info'); }}
              onDelete={() => setConfirmGoal(goal)}
              completeLabel={tFunc('archive')}
              deleteLabel={tFunc('delete')}
              completeIcon="archive-outline"
              completeColor="#7C3AED"
              completeHaptic="light"
            >
              {cardContent}
            </SwipeableRow>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="trophy-outline"
            title={tFunc('noGoals')}
            subtitle={tFunc('noGoalsSubtitle')}
            gradient={['#8B5CF6', '#EC4899']}
            actionLabel={tFunc('addGoal')}
            onAction={() => { setEditGoal(null); setShowForm(true); }}
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

      <StreakCelebration
        visible={!!celebrationGoal}
        habitName={celebrationGoal ? resolveDisplayName(celebrationGoal.title_ar, celebrationGoal.title_en, lang, celebrationGoal.title) : ''}
        streakDays={100}
        lang={lang}
        onDismiss={() => setCelebrationGoal(null)}
        onArchive={celebrationGoal ? () => {
          archiveGoal(celebrationGoal.id);
          showToast(tFunc('goalArchived'), 'info');
          setCelebrationGoal(null);
        } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
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
  archivedHeader: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  archivedHeaderText: { fontSize: 14, fontFamily: F.bold },
  goalCard: {
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  goalTopLine: { height: 5, width: '100%' },
  goalContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md },
  goalHeader: { alignItems: 'center', gap: Spacing.md },
  goalIconBox: {
    width: 46, height: 46, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  headerActions: { gap: 6 },
  editIconBtn: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  goalTitle: { fontSize: 17, fontFamily: F.black, marginBottom: 4 },
  badgesRow: { gap: 4, flexWrap: 'wrap', alignItems: 'center' },
  typeBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 3 },
  typeText: { fontSize: 11, fontFamily: F.bold },
  goalDesc: { fontSize: 13, fontFamily: F.reg, lineHeight: 18 },
  deadlineRow: { gap: 5, alignItems: 'center' },
  deadlineText: { fontSize: 12, fontFamily: F.med },
  progressRow: { justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 13, fontFamily: F.med },
  progressPct: { fontSize: 22, fontFamily: F.black },
  track: { height: 12, borderRadius: 6, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 6 },
  actions: { gap: Spacing.sm },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md,
    paddingVertical: 11, gap: 6,
  },
  decrBtn: {
    width: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 1.5,
    paddingVertical: 10,
  },
  actionBtnIcon: {
    width: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 1.5,
    paddingVertical: 10,
  },
  actionText: { fontSize: 14, fontFamily: F.bold, color: '#fff' },
});
