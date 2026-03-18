import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types';

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', user_id: 'user-1', name: 'Work', color: '#6C8EF5', icon: 'briefcase', created_at: new Date().toISOString() },
  { id: 'cat-2', user_id: 'user-1', name: 'Personal', color: '#F0A4C8', icon: 'person', created_at: new Date().toISOString() },
  { id: 'cat-3', user_id: 'user-1', name: 'Health', color: '#4CAF82', icon: 'fitness', created_at: new Date().toISOString() },
  { id: 'cat-4', user_id: 'user-1', name: 'Learning', color: '#7BAE9E', icon: 'book', created_at: new Date().toISOString() },
  { id: 'cat-5', user_id: 'user-1', name: 'Finance', color: '#F5A623', icon: 'card', created_at: new Date().toISOString() },
];

interface CategoriesState {
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'user_id' | 'created_at'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  loadCategories: () => Promise<void>;
}

const STORAGE_KEY = '@doyoomi_categories';
const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: MOCK_CATEGORIES,

  addCategory: (cat) => {
    const newCat: Category = {
      ...cat,
      id: genId(),
      user_id: 'user-1',
      created_at: new Date().toISOString(),
    };
    const updated = [...get().categories, newCat];
    set({ categories: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateCategory: (id, partial) => {
    const updated = get().categories.map(c => c.id === id ? { ...c, ...partial } : c);
    set({ categories: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteCategory: (id) => {
    const updated = get().categories.filter(c => c.id !== id);
    set({ categories: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  loadCategories: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) set({ categories: JSON.parse(stored) });
    } catch {}
  },
}));
