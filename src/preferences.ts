import type { Language } from './i18n.ts';

export type Theme = 'dark' | 'light';
export type InteractionMode = 'build' | 'delete';

export const THEME_STORAGE_KEY = 'bondlab-theme';
export const LANGUAGE_STORAGE_KEY = 'bondlab-language';

const SUPPORTED_THEMES: Theme[] = ['dark', 'light'];
const SUPPORTED_LANGUAGES: Language[] = ['en', 'es', 'zh', 'fr', 'ja'];

function isTheme(value: string | null): value is Theme {
  return value !== null && SUPPORTED_THEMES.includes(value as Theme);
}

function isLanguage(value: string | null): value is Language {
  return value !== null && SUPPORTED_LANGUAGES.includes(value as Language);
}

export function toggleTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}

export function toggleInteractionMode(mode: InteractionMode): InteractionMode {
  return mode === 'build' ? 'delete' : 'build';
}

export function nextLanguage(language: Language): Language {
  const currentIndex = SUPPORTED_LANGUAGES.indexOf(language);
  if (currentIndex === -1) {
    return SUPPORTED_LANGUAGES[0];
  }
  return SUPPORTED_LANGUAGES[(currentIndex + 1) % SUPPORTED_LANGUAGES.length];
}

export function resolveInitialTheme(
  storedTheme: string | null,
  prefersDarkScheme: boolean,
): Theme {
  if (isTheme(storedTheme)) {
    return storedTheme;
  }
  return prefersDarkScheme ? 'dark' : 'light';
}

export function resolveInitialLanguage(storedLanguage: string | null): Language {
  if (isLanguage(storedLanguage)) {
    return storedLanguage;
  }
  return 'en';
}
