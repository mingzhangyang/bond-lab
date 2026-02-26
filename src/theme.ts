import type { CSSProperties } from 'react';
import type { Theme } from './preferences.ts';

type ThemeTokens = Record<`--${string}`, string>;

const INFO_THEME_VARS: Record<Theme, ThemeTokens> = {
  dark: {
    '--info-page-bg': 'radial-gradient(circle at 12% 8%, rgba(79,70,229,0.2), transparent 30%), radial-gradient(circle at 88% 84%, rgba(34,211,238,0.13), transparent 36%), #09090b',
    '--info-panel-bg': 'rgba(24, 24, 27, 0.76)',
    '--info-card-bg': 'rgba(9, 9, 11, 0.55)',
    '--info-border': 'rgba(255, 255, 255, 0.12)',
    '--info-border-strong': 'rgba(129, 140, 248, 0.55)',
    '--info-shadow': 'rgba(0, 0, 0, 0.48)',
    '--info-pill-bg': 'linear-gradient(135deg, rgba(79,70,229,0.36), rgba(6,182,212,0.28))',
    '--info-pill-text': '#e0e7ff',
    '--info-callout-bg': 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.16))',
    '--info-callout-border': 'rgba(16, 185, 129, 0.45)',
    '--info-text': '#f4f4f5',
  },
  light: {
    '--info-page-bg': 'radial-gradient(circle at 8% 6%, rgba(129,140,248,0.2), transparent 35%), radial-gradient(circle at 92% 90%, rgba(34,211,238,0.18), transparent 35%), #f1f5f9',
    '--info-panel-bg': 'rgba(255, 255, 255, 0.82)',
    '--info-card-bg': 'rgba(255, 255, 255, 0.86)',
    '--info-border': 'rgba(15, 23, 42, 0.12)',
    '--info-border-strong': 'rgba(79, 70, 229, 0.4)',
    '--info-shadow': 'rgba(15, 23, 42, 0.14)',
    '--info-pill-bg': 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.14))',
    '--info-pill-text': '#312e81',
    '--info-callout-bg': 'linear-gradient(135deg, rgba(209,250,229,0.88), rgba(207,250,254,0.8))',
    '--info-callout-border': 'rgba(16, 185, 129, 0.45)',
    '--info-text': '#0f172a',
  },
};

const LAB_THEME_VARS: Record<Theme, ThemeTokens> = {
  dark: {
    '--lab-panel-bg': 'rgba(24, 24, 27, 0.74)',
    '--lab-soft-bg': 'rgba(24, 24, 27, 0.88)',
    '--lab-border': 'rgba(255, 255, 255, 0.14)',
    '--lab-border-strong': 'rgba(129, 140, 248, 0.52)',
    '--lab-shadow': 'rgba(0, 0, 0, 0.48)',
    '--lab-text-primary': '#f4f4f5',
    '--lab-tile-bg': 'rgba(255, 255, 255, 0.04)',
    '--lab-tile-hover': 'rgba(99, 102, 241, 0.16)',
    '--lab-ghost-hover': 'rgba(255, 255, 255, 0.09)',
    '--lab-pill-bg': 'linear-gradient(135deg, rgba(79,70,229,0.34), rgba(6,182,212,0.24))',
    '--lab-pill-text': '#e0e7ff',
    '--lab-fab-bg': 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    '--lab-fab-shadow': 'rgba(79, 70, 229, 0.42)',
  },
  light: {
    '--lab-panel-bg': 'rgba(255, 255, 255, 0.82)',
    '--lab-soft-bg': 'rgba(255, 255, 255, 0.9)',
    '--lab-border': 'rgba(15, 23, 42, 0.12)',
    '--lab-border-strong': 'rgba(79, 70, 229, 0.35)',
    '--lab-shadow': 'rgba(15, 23, 42, 0.16)',
    '--lab-text-primary': '#0f172a',
    '--lab-tile-bg': 'rgba(15, 23, 42, 0.05)',
    '--lab-tile-hover': 'rgba(99, 102, 241, 0.12)',
    '--lab-ghost-hover': 'rgba(15, 23, 42, 0.06)',
    '--lab-pill-bg': 'linear-gradient(135deg, rgba(99,102,241,0.16), rgba(6,182,212,0.16))',
    '--lab-pill-text': '#312e81',
    '--lab-fab-bg': 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    '--lab-fab-shadow': 'rgba(79, 70, 229, 0.35)',
  },
};

export function getInfoThemeVars(theme: Theme): CSSProperties {
  return INFO_THEME_VARS[theme] as CSSProperties;
}

export function getLabThemeVars(theme: Theme): CSSProperties {
  return LAB_THEME_VARS[theme] as CSSProperties;
}
