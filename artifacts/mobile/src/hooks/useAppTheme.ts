import { useSettingsStore } from '../store/settingsStore';
import { Colors, Shadow, ShadowDark } from '../theme';
import type { Theme } from '../types';

/**
 * Returns the user-selected theme ('light' | 'dark') from settings,
 * along with the matching color palette and shadow set.
 */
export function useAppTheme(): { scheme: Theme; C: typeof Colors.light; S: typeof Shadow } {
  const theme = useSettingsStore((s) => s.profile.theme);
  return { scheme: theme, C: Colors[theme], S: theme === 'dark' ? ShadowDark : Shadow };
}

/**
 * Drop-in replacement for React Native's useColorScheme that
 * respects the user preference stored in settings.
 */
export function useAppColorScheme(): Theme {
  return useSettingsStore((s) => s.profile.theme);
}
