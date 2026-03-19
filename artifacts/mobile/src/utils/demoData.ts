import { format, addDays } from 'date-fns';
import { Task, Habit, Goal, JournalEntry } from '../types';
import { t } from './i18n';
import { Language } from '../types';

const now = () => new Date().toISOString();
const today = () => format(new Date(), 'yyyy-MM-dd');

export function createDemoTasks(): Task[] {
  const d = today();
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  return [
    {
      id: 'demo-task-1',
      user_id: 'user-1',
      title: t('demoTask1En', 'en'),
      title_en: t('demoTask1En', 'en'),
      title_ar: t('demoTask1Ar', 'ar'),
      description: '',
      due_date: d,
      priority: 'medium',
      status: 'pending',
      is_all_day: true,
      is_demo: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'demo-task-2',
      user_id: 'user-1',
      title: t('demoTask2En', 'en'),
      title_en: t('demoTask2En', 'en'),
      title_ar: t('demoTask2Ar', 'ar'),
      description: '',
      due_date: tomorrow,
      priority: 'low',
      status: 'pending',
      is_all_day: true,
      is_demo: true,
      created_at: now(),
      updated_at: now(),
    },
  ];
}

export function createDemoHabits(): Habit[] {
  return [
    {
      id: 'demo-habit-1',
      user_id: 'user-1',
      name: t('demoHabit1En', 'en'),
      name_en: t('demoHabit1En', 'en'),
      name_ar: t('demoHabit1Ar', 'ar'),
      icon: '💧',
      color: '#06B6D4',
      frequency: { type: 'daily' },
      streak_days: 0,
      best_streak: 0,
      completion_history: [],
      is_demo: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'demo-habit-2',
      user_id: 'user-1',
      name: t('demoHabit2En', 'en'),
      name_en: t('demoHabit2En', 'en'),
      name_ar: t('demoHabit2Ar', 'ar'),
      icon: '🚶',
      color: '#10B981',
      frequency: { type: 'daily' },
      streak_days: 0,
      best_streak: 0,
      completion_history: [],
      is_demo: true,
      created_at: now(),
      updated_at: now(),
    },
  ];
}

export function createDemoGoals(): Goal[] {
  return [
    {
      id: 'demo-goal-1',
      user_id: 'user-1',
      title: t('demoGoal1En', 'en'),
      title_en: t('demoGoal1En', 'en'),
      title_ar: t('demoGoal1Ar', 'ar'),
      type: 'yearly',
      target_value: 12,
      current_value: 0,
      icon: '📚',
      color: '#8B5CF6',
      archived: false,
      is_archived: false,
      is_demo: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: 'demo-goal-2',
      user_id: 'user-1',
      title: t('demoGoal2En', 'en'),
      title_en: t('demoGoal2En', 'en'),
      title_ar: t('demoGoal2Ar', 'ar'),
      type: 'monthly',
      target_value: 20,
      current_value: 0,
      icon: '💪',
      color: '#F97316',
      archived: false,
      is_archived: false,
      is_demo: true,
      created_at: now(),
      updated_at: now(),
    },
  ];
}

export function createDemoJournalEntries(): JournalEntry[] {
  return [
    {
      id: 'demo-journal-1',
      user_id: 'user-1',
      date: today(),
      title: t('demoJournal1TitleEn', 'en'),
      content: t('demoJournal1ContentEn', 'en'),
      mood: 'happy',
      tags: ['example'],
      is_demo: true,
      created_at: now(),
      updated_at: now(),
    },
  ];
}

export function hasDemoItems(items: { is_demo?: boolean }[]): boolean {
  return items.some(i => i.is_demo === true);
}

export function getDemoBadgeLabel(lang: Language): string {
  return t('demoBadge', lang);
}
