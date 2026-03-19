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
  completeOnboarding: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationsTaskTime: (time: string) => void;
  setNotificationsHabitTime: (time: string) => void;
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
  onboarding_complete: false,
  notifications_enabled: false,
  notifications_task_time: '09:00',
  notifications_habit_time: '20:00',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const STORAGE_KEY = '@doyoomi_settings';

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
  completeOnboarding: () => get().setProfile({ onboarding_complete: true }),
  setNotificationsEnabled: (enabled) => get().setProfile({ notifications_enabled: enabled }),
  setNotificationsTaskTime: (time) => get().setProfile({ notifications_task_time: time }),
  setNotificationsHabitTime: (time) => get().setProfile({ notifications_habit_time: time }),

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ profile: { ...DEFAULT_PROFILE, ...parsed } });
      }
    } catch {}
  },
}));
