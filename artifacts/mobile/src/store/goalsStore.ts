import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal } from '../types';

const MOCK_GOALS: Goal[] = [
  {
    id: 'g-1', user_id: 'user-1',
    title: 'Read 24 books',
    description: 'Read at least 2 books per month',
    type: 'yearly',
    target_value: 24,
    current_value: 7,
    icon: 'book',
    color: '#7BAE9E',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'g-2', user_id: 'user-1',
    title: 'Exercise 20 times',
    description: 'Hit the gym or run outdoors',
    type: 'monthly',
    target_value: 20,
    current_value: 12,
    icon: 'fitness',
    color: '#7BAE9E',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'g-3', user_id: 'user-1',
    title: 'Save $5,000',
    description: 'Emergency fund savings goal',
    type: 'yearly',
    target_value: 5000,
    current_value: 2200,
    icon: 'card',
    color: '#F5A623',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'g-4', user_id: 'user-1',
    title: 'Learn Spanish',
    description: 'Complete Duolingo streak and reach B1 level',
    type: 'yearly',
    target_value: 365,
    current_value: 84,
    icon: 'language',
    color: '#D48E6E',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];

interface GoalsState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  incrementProgress: (id: string, amount?: number) => void;
  decrementProgress: (id: string) => void;
  loadGoals: () => Promise<void>;
}

const STORAGE_KEY = '@doyoomi_goals';
const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: MOCK_GOALS,

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
      if (stored) set({ goals: JSON.parse(stored) });
    } catch {}
  },
}));
