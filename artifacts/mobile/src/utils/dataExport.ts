import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Share } from 'react-native';
import { format } from 'date-fns';
import type { Task, Habit, Goal, JournalEntry, Category, UserProfile } from '../types';

const STORAGE_KEYS = {
  tasks: '@doyoomi_tasks',
  habits: '@doyoomi_habits',
  goals: '@doyoomi_goals',
  journal: '@doyoomi_journal',
  categories: '@doyoomi_categories',
  settings: '@doyoomi_settings',
};

export interface BackupData {
  version: number;
  exportedAt: string;
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  journal: JournalEntry[];
  categories: Category[];
  profile: Partial<UserProfile>;
}

export async function exportData(): Promise<{ success: boolean; error?: string }> {
  try {
    const [tasks, habits, goals, journal, categories, settings] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.tasks),
      AsyncStorage.getItem(STORAGE_KEYS.habits),
      AsyncStorage.getItem(STORAGE_KEYS.goals),
      AsyncStorage.getItem(STORAGE_KEYS.journal),
      AsyncStorage.getItem(STORAGE_KEYS.categories),
      AsyncStorage.getItem(STORAGE_KEYS.settings),
    ]);

    const backup: BackupData = {
      version: 2,
      exportedAt: new Date().toISOString(),
      tasks: tasks ? (JSON.parse(tasks) as Task[]) : [],
      habits: habits ? (JSON.parse(habits) as Habit[]) : [],
      goals: goals ? (JSON.parse(goals) as Goal[]) : [],
      journal: journal ? (JSON.parse(journal) as JournalEntry[]) : [],
      categories: categories ? (JSON.parse(categories) as Category[]) : [],
      profile: settings ? (JSON.parse(settings) as UserProfile) : {},
    };

    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const json = JSON.stringify(backup, null, 2);

    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(json);
      } catch {
        const el = document.createElement('textarea');
        el.value = json;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      return { success: true };
    }

    await Share.share(
      {
        title: `doyoomi-backup-${dateStr}.json`,
        message: json,
      },
      { dialogTitle: 'Share Do.Yoomi Backup' },
    );
    return { success: true };
  } catch (e: unknown) {
    const err = e as { message?: string; code?: string };
    if (err?.code === 'ENS_CANCELED') return { success: false, error: 'cancelled' };
    return { success: false, error: err?.message ?? 'Unknown error' };
  }
}

export function validateBackup(json: string): BackupData | null {
  try {
    const backup = JSON.parse(json);
    if (!backup || typeof backup !== 'object') return null;
    if (typeof backup.version !== 'number') return null;
    if (!Array.isArray(backup.tasks)) return null;
    if (!Array.isArray(backup.habits)) return null;
    if (!Array.isArray(backup.goals)) return null;
    if (!Array.isArray(backup.journal)) return null;
    if (!Array.isArray(backup.categories)) return null;

    for (const item of backup.tasks) {
      if (!item || typeof item.id !== 'string' || typeof item.created_at !== 'string') return null;
    }
    for (const item of backup.habits) {
      if (!item || typeof item.id !== 'string' || typeof item.created_at !== 'string') return null;
    }
    for (const item of backup.goals) {
      if (!item || typeof item.id !== 'string' || typeof item.created_at !== 'string') return null;
    }
    for (const item of backup.journal) {
      if (!item || typeof item.id !== 'string' || typeof item.created_at !== 'string') return null;
    }
    for (const item of backup.categories) {
      if (!item || typeof item.id !== 'string' || typeof item.created_at !== 'string') return null;
    }

    const profile: Partial<UserProfile> =
      backup.profile && typeof backup.profile === 'object' ? backup.profile :
      backup.settings && typeof backup.settings === 'object' ? backup.settings : {};

    return {
      version: backup.version,
      exportedAt: backup.exportedAt ?? new Date().toISOString(),
      tasks: backup.tasks as Task[],
      habits: backup.habits as Habit[],
      goals: backup.goals as Goal[],
      journal: backup.journal as JournalEntry[],
      categories: backup.categories as Category[],
      profile,
    };
  } catch {
    return null;
  }
}

export async function applyBackup(backup: BackupData): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(backup.tasks)),
      AsyncStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(backup.habits)),
      AsyncStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(backup.goals)),
      AsyncStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(backup.journal)),
      AsyncStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(backup.categories)),
      ...(backup.profile && Object.keys(backup.profile).length > 0
        ? [AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(backup.profile))]
        : []),
    ]);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: (e as Error)?.message ?? 'Write failed' };
  }
}

export async function importData(json: string): Promise<{ success: boolean; error?: string }> {
  const backup = validateBackup(json);
  if (!backup) return { success: false, error: 'Invalid backup format' };
  return applyBackup(backup);
}

export async function exportAllData(): Promise<{ success: boolean; error?: string }> {
  return exportData();
}

export async function restoreAll(
  backup: BackupData,
  callbacks: {
    restoreTasks: (items: Task[]) => void;
    restoreHabits: (items: Habit[]) => void;
    restoreGoals: (items: Goal[]) => void;
    restoreEntries: (items: JournalEntry[]) => void;
    restoreCategories: (items: Category[]) => void;
    setProfile: (profile: Partial<UserProfile>) => void;
  },
): Promise<{ success: boolean; error?: string }> {
  const result = await applyBackup(backup);
  if (!result.success) return result;
  callbacks.restoreTasks(backup.tasks);
  callbacks.restoreHabits(backup.habits);
  callbacks.restoreGoals(backup.goals);
  callbacks.restoreEntries(backup.journal);
  callbacks.restoreCategories(backup.categories);
  if (backup.profile && Object.keys(backup.profile).length > 0) {
    callbacks.setProfile(backup.profile);
  }
  return { success: true };
}

export async function clearAllData(): Promise<{ success: boolean; error?: string }> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.tasks,
      STORAGE_KEYS.habits,
      STORAGE_KEYS.goals,
      STORAGE_KEYS.journal,
      STORAGE_KEYS.categories,
    ]);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: (e as Error)?.message };
  }
}
