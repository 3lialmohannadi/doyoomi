import { format, addDays } from 'date-fns';
import { Task, Habit, Goal, JournalEntry } from '../types';

const now = () => new Date().toISOString();
const today = () => format(new Date(), 'yyyy-MM-dd');
const genId = (prefix: string, n: number) => `demo-${prefix}-${n}`;

export function createDemoTasks(): Task[] {
  const t = today();
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  return [
    {
      id: genId('task', 1),
      user_id: 'user-1',
      title: 'Plan your week',
      title_en: 'Plan your week',
      title_ar: 'خطط لأسبوعك',
      description: '',
      due_date: t,
      priority: 'medium',
      status: 'pending',
      is_all_day: true,
      is_demo: true,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: genId('task', 2),
      user_id: 'user-1',
      title: 'Read for 20 minutes',
      title_en: 'Read for 20 minutes',
      title_ar: 'اقرأ لمدة 20 دقيقة',
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
      id: genId('habit', 1),
      user_id: 'user-1',
      name: 'Morning water',
      name_en: 'Morning water',
      name_ar: 'شرب الماء صباحاً',
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
      id: genId('habit', 2),
      user_id: 'user-1',
      name: 'Evening walk',
      name_en: 'Evening walk',
      name_ar: 'المشي المسائي',
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
      id: genId('goal', 1),
      user_id: 'user-1',
      title: 'Read 12 books this year',
      title_en: 'Read 12 books this year',
      title_ar: 'قراءة 12 كتاباً هذا العام',
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
      id: genId('goal', 2),
      user_id: 'user-1',
      title: 'Exercise 20 times',
      title_en: 'Exercise 20 times',
      title_ar: 'ممارسة الرياضة 20 مرة',
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
      id: genId('journal', 1),
      user_id: 'user-1',
      date: today(),
      title: 'Welcome to Do.Yoomi',
      content: 'This is your first journal entry. Write about your day, your goals, or anything on your mind. Tap here to edit or delete this example.\n\nمرحباً بك في Do.Yoomi. هذا مثال على إدخال يومي. اكتب عن يومك وأهدافك.',
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
