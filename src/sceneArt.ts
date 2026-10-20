import type { Theme } from './preferences.ts';

const DARK_TEXT = '#020617';
const LIGHT_TEXT = '#ffffff';

function parseHex(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const digits = match[1].length === 3
    ? match[1].split('').map((digit) => digit + digit).join('')
    : match[1];
  return [0, 2, 4].map((offset) => parseInt(digits.slice(offset, offset + 2), 16) / 255) as [number, number, number];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const linear = (channel: number) => (
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrastRatio(a: number, b: number): number {
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastRatio(foreground: string, background: string): number {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  if (!fg || !bg) return Number.NaN;
  return contrastRatio(relativeLuminance(fg), relativeLuminance(bg));
}

// Element symbols are 14-16px bold, below WCAG's large-text size, so the label
// takes whichever color gives the higher contrast (all swatches reach 4.5:1).
export function getReadableTextColor(background: string): string {
  if (!parseHex(background)) return LIGHT_TEXT;
  return getContrastRatio(DARK_TEXT, background) >= getContrastRatio(LIGHT_TEXT, background)
    ? DARK_TEXT
    : LIGHT_TEXT;
}

export interface AtomHalo {
  color: string;
  opacity: number;
  scale: number;
}

interface AtomHaloInput {
  isSelected: boolean;
  hovered: boolean;
  interactionMode: string;
}

export function getAtomHalo({ isSelected, hovered, interactionMode }: AtomHaloInput): AtomHalo | null {
  if (hovered && interactionMode === 'delete') return { color: '#ef4444', opacity: 0.85, scale: 1.4 };
  if (isSelected) return { color: '#818cf8', opacity: 0.95, scale: 1.45 };
  if (hovered) return { color: '#a5b4fc', opacity: 0.6, scale: 1.35 };
  return null;
}

export interface BondHighlight {
  color: string;
  emissive: string;
}

interface BondHighlightInput {
  isRotating: boolean;
  isSelected: boolean;
  hovered: boolean;
  interactionMode: string;
  shiftPressed: boolean;
  bondRotatable: boolean;
}

// Returns null for an idle bond so each half can show its atom's color.
export function getBondHighlight({
  isRotating,
  isSelected,
  hovered,
  interactionMode,
  shiftPressed,
  bondRotatable,
}: BondHighlightInput): BondHighlight | null {
  if (isRotating) return { color: '#38bdf8', emissive: '#0c4a6e' };
  if (isSelected) return { color: '#22c55e', emissive: '#14532d' };
  if (!hovered) return null;
  if (interactionMode === 'delete') return { color: '#ef4444', emissive: '#450a0a' };
  if (interactionMode === 'build' && shiftPressed) {
    return bondRotatable
      ? { color: '#f59e0b', emissive: '#5b3410' }
      : { color: '#f87171', emissive: '#450a0a' };
  }
  return { color: '#c7d2fe', emissive: '#312e81' };
}

export interface SceneLighting {
  environmentIntensity: number;
  ambient: number;
  key: number;
  fill: number;
  rimColor: string;
  rimIntensity: number;
}

const SCENE_LIGHTING: Record<Theme, SceneLighting> = {
  dark: {
    environmentIntensity: 0.55,
    ambient: 0.12,
    key: 1.25,
    fill: 0.25,
    rimColor: '#818cf8',
    rimIntensity: 1.6,
  },
  light: {
    environmentIntensity: 0.6,
    ambient: 0.2,
    key: 1.1,
    fill: 0.3,
    rimColor: '#a5f3fc',
    rimIntensity: 0.5,
  },
};

export function getSceneLighting(theme: Theme): SceneLighting {
  return SCENE_LIGHTING[theme];
}

export function easeOutBack(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}
