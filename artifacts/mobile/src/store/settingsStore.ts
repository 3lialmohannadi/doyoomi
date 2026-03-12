import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, Theme, TimeFormat, StartOfWeek, UserProfile } from '../types';

interface SettingsState {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setStartOfWeek: (day: StartOfWeek) => void;
  loadSettings: () => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-1',
  name: '',
  email: '',
  language: 'en',
  theme: 'light',
  time_format: '12h',
  start_of_week: 'monday',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const STORAGE_KEY = '@uoomi_settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  profile: DEFAULT_PROFILE,

  setProfile: (partial) => {
    const updated = { ...get().profile, ...partial, updated_at: new Date().toISOString() };
    set({ profile: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  setLanguage: (lang) => get().setProfile({ language: lang }),
  setTheme: (theme) => get().setProfile({ theme }),
  setTimeFormat: (format) => get().setProfile({ time_format: format }),
  setStartOfWeek: (day) => get().setProfile({ start_of_week: day }),

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ profile: JSON.parse(stored) });
      }
    } catch {}
  },
}));
