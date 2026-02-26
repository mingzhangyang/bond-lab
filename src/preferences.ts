import type { Language } from './i18n.ts';

export type Theme = 'dark' | 'light';
export type InteractionMode = 'build' | 'delete';

export const THEME_STORAGE_KEY = 'bondlab-theme';
export const LANGUAGE_STORAGE_KEY = 'bondlab-language';

const SUPPORTED_THEMES: Theme[] = ['dark', 'light'];
const SUPPORTED_LANGUAGES: Language[] = ['en', 'es'];

function isTheme(value: string | null): value is Theme {
  return value !== null && SUPPORTED_THEMES.includes(value as Theme);
}

function isLanguage(value: string | null): value is Language {
  return value !== null && SUPPORTED_LANGUAGES.includes(value as Language);
}

export function toggleTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}

export function nextLanguage(language: Language): Language {
  return language === 'en' ? 'es' : 'en';
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
