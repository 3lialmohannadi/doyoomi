import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../types';

interface GoalsState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  archiveGoal: (id: string) => void;
  unarchiveGoal: (id: string) => void;
  incrementProgress: (id: string, amount?: number) => void;
  decrementProgress: (id: string) => void;
  loadGoals: () => Promise<void>;
}

const STORAGE_KEY = '@doyoomi_goals';
const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],

  addGoal: (goal) => {
    const newGoal: Goal = {
      ...goal,
      id: genId(),
      user_id: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newGoal, ...get().goals];
    set({ goals: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateGoal: (id, updates) => {
    const updated = get().goals.map(g =>
      g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g
    );
    set({ goals: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteGoal: (id) => {
    const updated = get().goals.filter(g => g.id !== id);
    set({ goals: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  archiveGoal: (id) => {
    get().updateGoal(id, { archived: true, is_archived: true, archived_at: new Date().toISOString() });
  },

  unarchiveGoal: (id) => {
    get().updateGoal(id, { archived: false, is_archived: false, archived_at: undefined });
  },

  incrementProgress: (id, amount = 1) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal) return;
    const newValue = Math.min(goal.current_value + amount, goal.target_value);
    get().updateGoal(id, { current_value: newValue });
  },

  decrementProgress: (id) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal) return;
    const newValue = Math.max(goal.current_value - 1, 0);
    get().updateGoal(id, { current_value: newValue });
  },

  loadGoals: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Goal[] = JSON.parse(stored);
        const migrated = parsed.map(g => ({
          archived: false,
          is_archived: false,
          ...g,
          archived: g.archived ?? g.is_archived ?? false,
          is_archived: g.is_archived ?? g.archived ?? false,
        }));
        set({ goals: migrated });
      }
    } catch {}
  },
}));
