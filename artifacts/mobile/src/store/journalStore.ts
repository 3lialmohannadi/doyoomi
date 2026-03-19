import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, Mood } from '../types';

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  loadEntries: () => Promise<void>;
}

const STORAGE_KEY = '@doyoomi_journal';
const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],

  addEntry: (entry) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: genId(),
      user_id: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...get().entries];
    set({ entries: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateEntry: (id, updates) => {
    const updated = get().entries.map(e =>
      e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
    );
    set({ entries: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteEntry: (id) => {
    const updated = get().entries.filter(e => e.id !== id);
    set({ entries: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  loadEntries: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) set({ entries: JSON.parse(stored) });
    } catch {}
  },
}));
