import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, View, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useGoalsStore } from '../../src/store/goalsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Colors, Spacing, Radius, Shadow } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { GoalForm } from '../../src/features/goals/GoalForm';
import { Goal } from '../../src/types';

const GOAL_GRADIENTS: [string, string][] = [
  ['#7C5CFC', '#FF6B9D'],
  ['#FF6B35', '#FFB347'],
  ['#00C48C', '#00B8A9'],
  ['#FF4D6A', '#FF8E53'],
  ['#A855F7', '#7C5CFC'],
  ['#FFB800', '#FF6B35'],
];

const GOAL_ICONS: Record<string, string> = {
  book: 'book', fitness: 'fitness', card: 'card', language: 'language',
  star: 'star', heart: 'heart', trophy: 'trophy', rocket: 'rocket', leaf: 'leaf', water: 'water',
};

export default function GoalsScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { goals, deleteGoal, incrementProgress, updateGoal } = useGoalsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;

  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={['#7C5CFC', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.md }]}
      >
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>{tFunc('goals')}</Text>
            <Text style={styles.headerSub}>{goals.length} {tFunc('activeGoals')}</Text>
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setEditGoal(null); setShowForm(true); }}
            style={styles.addBtn}
          >
            <View style={styles.addBtnInner}>
              <Ionicons name="add" size={26} color="#7C5CFC" />
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
          const iconName = ((GOAL_ICONS[item.icon] ?? 'star') + '-outline') as any;

          return (
            <View style={[styles.goalCard, { backgroundColor: C.card, borderColor: C.border }]}>
              {/* Top accent line */}
              <LinearGradient
                colors={grad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.goalTopLine}
              />

              <View style={styles.goalContent}>
                <View style={styles.goalHeader}>
                  <LinearGradient colors={grad} style={styles.goalIconBox}>
                    <Ionicons name={iconName} size={20} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.goalTitle, { color: C.text }]} numberOfLines={1}>{item.title}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: grad[0] + '18' }]}>
                      <Text style={[styles.typeText, { color: grad[0] }]}>{tFunc(item.type)}</Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setEditGoal(item); setShowForm(true); }}
                    hitSlop={10}
                  >
                    <Ionicons name="pencil" size={16} color={C.textMuted} />
                  </Pressable>
                </View>

                {item.description ? (
                  <Text style={[styles.goalDesc, { color: C.textSecondary }]} numberOfLines={2}>{item.description}</Text>
                ) : null}

                {/* Progress */}
                <View style={styles.progressRow}>
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
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.trackFill, { width: `${Math.min(pct * 100, 100)}%` }]}
                  />
                </View>

                {/* Action buttons */}
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); incrementProgress(item.id); }}
                    style={[styles.actionBtn, { borderColor: grad[0] + '40', backgroundColor: grad[0] + '10' }]}
                  >
                    <Ionicons name="add-circle-outline" size={16} color={grad[0]} />
                    <Text style={[styles.actionText, { color: grad[0] }]}>+1 {t('progress', lang)}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); deleteGoal(item.id); }}
                    style={[styles.actionBtnIcon, { borderColor: C.error + '30', backgroundColor: C.error + '10' }]}
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_500Medium', marginTop: 2 },
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
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  goalTopLine: { height: 4, width: '100%' },
  goalContent: { padding: Spacing.lg, gap: Spacing.md },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  goalIconBox: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  goalTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  typeBadge: { alignSelf: 'flex-start', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  goalDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  progressPct: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 4 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 1,
    paddingVertical: 8, gap: 5,
  },
  actionBtnIcon: {
    width: 40, alignItems: 'center', justifyContent: 'center',
    borderRadius: Radius.md, borderWidth: 1,
  },
  actionText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
});
