import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from '../types';
import { createDemoJournalEntries } from '../utils/demoData';

const SETTINGS_KEY = '@doyoomi_settings';

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  loadEntries: () => Promise<void>;
  restoreEntries: (entries: JournalEntry[]) => void;
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
    const withoutDemo = get().entries.filter(e => !e.is_demo);
    const updated = [newEntry, ...withoutDemo];
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
      if (stored) {
        set({ entries: JSON.parse(stored) });
        return;
      }
      const settingsRaw = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = settingsRaw ? JSON.parse(settingsRaw) : null;
      const onboardingComplete = settings?.onboarding_complete === true;
      if (!onboardingComplete) {
        const lang = settings?.language === 'ar' ? 'ar' : 'en';
        const demo = createDemoJournalEntries(lang);
        set({ entries: demo });
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      }
    } catch {}
  },

  restoreEntries: (entries) => {
    set({ entries });
  },
}));
