import React, { useState, useMemo } from 'react';
import {
  SectionList, StyleSheet, Text, View, TextInput, Pressable, Platform, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTasksStore } from '../../src/store/tasksStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Spacing, Radius, F, PRIMARY, SECONDARY, GRADIENT_H, GRADIENT_GREEN, GRADIENT_CORAL, GRADIENT_SAGE, GRADIENT_AMBER, GRADIENT_DARK_HEADER, GRADIENT_DARK_CARD, ShadowDark, cardShadow, ColorScheme } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { formatDate, formatTime, getTodayString, isOverdue } from '../../src/utils/date';
import { TaskCard } from '../../src/components/ui/TaskCard';
import { SwipeableRow } from '../../src/components/ui/SwipeableRow';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { TaskForm } from '../../src/features/tasks/TaskForm';
import { Toast } from '../../src/components/ui/Toast';
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog';
import { Task } from '../../src/types';
import * as Haptics from 'expo-haptics';

type FilterKey = 'all' | 'today' | 'done' | 'overdue' | 'high' | 'postponed' | 'nodate';

const FILTER_GRADIENTS: Record<FilterKey, readonly [string, string]> = {
  all:       GRADIENT_H,
  today:     GRADIENT_SAGE,
  done:      GRADIENT_GREEN,
  overdue:   GRADIENT_CORAL,
  high:      GRADIENT_AMBER,
  postponed: ['#64748B', '#94A3B8'],
  nodate:    GRADIENT_SAGE,
};

