import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitFrequency } from '../types';
import { format, subDays, getDay } from 'date-fns';

export interface StreakCelebrationPayload {
  habitName: string;
  streakDays: number;
}

const MILESTONES = new Set([3, 7, 14, 21, 30, 60, 100]);
const sessionCelebrated = new Set<string>();

function isWeekend(date: Date): boolean {
  const d = getDay(date);
  return d === 0 || d === 6;
}

function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

function countCompletionsInWindow(history: string[], days: number): number {
  const today = new Date();
  let count = 0;
  for (let i = 0; i < days; i++) {
    const d = format(subDays(today, i), 'yyyy-MM-dd');
    if (history.includes(d)) count++;
  }
  return count;
}

function computeStreak(history: string[], freq: HabitFrequency): number {
  if (history.length === 0) return 0;

  const today = new Date();

  if (freq === 'daily') {
    let streak = 0;
    for (let i = 0; ; i++) {
      const d = format(subDays(today, i), 'yyyy-MM-dd');
      if (history.includes(d)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  if (freq === 'weekdays') {
    let streak = 0;
    for (let i = 0; ; i++) {
      const d = subDays(today, i);
      if (isWeekend(d)) continue;
      const dStr = format(d, 'yyyy-MM-dd');
      if (history.includes(dStr)) {
        streak++;
      } else {
        break;
      }
      if (i > 60) break;
    }
    return streak;
  }

  if (freq === 'weekends') {
    let streak = 0;
    for (let i = 0; ; i++) {
      const d = subDays(today, i);
      if (isWeekday(d)) continue;
      const dStr = format(d, 'yyyy-MM-dd');
      if (history.includes(dStr)) {
        streak++;
      } else {
        break;
      }
      if (i > 60) break;
    }
    return streak;
  }

  if (freq === '3x_week') {
    return Math.floor(countCompletionsInWindow(history, 7) / 3);
  }

  if (freq === '5x_week') {
    return Math.floor(countCompletionsInWindow(history, 7) / 5);
  }

  if (freq === 'weekly') {
    let streak = 0;
    for (let w = 0; w < 52; w++) {
      const found = Array.from({ length: 7 }, (_, i) =>
        format(subDays(today, w * 7 + i), 'yyyy-MM-dd')
      ).some(d => history.includes(d));
      if (found) {
        streak++;
      } else if (w > 0) {
        break;
      }
    }
    return streak;
  }

  return 0;
}

interface HabitsState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'streak_days' | 'best_streak' | 'completion_history'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => StreakCelebrationPayload | null;
  uncompleteHabit: (id: string) => void;
  loadHabits: () => Promise<void>;
}

const STORAGE_KEY = '@doyoomi_habits';
const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],

  addHabit: (habit) => {
    const newHabit: Habit = {
      ...habit,
      id: genId(),
      user_id: 'user-1',
      streak_days: 0,
      best_streak: 0,
      completion_history: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newHabit, ...get().habits];
    set({ habits: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateHabit: (id, updates) => {
    const updated = get().habits.map(h =>
      h.id === id ? { ...h, ...updates, updated_at: new Date().toISOString() } : h
    );
    set({ habits: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteHabit: (id) => {
    const updated = get().habits.filter(h => h.id !== id);
    set({ habits: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  completeHabit: (id) => {
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    const habit = get().habits.find(h => h.id === id);
    if (!habit) return null;

    const lastDate = habit.last_completed_at
      ? format(new Date(habit.last_completed_at), 'yyyy-MM-dd')
      : null;
    if (lastDate === todayStr) return null;

    const history = habit.completion_history ?? [];
    const updatedHistory = [todayStr, ...history.filter(d => d !== todayStr)].slice(0, 365);

    const newStreak = computeStreak(updatedHistory, habit.frequency ?? 'daily');
    const newBest = Math.max(newStreak, habit.best_streak ?? 0);

    get().updateHabit(id, {
      streak_days: newStreak,
      best_streak: newBest,
      last_completed_at: now.toISOString(),
      completion_history: updatedHistory,
    });

    const milestoneKey = `${id}-${newStreak}`;
    if (MILESTONES.has(newStreak) && !sessionCelebrated.has(milestoneKey)) {
      sessionCelebrated.add(milestoneKey);
      return { habitName: habit.name, streakDays: newStreak };
    }
    return null;
  },

  uncompleteHabit: (id) => {
    const habit = get().habits.find(h => h.id === id);
    if (!habit) return;
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const lastDate = habit.last_completed_at
      ? format(new Date(habit.last_completed_at), 'yyyy-MM-dd')
      : null;
    if (lastDate !== todayStr) return;

    const updatedHistory = (habit.completion_history ?? []).filter(d => d !== todayStr);
    const newStreak = computeStreak(updatedHistory, habit.frequency ?? 'daily');

    get().updateHabit(id, {
      streak_days: newStreak,
      last_completed_at: updatedHistory[0]
        ? new Date(updatedHistory[0] + 'T12:00:00').toISOString()
        : undefined,
      completion_history: updatedHistory,
    });
  },

  loadHabits: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Habit[] = JSON.parse(stored);
        const migrated = parsed.map(h => ({
          frequency: 'daily' as HabitFrequency,
          best_streak: h.streak_days ?? 0,
          completion_history: [],
          ...h,
        }));
        set({ habits: migrated });
      }
    } catch {}
  },
}));
