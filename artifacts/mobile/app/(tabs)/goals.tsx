import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, View, useColorScheme, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGoalsStore } from '../../src/store/goalsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Colors, Spacing, Typography } from '../../src/theme';
import { t } from '../../src/utils/i18n';
import { GoalCard } from '../../src/components/ui/GoalCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { AddButton } from '../../src/components/ui/AddButton';
import { GoalForm } from '../../src/features/goals/GoalForm';
import { Goal } from '../../src/types';

export default function GoalsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { goals, deleteGoal, incrementProgress } = useGoalsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;

  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);

  const tFunc = (key: string) => t(key, lang);

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPad + Spacing.sm }]}>
        <View>
          <Text style={[styles.headerTitle, { color: C.text }]}>{tFunc('goals')}</Text>
          <Text style={[styles.count, { color: C.textSecondary }]}>
            {goals.length} {tFunc('activeGoals')}
          </Text>
        </View>
        <AddButton onPress={() => { setEditGoal(null); setShowForm(true); }} size={40} />
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: bottomPad + 100, gap: Spacing.md }}
        renderItem={({ item }) => (
          <GoalCard
            goal={item}
            onEdit={(g) => { setEditGoal(g); setShowForm(true); }}
            onDelete={deleteGoal}
            onIncrement={incrementProgress}
            typeLabel={tFunc(item.type)}
            t={tFunc}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            icon="trophy-outline"
            title={tFunc('noGoals')}
            subtitle={tFunc('noGoalsSubtitle')}
          />
        )}
      />

      <GoalForm
        visible={showForm}
        onClose={() => { setShowForm(false); setEditGoal(null); }}
        editGoal={editGoal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: { ...Typography.heading2 },
  count: { ...Typography.caption, marginTop: 2 },
});
