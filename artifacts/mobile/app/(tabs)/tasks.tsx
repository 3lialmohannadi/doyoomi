import React, { useState, useMemo } from 'react';
import {
  SectionList, StyleSheet, Text, View, TextInput, Pressable, useColorScheme, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTasksStore } from '../../src/store/tasksStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Colors, Spacing, Typography, Radius, Shadow } from '../../src/theme';
import { t } from '../../src/utils/i18n';
import { formatDate, formatTime, getTodayString, isOverdue } from '../../src/utils/date';
import { TaskCard } from '../../src/components/ui/TaskCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { Task } from '../../src/types';
import * as Haptics from 'expo-haptics';

type FilterKey = 'all' | 'today' | 'done' | 'overdue' | 'high' | 'postponed';

const FILTER_GRADIENTS: Record<FilterKey, [string, string]> = {
  all: ['#7C5CFC', '#A855F7'],
  today: ['#FF6B9D', '#FF9DB3'],
  done: ['#00C48C', '#00E5A0'],
  overdue: ['#FF4D6A', '#FF8E53'],
  high: ['#FF6B35', '#FFB347'],
  postponed: ['#6B7280', '#9CA3AF'],
};

export default function TasksScreen() {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { tasks, toggleComplete, deleteTask, postponeTask } = useTasksStore();
  const { categories } = useCategoriesStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;

  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const tFunc = (key: string) => t(key, lang);
  const today = getTodayString();

  const filterChips: { key: FilterKey; label: string; icon: string }[] = [
    { key: 'all', label: tFunc('all'), icon: 'apps' },
    { key: 'today', label: tFunc('today'), icon: 'today' },
    { key: 'done', label: tFunc('done'), icon: 'checkmark-circle' },
    { key: 'overdue', label: tFunc('overdue'), icon: 'alert-circle' },
    { key: 'high', label: tFunc('high'), icon: 'arrow-up-circle' },
    { key: 'postponed', label: tFunc('postponed'), icon: 'time' },
  ];

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    switch (filter) {
      case 'today': result = result.filter(t => t.due_date === today); break;
      case 'done': result = result.filter(t => t.status === 'completed'); break;
      case 'overdue': result = result.filter(t => t.status === 'overdue' || (t.status === 'pending' && t.due_date && isOverdue(t.due_date))); break;
      case 'high': result = result.filter(t => t.priority === 'high'); break;
      case 'postponed': result = result.filter(t => t.status === 'postponed'); break;
    }
    return result;
  }, [tasks, filter, search, today]);

  const sections = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    filteredTasks.forEach(task => {
      const key = task.due_date ?? '__nodate__';
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });
    return Object.keys(groups)
      .sort((a, b) => a === '__nodate__' ? 1 : b === '__nodate__' ? -1 : a.localeCompare(b))
      .map(key => ({ key, title: key === '__nodate__' ? tFunc('noDate') : formatDate(key, lang), data: groups[key] }));
  }, [filteredTasks, lang]);

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;
  const activeGrad = FILTER_GRADIENTS[filter];

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + Spacing.sm }]}>
        <View>
          <Text style={[styles.headerTitle, { color: C.text }]}>{tFunc('tasks')}</Text>
          <Text style={[styles.headerSub, { color: C.textSecondary }]}>{filteredTasks.length} tasks</Text>
        </View>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setEditTask(null); setShowForm(true); }}
          style={styles.addBtn}
        >
          <LinearGradient colors={['#7C5CFC', '#FF6B9D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.addGrad}>
            <Ionicons name="add" size={24} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: C.surface, borderColor: C.border }]}>
        <Ionicons name="search" size={16} color={C.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={tFunc('search')}
          placeholderTextColor={C.textMuted}
          style={[styles.searchInput, { color: C.text }]}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={C.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
      <SectionList
        ListHeaderComponent={() => (
          <View style={styles.filtersRow}>
            {filterChips.map(chip => {
              const isActive = chip.key === filter;
              const grad = FILTER_GRADIENTS[chip.key];
              return (
                <Pressable
                  key={chip.key}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setFilter(chip.key); }}
                  style={[styles.chip, { overflow: 'hidden', borderColor: isActive ? 'transparent' : C.border, backgroundColor: isActive ? 'transparent' : C.surface }]}
                >
                  {isActive && <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />}
                  <Ionicons name={chip.icon as any} size={13} color={isActive ? '#fff' : C.textMuted} />
                  <Text style={[styles.chipText, { color: isActive ? '#fff' : C.textSecondary }]}>{chip.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: bottomPad + 100 }}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeaderRow, { borderLeftColor: activeGrad[0] }]}>
            <Text style={[styles.sectionHeaderText, { color: C.text }]}>{section.title}</Text>
            <View style={[styles.sectionCount, { backgroundColor: activeGrad[0] + '20' }]}>
              <Text style={[styles.sectionCountText, { color: activeGrad[0] }]}>{section.data.length}</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => {
          const cat = categories.find(c => c.id === item.category_id);
          return (
            <View style={{ marginBottom: Spacing.sm }}>
              <TaskCard
                task={item}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onPostpone={postponeTask}
                onEdit={(task) => { setEditTask(task); setShowForm(true); }}
                priorityLabel={tFunc(item.priority)}
                timeStr={item.due_time ? formatTime(item.due_time, profile.time_format === '12h') : undefined}
                categoryName={cat?.name}
                categoryColor={cat?.color}
                t={tFunc}
              />
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="checkmark-circle-outline"
            title={search ? tFunc('noSearchResults') : tFunc('noTasks')}
            subtitle={!search ? tFunc('noTasksSubtitle') : undefined}
          />
        )}
        stickySectionHeadersEnabled={false}
      />

      <TaskForm visible={showForm} onClose={() => { setShowForm(false); setEditTask(null); }} editTask={editTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 1 },
  addBtn: { borderRadius: 24, overflow: 'hidden' },
  addGrad: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', padding: 0 },
  filtersRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: Radius.full, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: 7,
  },
  chipText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderLeftWidth: 3, paddingLeft: Spacing.sm,
    marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },
  sectionHeaderText: { fontSize: 15, fontFamily: 'Inter_700Bold', flex: 1 },
  sectionCount: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  sectionCountText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
});
