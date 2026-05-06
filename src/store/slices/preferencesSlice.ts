import type { StateCreator } from 'zustand';
import {
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  nextLanguage,
  resolveInitialLanguage,
  resolveInitialTheme,
  toggleTheme as getNextTheme,
} from '../../preferences.ts';
import type {
  GameState,
  PreferencesActions,
  PreferencesState,
} from '../types.ts';
import {
  getPrefersDarkScheme,
  getStoredValue,
  setStoredValue,
} from '../utils.ts';

export type PreferencesSlice = PreferencesState & PreferencesActions;

const initialTheme = resolveInitialTheme(
  getStoredValue(THEME_STORAGE_KEY),
  getPrefersDarkScheme(),
);
const initialLanguage = resolveInitialLanguage(getStoredValue(LANGUAGE_STORAGE_KEY));

export const createPreferencesSlice: StateCreator<GameState, [], [], PreferencesSlice> = (set) => ({
  theme: initialTheme,
  language: initialLanguage,

  toggleTheme: () => set((state) => {
    const theme = getNextTheme(state.theme);
    setStoredValue(THEME_STORAGE_KEY, theme);
    return { theme };
  }),

  setLanguage: (language) => set(() => {
    setStoredValue(LANGUAGE_STORAGE_KEY, language);
    return { language };
  }),

  cycleLanguage: () => set((state) => {
    const language = nextLanguage(state.language);
    setStoredValue(LANGUAGE_STORAGE_KEY, language);
    return { language };
  }),
});