export default function TasksScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { tasks, toggleComplete, deleteTask, postponeTask } = useTasksStore();
  const { categories } = useCategoriesStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [confirmTask, setConfirmTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const tFunc = (key: string) => t(key, lang);
  const today = getTodayString();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const filterOptions: { key: FilterKey; label: string; icon: string }[] = [
    { key: 'all',       label: tFunc('all'),       icon: 'apps-outline' },
    { key: 'today',     label: tFunc('today'),     icon: 'today-outline' },
    { key: 'done',      label: tFunc('done'),      icon: 'checkmark-circle-outline' },
    { key: 'overdue',   label: tFunc('overdue'),   icon: 'alert-circle-outline' },
    { key: 'high',      label: tFunc('high'),      icon: 'arrow-up-circle-outline' },
    { key: 'postponed', label: tFunc('postponed'), icon: 'time-outline' },
    { key: 'nodate',    label: tFunc('noDate'),    icon: 'remove-circle-outline' },
  ];

  const activeOption = filterOptions.find(f => f.key === filter)!;
  const activeGrad = FILTER_GRADIENTS[filter];

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    switch (filter) {
      case 'today':     result = result.filter(t => t.due_date === today); break;
      case 'done':      result = result.filter(t => t.status === 'completed'); break;
      case 'overdue':   result = result.filter(t => t.status === 'overdue' || (t.status === 'pending' && t.due_date && isOverdue(t.due_date))); break;
      case 'high':      result = result.filter(t => t.priority === 'high'); break;
      case 'postponed': result = result.filter(t => t.status === 'postponed'); break;
      case 'nodate':    result = result.filter(t => !t.due_date); break;
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
  const hasActiveFilter = filter !== 'all';

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? [...GRADIENT_DARK_HEADER] : [...GRADIENT_H]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.md }, isDark && styles.headerDark]}
      >
        {!isDark && <View style={styles.headerDecor1} />}
        {!isDark && <View style={styles.headerDecor2} />}
        <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }]}>
        <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={[styles.headerTitle, { color: isDark ? C.text : '#fff', textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('tasks')}</Text>
          <Text style={[styles.headerSub, { color: isDark ? C.textSecondary : 'rgba(255,255,255,0.75)', textAlign: isRTL ? 'right' : 'left' }]}>
            {hasActiveFilter || search.trim()
              ? `${filteredTasks.length} / ${tasks.length} ${tFunc('taskCount')}`
              : `${tasks.length} ${tFunc('taskCount')}`}
          </Text>
        </View>

        <View style={[styles.headerActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* Filters button */}
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowFilters(true); }}
            style={({ pressed }) => [
              styles.filterBtn,
              {
                backgroundColor: hasActiveFilter ? activeGrad[0] + '18' : C.surface,
                borderColor: hasActiveFilter ? activeGrad[0] + '60' : C.border,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('filters')}
          >
            <Ionicons name="options-outline" size={16} color={hasActiveFilter ? activeGrad[0] : C.textMuted} />
            {hasActiveFilter ? (
              <Text style={[styles.filterBtnLabel, { color: activeGrad[0] }]}>{activeOption.label}</Text>
            ) : (
              <Text style={[styles.filterBtnLabel, { color: C.textSecondary }]}>{tFunc('filters')}</Text>
            )}
          </Pressable>

          {/* Add button */}
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setEditTask(null); setShowForm(true); }}
            style={styles.addBtn}
            accessibilityRole="button"
            accessibilityLabel={tFunc('addTask')}
          >
            <LinearGradient colors={[...GRADIENT_H]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.addGrad}>
              <Ionicons name="add" size={24} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
      </LinearGradient>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: C.surface, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Ionicons name="search" size={16} color={C.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={tFunc('search')}
          placeholderTextColor={C.textMuted}
          textAlign={isRTL ? 'right' : 'left'}
          style={[styles.searchInput, { color: C.text }]}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} accessibilityRole="button" accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={16} color={C.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Active filter indicator */}
      {hasActiveFilter && (
        <View style={[styles.activeFilterRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.activeFilterPill, { backgroundColor: activeGrad[0] + '15', borderColor: activeGrad[0] + '40', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name={activeOption.icon as React.ComponentProps<typeof Ionicons>['name']} size={13} color={activeGrad[0]} />
            <Text style={[styles.activeFilterText, { color: activeGrad[0] }]}>{activeOption.label}</Text>
          </View>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setFilter('all'); }}
            style={[styles.clearFilterBtn, { backgroundColor: C.surface, borderColor: C.border }]}
            accessibilityRole="button"
            accessibilityLabel="Clear filter"
          >
            <Ionicons name="close" size={13} color={C.textMuted} />
          </Pressable>
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: bottomPad + 100 }}
        renderSectionHeader={({ section }) => (
          <View style={[
            styles.sectionHeaderRow,
            isRTL
              ? { borderRightColor: activeGrad[0], borderRightWidth: 3, paddingRight: Spacing.sm, flexDirection: 'row-reverse' }
              : { borderLeftColor: activeGrad[0], borderLeftWidth: 3, paddingLeft: Spacing.sm },
          ]}>
            <Text style={[styles.sectionHeaderText, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{section.title}</Text>
            <View style={[styles.sectionCount, { backgroundColor: activeGrad[0] + '20' }]}>
              <Text style={[styles.sectionCountText, { color: activeGrad[0] }]}>{section.data.length}</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => {
          const cat = categories.find(c => c.id === item.category_id);
          return (
            <SwipeableRow
              isRTL={isRTL}
              onComplete={item.status !== 'completed' ? () => {
                toggleComplete(item.id);
                showToast(tFunc('taskCompleted'), 'success');
              } : undefined}
              onDelete={() => setConfirmTask(item)}
              completeLabel={tFunc('done')}
              deleteLabel={tFunc('delete')}
            >
              <View style={{ marginBottom: Spacing.sm }}>
                <TaskCard
                  task={item}
                  onToggle={(id) => {
                    toggleComplete(id);
                    const task = tasks.find(t => t.id === id);
                    if (task && task.status !== 'completed') {
                      showToast(tFunc('taskCompleted'), 'success');
                    }
                  }}
                  onDelete={deleteTask}
                  onDeleteRequest={(task) => setConfirmTask(task)}
                  onPostpone={postponeTask}
                  onEdit={(task) => { setEditTask(task); setShowForm(true); }}
                  priorityLabel={tFunc(item.priority)}
                  timeStr={item.due_time ? formatTime(item.due_time, profile.time_format === '12h') : undefined}
                  categoryName={cat?.name}
                  categoryColor={cat?.color}
                  t={tFunc}
                />
              </View>
            </SwipeableRow>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="checkmark-circle-outline"
            title={search ? tFunc('noSearchResults') : tFunc('noTasks')}
            subtitle={!search ? tFunc('noTasksSubtitle') : undefined}
            actionLabel={!search && filter === 'all' ? tFunc('addTask') : undefined}
            onAction={!search && filter === 'all' ? () => setShowForm(true) : undefined}
          />
        )}
        stickySectionHeadersEnabled={false}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilters(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.overlay} onPress={() => setShowFilters(false)}>
          <Pressable style={[styles.filterSheet, { backgroundColor: C.card }]} onPress={() => {}}>
            {/* Sheet handle */}
            <View style={[styles.sheetHandle, { backgroundColor: C.border }]} />

            {/* Header */}
            <View style={[styles.sheetHeader, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomColor: C.border }]}>
              <Text style={[styles.sheetTitle, { color: C.text }]}>{tFunc('filterBy')}</Text>
              <Pressable onPress={() => setShowFilters(false)} style={[styles.sheetClose, { backgroundColor: C.surface }]}>
                <Ionicons name="close" size={18} color={C.textSecondary} />
              </Pressable>
            </View>

            {/* Filter options */}
            <View style={styles.filterGrid}>
              {filterOptions.map(opt => {
                const isActive = opt.key === filter;
                const grad = FILTER_GRADIENTS[opt.key];
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setFilter(opt.key);
                      setShowFilters(false);
                    }}
                    style={({ pressed }) => [
                      styles.filterOption,
                      {
                        backgroundColor: isActive ? grad[0] + '18' : C.surface,
                        borderColor: isActive ? grad[0] : C.border,
                        opacity: pressed ? 0.75 : 1,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={opt.label}
                  >
                    <View style={[styles.filterOptionIcon, { backgroundColor: isActive ? grad[0] + '25' : C.background }]}>
                      <Ionicons name={opt.icon as React.ComponentProps<typeof Ionicons>['name']} size={18} color={isActive ? grad[0] : C.textMuted} />
                    </View>
                    <Text style={[styles.filterOptionText, { color: isActive ? grad[0] : C.text }]}>{opt.label}</Text>
                    {isActive && (
                      <View style={[styles.filterCheck, { backgroundColor: grad[0] }]}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <TaskForm visible={showForm} onClose={() => { setShowForm(false); setEditTask(null); }} editTask={editTask} />

      <ConfirmDialog
        visible={!!confirmTask}
        title={tFunc('deleteTask')}
        message={confirmTask?.title}
        confirmLabel={tFunc('delete')}
        cancelLabel={tFunc('cancel')}
        type="danger"
        onConfirm={() => {
          if (confirmTask) {
            deleteTask(confirmTask.id);
            showToast(tFunc('taskDeleted'), 'error');
          }
          setConfirmTask(null);
        }}
        onCancel={() => setConfirmTask(null)}
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
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
    overflow: 'hidden',
  },
  headerDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerDecor1: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  headerDecor2: {
    position: 'absolute', bottom: -20, left: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerTitle: { fontSize: 30, fontFamily: F.black },
  headerSub: { fontSize: 13, fontFamily: F.med, marginTop: 2 },
  headerActions: { alignItems: 'center', gap: Spacing.sm },

  filterBtn: {
    alignItems: 'center', gap: 6,
    borderRadius: Radius.full, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: 9,
  },
  filterBtnLabel: { fontSize: 13, fontFamily: F.med },

  addBtn: { borderRadius: 24, overflow: 'hidden' },
  addGrad: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },

  searchBar: {
    alignItems: 'center',
    borderRadius: Radius.lg, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: F.reg, padding: 0 },

  activeFilterRow: {
    alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  activeFilterPill: {
    alignItems: 'center', gap: 5,
    borderRadius: Radius.full, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  activeFilterText: { fontSize: 12, fontFamily: F.med },
  clearFilterBtn: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },

  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },
  sectionHeaderText: { fontSize: 15, fontFamily: F.bold, flex: 1 },
  sectionCount: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  sectionCountText: { fontSize: 11, fontFamily: F.bold },

  // Modal / Sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  filterSheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 36,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 20,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  sheetHeader: {
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  sheetTitle: { fontSize: 17, fontFamily: F.bold },
  sheetClose: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  filterGrid: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, gap: Spacing.sm,
  },
  filterOption: {
    alignItems: 'center', gap: Spacing.md,
    borderRadius: Radius.lg, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: 13,
  },
  filterOptionIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  filterOptionText: { flex: 1, fontSize: 15, fontFamily: F.med },
  filterCheck: {
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
});
