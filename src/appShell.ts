import {
  resolveInitialTheme,
  type Theme,
} from './preferences.ts';

interface AppShellTheme {
  background: string;
  canvasBackground: string;
  colorScheme: Theme;
  text: string;
}

const APP_SHELL_THEMES: Record<Theme, AppShellTheme> = {
  dark: {
    background: '#18181b',
    canvasBackground: '#18181b',
    colorScheme: 'dark',
    text: '#f4f4f5',
  },
  light: {
    background: '#e2e8f0',
    canvasBackground: '#e2e8f0',
    colorScheme: 'light',
    text: '#0f172a',
  },
};

export function resolveBootTheme(
  storedTheme: string | null,
  prefersDarkScheme: boolean,
): Theme {
  return resolveInitialTheme(storedTheme, prefersDarkScheme);
}

export function getAppShellTheme(theme: Theme): AppShellTheme {
  return APP_SHELL_THEMES[theme];
}
