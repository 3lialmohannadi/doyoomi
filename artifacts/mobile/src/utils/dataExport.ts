import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share, Platform } from 'react-native';

const STORAGE_KEYS = {
  tasks: '@doyoomi_tasks',
  habits: '@doyoomi_habits',
  goals: '@doyoomi_goals',
  journal: '@doyoomi_journal',
  categories: '@doyoomi_categories',
};

export interface BackupData {
  version: number;
  exportedAt: string;
  tasks: any[];
  habits: any[];
  goals: any[];
  journal: any[];
  categories: any[];
}

export async function exportData(): Promise<{ success: boolean; error?: string }> {
  try {
    const [tasks, habits, goals, journal, categories] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.tasks),
      AsyncStorage.getItem(STORAGE_KEYS.habits),
      AsyncStorage.getItem(STORAGE_KEYS.goals),
      AsyncStorage.getItem(STORAGE_KEYS.journal),
      AsyncStorage.getItem(STORAGE_KEYS.categories),
    ]);

    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks: tasks ? JSON.parse(tasks) : [],
      habits: habits ? JSON.parse(habits) : [],
      goals: goals ? JSON.parse(goals) : [],
      journal: journal ? JSON.parse(journal) : [],
      categories: categories ? JSON.parse(categories) : [],
    };

    const json = JSON.stringify(backup, null, 2);

    if (Platform.OS === 'web') {
      try {
        await (navigator as any).clipboard.writeText(json);
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

    const result = await Share.share({
      title: 'Yoomi Backup',
      message: json,
    });

    return { success: result.action !== Share.dismissedAction };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Unknown error' };
  }
}

export async function importData(json: string): Promise<{ success: boolean; error?: string }> {
  try {
    const backup: BackupData = JSON.parse(json);

    if (!backup.version || !backup.exportedAt) {
      return { success: false, error: 'Invalid backup format' };
    }

    const ops: Promise<void>[] = [];

    if (Array.isArray(backup.tasks)) {
      ops.push(AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(backup.tasks)));
    }
    if (Array.isArray(backup.habits)) {
      ops.push(AsyncStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(backup.habits)));
    }
    if (Array.isArray(backup.goals)) {
      ops.push(AsyncStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(backup.goals)));
    }
    if (Array.isArray(backup.journal)) {
      ops.push(AsyncStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(backup.journal)));
    }
    if (Array.isArray(backup.categories)) {
      ops.push(AsyncStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(backup.categories)));
    }

    await Promise.all(ops);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Invalid JSON' };
  }
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
  } catch (e: any) {
    return { success: false, error: e?.message };
  }
}
