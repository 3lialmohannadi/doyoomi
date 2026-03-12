import { useSettingsStore } from '../store/settingsStore';
import { Colors } from '../theme';
import type { Theme } from '../types';

/**
 * Returns the user-selected theme ('light' | 'dark') from settings,
 * along with the matching color palette.
 */
export function useAppTheme(): { scheme: Theme; C: typeof Colors.light } {
  const theme = useSettingsStore((s) => s.profile.theme);
  return { scheme: theme, C: Colors[theme] };
}

/**
 * Drop-in replacement for React Native's useColorScheme that
 * respects the user preference stored in settings.
 */
export function useAppColorScheme(): Theme {
  return useSettingsStore((s) => s.profile.theme);
}
