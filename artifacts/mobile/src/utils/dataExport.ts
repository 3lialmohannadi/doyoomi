import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { format } from 'date-fns';

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
  tasks: any[];
  habits: any[];
  goals: any[];
  journal: any[];
  categories: any[];
  settings?: any;
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
      tasks: tasks ? JSON.parse(tasks) : [],
      habits: habits ? JSON.parse(habits) : [],
      goals: goals ? JSON.parse(goals) : [],
      journal: journal ? JSON.parse(journal) : [],
      categories: categories ? JSON.parse(categories) : [],
      settings: settings ? JSON.parse(settings) : undefined,
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

    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const fileName = `doyoomi-backup-${dateStr}.json`;
    const fileUri = (FileSystem.cacheDirectory ?? '') + fileName;

    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Share Do.Yoomi Backup',
        UTI: 'public.json',
      });
      return { success: true };
    }

    return { success: false, error: 'Sharing not available on this device' };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Unknown error' };
  }
}

export async function pickAndImportFile(): Promise<{ success: boolean; data?: BackupData; error?: string }> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, error: 'cancelled' };
    }

    const asset = result.assets[0];
    const json = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const parsed = validateBackup(json);
    if (!parsed) {
      return { success: false, error: 'invalid' };
    }

    return { success: true, data: parsed };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Unknown error' };
  }
}

export function validateBackup(json: string): BackupData | null {
  try {
    const backup = JSON.parse(json);
    if (!backup || typeof backup !== 'object') return null;
    if (!backup.version || !backup.exportedAt) return null;
    if (!Array.isArray(backup.tasks) || !Array.isArray(backup.habits) ||
        !Array.isArray(backup.goals) || !Array.isArray(backup.journal)) return null;
    const allItems = [...backup.tasks, ...backup.habits, ...backup.goals, ...backup.journal];
    for (const item of allItems) {
      if (!item || !item.id || !item.created_at) return null;
    }
    return backup as BackupData;
  } catch {
    return null;
  }
}

export async function applyBackup(backup: BackupData): Promise<{ success: boolean; error?: string }> {
  try {
    const ops: Promise<void>[] = [];
    ops.push(AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(backup.tasks)));
    ops.push(AsyncStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(backup.habits)));
    ops.push(AsyncStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(backup.goals)));
    ops.push(AsyncStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(backup.journal)));
    if (Array.isArray(backup.categories)) {
      ops.push(AsyncStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(backup.categories)));
    }
    await Promise.all(ops);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Write failed' };
  }
}

export async function importData(json: string): Promise<{ success: boolean; error?: string }> {
  const backup = validateBackup(json);
  if (!backup) return { success: false, error: 'Invalid backup format' };
  return applyBackup(backup);
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
