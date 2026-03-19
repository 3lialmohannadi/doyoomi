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

const DEFAULT_FREQUENCY: HabitFrequency = { type: 'daily' };

function isWeekend(date: Date): boolean {
  const d = getDay(date);
  return d === 0 || d === 6;
}

function isRequiredDay(date: Date, freq: HabitFrequency): boolean {
  if (freq.type === 'daily') return true;
  if (freq.type === 'weekdays') return !isWeekend(date);
  if (freq.type === 'custom') {
    if (freq.specific_days && freq.specific_days.length > 0) {
      return freq.specific_days.includes(getDay(date));
    }
    return true;
  }
  return true;
}

function computeStreak(history: string[], freq: HabitFrequency): number {
  if (history.length === 0) return 0;

  const today = new Date();

  if (freq.type === 'daily') {
    let streak = 0;
    for (let i = 0; i <= 365; i++) {
      const d = format(subDays(today, i), 'yyyy-MM-dd');
      if (history.includes(d)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  if (freq.type === 'weekdays') {
    let streak = 0;
    let i = 0;
    while (i <= 365) {
      const d = subDays(today, i);
      i++;
      if (isWeekend(d)) continue;
      const dStr = format(d, 'yyyy-MM-dd');
      if (history.includes(dStr)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  if (freq.type === 'custom') {
    const daysPerWeek = freq.days_per_week ?? 3;
    const specificDays = freq.specific_days;

    if (specificDays && specificDays.length > 0) {
      let streak = 0;
      let i = 0;
      while (i <= 365) {
        const d = subDays(today, i);
        i++;
        if (!specificDays.includes(getDay(d))) continue;
        const dStr = format(d, 'yyyy-MM-dd');
        if (history.includes(dStr)) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    }

    const historySet = new Set(history);
    let streakWeeks = 0;
    for (let w = 0; w < 52; w++) {
      const start = w * 7;
      let count = 0;
      for (let i = 0; i < 7; i++) {
        const d = format(subDays(today, start + i), 'yyyy-MM-dd');
        if (historySet.has(d)) count++;
      }
      if (count >= daysPerWeek) {
        streakWeeks++;
      } else {
        break;
      }
    }
    return streakWeeks;
  }

  return 0;
}

function migrateFrequency(raw: unknown): HabitFrequency {
  if (raw && typeof raw === 'object' && 'type' in raw) {
    return raw as HabitFrequency;
  }
  if (typeof raw === 'string') {
    switch (raw) {
      case 'daily': return { type: 'daily' };
      case 'weekdays': return { type: 'weekdays' };
      case '3x_week': return { type: 'custom', days_per_week: 3 };
      case '5x_week': return { type: 'custom', days_per_week: 5 };
      case 'weekends': return { type: 'custom', days_per_week: 2, specific_days: [0, 6] };
      case 'weekly': return { type: 'custom', days_per_week: 1 };
      default: return { type: 'daily' };
    }
  }
  return DEFAULT_FREQUENCY;
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

    const freq = habit.frequency ?? DEFAULT_FREQUENCY;
    const newStreak = computeStreak(updatedHistory, freq);
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
    const freq = habit.frequency ?? DEFAULT_FREQUENCY;
    const newStreak = computeStreak(updatedHistory, freq);

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
        const parsed = JSON.parse(stored);
        const migrated: Habit[] = parsed.map((h: Habit & { frequency: unknown }) => {
          const base: Habit = {
            ...h,
            frequency: migrateFrequency(h.frequency),
          };
          if (base.streak_days === undefined) base.streak_days = 0;
          if (base.best_streak === undefined) base.best_streak = 0;
          if (!base.completion_history) base.completion_history = [];
          return base;
        });
        set({ habits: migrated });
      }
    } catch {}
  },
}));
