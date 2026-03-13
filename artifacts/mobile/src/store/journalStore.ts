import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, Mood } from '../types';
import { format } from 'date-fns';

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: 'j-1', user_id: 'user-1',
    date: format(new Date(), 'yyyy-MM-dd'),
    title: 'A productive day',
    content: 'Got a lot done today. Finished the project proposal and had a great workout session.',
    mood: 'good',
    tags: ['productive', 'health'],
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'j-2', user_id: 'user-1',
    date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
    title: 'Feeling grateful',
    content: 'Spent time with family and reflected on the week. Grateful for the progress made.',
    mood: 'excellent',
    tags: ['gratitude', 'family'],
    created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'j-3', user_id: 'user-1',
    date: format(new Date(Date.now() - 86400000 * 2), 'yyyy-MM-dd'),
    content: 'Regular day. Nothing special but stayed consistent with habits.',
    mood: 'neutral',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

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
  entries: MOCK_ENTRIES,

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
