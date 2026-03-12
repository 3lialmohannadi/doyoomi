import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types';
import { format } from 'date-fns';

const MOCK_HABITS: Habit[] = [
  {
    id: 'h-1', user_id: 'user-1',
    name: 'Morning meditation',
    icon: 'leaf',
    color: '#4CAF82',
    streak_days: 14,
    last_completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'h-2', user_id: 'user-1',
    name: 'Drink 8 glasses water',
    icon: 'water',
    color: '#6C8EF5',
    streak_days: 7,
    last_completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'h-3', user_id: 'user-1',
    name: 'Journal writing',
    icon: 'journal',
    color: '#9B6EF5',
    streak_days: 21,
    last_completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'h-4', user_id: 'user-1',
    name: 'No phone after 10pm',
    icon: 'phone-portrait',
    color: '#F0A4C8',
    streak_days: 5,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

interface HabitsState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => void;
  loadHabits: () => Promise<void>;
}

const STORAGE_KEY = '@uoomi_habits';
const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: MOCK_HABITS,

  addHabit: (habit) => {
    const newHabit: Habit = {
      ...habit,
      id: genId(),
      user_id: 'user-1',
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
    const today = format(new Date(), 'yyyy-MM-dd');
    const habit = get().habits.find(h => h.id === id);
    if (!habit) return;
    const lastDate = habit.last_completed_at
      ? format(new Date(habit.last_completed_at), 'yyyy-MM-dd')
      : null;
    if (lastDate === today) return;
    get().updateHabit(id, {
      streak_days: habit.streak_days + 1,
      last_completed_at: new Date().toISOString(),
    });
  },

  loadHabits: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) set({ habits: JSON.parse(stored) });
    } catch {}
  },
}));
