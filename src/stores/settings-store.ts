import { create } from 'zustand';
import { db, DEFAULT_USER_SETTINGS } from '../services/storage/db';
import type { SupportedLocale, ThemeMode, UserSettings } from '../types';

function getSystemScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyColorSchemeToDocument(theme: ThemeMode): void {
  if (typeof document === 'undefined') {
    return;
  }
  const metaValue = theme === 'system' ? 'light dark' : theme;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'color-scheme';
    document.head.appendChild(meta);
  }
  meta.content = metaValue;

  try {
    if (theme === 'system') {
      localStorage.removeItem('color-scheme');
    } else {
      localStorage.setItem('color-scheme', theme);
    }
  } catch {
    // Ignore storage restriction errors
  }
}

export function applyLocaleToDocument(locale: SupportedLocale): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.lang = locale;
}

interface SettingsStoreState extends UserSettings {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  updateSettings: (partial: Partial<Omit<UserSettings, 'id'>>) => Promise<void>;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleHeaderColorScheme: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  ...DEFAULT_USER_SETTINGS,
  hydrated: false,

  hydrate: async () => {
    try {
      const stored = await db.settings.get('default');
      let storedSchemeOverride: ThemeMode | null = null;
      try {
        const rawLS = localStorage.getItem('color-scheme');
        if (rawLS === 'light' || rawLS === 'dark') {
          storedSchemeOverride = rawLS;
        }
      } catch {
        // Ignore
      }

      const merged: UserSettings = {
        ...DEFAULT_USER_SETTINGS,
        ...stored,
        theme: storedSchemeOverride ?? stored?.theme ?? DEFAULT_USER_SETTINGS.theme,
        id: 'default',
      };

      applyColorSchemeToDocument(merged.theme);
      applyLocaleToDocument(merged.locale);
      set({ ...merged, hydrated: true });
    } catch {
      applyColorSchemeToDocument(DEFAULT_USER_SETTINGS.theme);
      applyLocaleToDocument(DEFAULT_USER_SETTINGS.locale);
      set({ hydrated: true });
    }
  },

  updateSettings: async (partial) => {
    const current = get();
    const updated: UserSettings = {
      id: 'default',
      locale: partial.locale ?? current.locale,
      theme: partial.theme ?? current.theme,
      soundEnabled: partial.soundEnabled ?? current.soundEnabled,
      speechEnabled: partial.speechEnabled ?? current.speechEnabled,
      countdownBeepsEnabled: partial.countdownBeepsEnabled ?? current.countdownBeepsEnabled,
      wakeLockEnabled: partial.wakeLockEnabled ?? current.wakeLockEnabled,
      preferredVoiceURI:
        partial.preferredVoiceURI !== undefined
          ? partial.preferredVoiceURI
          : current.preferredVoiceURI,
      speechRate: partial.speechRate ?? current.speechRate,
      soundVolume: partial.soundVolume ?? current.soundVolume,
      defaultPrepareSeconds: partial.defaultPrepareSeconds ?? current.defaultPrepareSeconds,
    };

    if (partial.theme !== undefined) {
      applyColorSchemeToDocument(updated.theme);
    }
    if (partial.locale !== undefined) {
      applyLocaleToDocument(updated.locale);
    }

    set(updated);
    try {
      await db.settings.put(updated);
    } catch {
      // Ignore IndexedDB write error in restricted mode
    }
  },

  setLocale: async (locale) => {
    await get().updateSettings({ locale });
  },

  setTheme: async (theme) => {
    await get().updateSettings({ theme });
  },

  /**
   * Implements the modern-web-guidance `dark-mode-toggle` two-state header algorithm:
   * 1. Target scheme = opposite of currently rendered scheme (stored override if any, else system preference).
   * 2. If target differs from current system preference, store it literally ('light' or 'dark').
   * 3. If target matches current system preference, clear the override ('system') so it follows OS again.
   */
  toggleHeaderColorScheme: async () => {
    const currentTheme = get().theme;
    const systemScheme = getSystemScheme();
    const currentlyRendered: 'light' | 'dark' =
      currentTheme === 'system' ? systemScheme : currentTheme;
    const targetScheme: 'light' | 'dark' = currentlyRendered === 'dark' ? 'light' : 'dark';
    const nextTheme: ThemeMode = targetScheme === systemScheme ? 'system' : targetScheme;
    await get().setTheme(nextTheme);
  },
}));
