import { useMemo } from 'react';
import type { Language } from '../i18n.ts';
import type { InteractionMode, Theme } from '../preferences.ts';
import { deriveLabClassPalette, getThemeActionText } from '../labPresentation.ts';
import { getLabThemeVars } from '../theme.ts';

interface UseLabPresentationParams {
  theme: Theme;
  language: Language;
  interactionMode: InteractionMode;
}

export function useLabPresentation({ theme, language, interactionMode }: UseLabPresentationParams) {
  return useMemo(() => {
    const classPalette = deriveLabClassPalette(theme, interactionMode);

    return {
      ...classPalette,
      themeActionText: getThemeActionText(language, classPalette.isDark),
      themeVars: getLabThemeVars(theme),
    };
  }, [interactionMode, language, theme]);
}
