import React, { useState, useMemo } from 'react';
import {
  SectionList, StyleSheet, Text, View, TextInput, Pressable, useColorScheme, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { useTasksStore } from '../../src/store/tasksStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Colors, Spacing, Typography, Radius } from '../../src/theme';
import { t } from '../../src/utils/i18n';
import { formatDate, formatTime, getTodayString, isOverdue } from '../../src/utils/date';
import { FilterChips } from '../../src/components/ui/FilterChips';
import { TaskCard } from '../../src/components/ui/TaskCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { AddButton } from '../../src/components/ui/AddButton';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { Task } from '../../src/types';

type FilterKey = 'all' | 'today' | 'done' | 'overdue' | 'high' | 'postponed';

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

  const filterChips = [
    { key: 'all', label: tFunc('all') },
    { key: 'today', label: tFunc('today') },
    { key: 'done', label: tFunc('done') },
    { key: 'overdue', label: tFunc('overdue') },
    { key: 'high', label: tFunc('high') },
    { key: 'postponed', label: tFunc('postponed') },
  ];

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
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

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === '__nodate__') return 1;
      if (b === '__nodate__') return -1;
      return a.localeCompare(b);
    });

    return sortedKeys.map(key => ({
      key,
      title: key === '__nodate__' ? tFunc('noDate') : formatDate(key, lang),
      data: groups[key],
    }));
  }, [filteredTasks, lang]);

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { paddingTop: topPad + Spacing.sm }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>{tFunc('tasks')}</Text>
        <AddButton onPress={() => { setEditTask(null); setShowForm(true); }} size={40} />
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: C.surface, borderColor: C.border }]}>
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

      <View style={{ marginBottom: Spacing.md }}>
        <FilterChips chips={filterChips} selected={filter} onSelect={(k) => setFilter(k as FilterKey)} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: bottomPad + 100 }}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionHeader, { color: C.textSecondary }]}>{section.title}</Text>
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
                onEdit={(t) => { setEditTask(t); setShowForm(true); }}
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

      <TaskForm
        visible={showForm}
        onClose={() => { setShowForm(false); setEditTask(null); }}
        editTask={editTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  headerTitle: { ...Typography.heading2 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    padding: 0,
  },
  sectionHeader: {
    ...Typography.captionMedium,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
