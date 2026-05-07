import type { Language } from './i18n.ts';
import type { InteractionMode, Theme } from './preferences.ts';

const THEME_ACTION_LABELS = {
  en: { dark: 'Use dark mode', light: 'Use light mode' },
  es: { dark: 'Usar modo oscuro', light: 'Usar modo claro' },
  zh: { dark: '切换到深色', light: '切换到浅色' },
  fr: { dark: 'Utiliser le mode sombre', light: 'Utiliser le mode clair' },
  ja: { dark: 'ダークモードへ', light: 'ライトモードへ' },
} as const;

export interface LabClassPalette {
  isDark: boolean;
  panelClass: string;
  topBarPanelClass: string;
  softPanelClass: string;
  primaryTextClass: string;
  secondaryTextClass: string;
  headingTextClass: string;
  ghostButtonClass: string;
  inactiveModeClass: string;
  dangerButtonClass: string;
  settingsItemClass: string;
  interactionBubbleClass: string;
}

export function getThemeActionText(language: Language, isDark: boolean): string {
  return isDark
    ? THEME_ACTION_LABELS[language].light
    : THEME_ACTION_LABELS[language].dark;
}

export function deriveLabClassPalette(theme: Theme, interactionMode: InteractionMode): LabClassPalette {
  const isDark = theme === 'dark';

  return {
    isDark,
    panelClass: 'lab-panel lab-panel-glow border backdrop-blur-xl',
    topBarPanelClass: 'bg-transparent',
    softPanelClass: 'lab-soft-panel border backdrop-blur-md',
    primaryTextClass: isDark ? 'text-zinc-100' : 'text-zinc-900',
    secondaryTextClass: isDark ? 'text-zinc-400' : 'text-zinc-600',
    headingTextClass: isDark ? 'text-zinc-400' : 'text-zinc-600',
    ghostButtonClass: isDark
      ? 'lab-ghost text-zinc-300 hover:text-white'
      : 'lab-ghost text-zinc-600 hover:text-zinc-900',
    inactiveModeClass: isDark
      ? 'lab-tile text-zinc-200 hover:text-white'
      : 'lab-tile text-zinc-700',
    dangerButtonClass: isDark
      ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/25'
      : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300',
    settingsItemClass: isDark
      ? 'lab-ghost text-zinc-200'
      : 'lab-ghost text-zinc-700',
    interactionBubbleClass: interactionMode === 'delete'
      ? 'lab-fab bg-red-500 text-white hover:bg-red-600'
      : 'lab-fab text-white',
  };
}
