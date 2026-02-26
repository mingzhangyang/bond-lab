import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Language } from './i18n.ts';
import {
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  nextLanguage,
  resolveInitialLanguage,
  resolveInitialTheme,
  toggleTheme as getNextTheme,
} from './preferences.ts';
import type { InteractionMode, Theme } from './preferences.ts';

export type ElementType = 'H' | 'C' | 'N' | 'O';

export const ELEMENTS: Record<ElementType, { symbol: ElementType, name: string, color: string, vdwRadius: number, valence: number, maxBonds: number }> = {
  H: { symbol: 'H', name: 'Hydrogen', color: '#FFFFFF', vdwRadius: 1.2, valence: 1, maxBonds: 1 },
  C: { symbol: 'C', name: 'Carbon', color: '#444444', vdwRadius: 1.7, valence: 4, maxBonds: 4 },
  N: { symbol: 'N', name: 'Nitrogen', color: '#2244FF', vdwRadius: 1.55, valence: 5, maxBonds: 3 },
  O: { symbol: 'O', name: 'Oxygen', color: '#FF2222', vdwRadius: 1.52, valence: 6, maxBonds: 2 },
};

export interface Atom {
  id: string;
  element: ElementType;
}

export interface Bond {
  id: string;
  source: string;
  target: string;
  order: number;
}

interface GameState {
  atoms: Atom[];
  bonds: Bond[];
  draggedAtom: string | null;
  selectedAtom: string | null;
  theme: Theme;
  language: Language;
  interactionMode: InteractionMode;
  
  // Challenge Mode
  challengeActive: boolean;
  challengeTarget: { name: string, formula: string } | null;
  challengeTimeLeft: number;
  challengeTotalTime: number;
  challengeStatus: 'idle' | 'playing' | 'won' | 'lost';
  
  setDraggedAtom: (id: string | null) => void;
  setSelectedAtom: (id: string | null) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  cycleLanguage: () => void;
  setInteractionMode: (mode: InteractionMode) => void;
  addAtom: (element: ElementType) => string;
  removeAtom: (id: string) => void;
  addBond: (source: string, target: string) => void;
  removeBond: (id: string) => void;
  clear: () => void;
  
  startChallenge: (target: { name: string, formula: string }, timeLimit: number) => void;
  tickChallenge: () => void;
  winChallenge: () => void;
  stopChallenge: () => void;
}

function getStoredValue(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStoredValue(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // No-op when storage is unavailable.
  }
}

function getPrefersDarkScheme(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const initialTheme = resolveInitialTheme(
  getStoredValue(THEME_STORAGE_KEY),
  getPrefersDarkScheme(),
);
const initialLanguage = resolveInitialLanguage(getStoredValue(LANGUAGE_STORAGE_KEY));

export const useStore = create<GameState>((set, get) => ({
  atoms: [],
  bonds: [],
  draggedAtom: null,
  selectedAtom: null,
  theme: initialTheme,
  language: initialLanguage,
  interactionMode: 'build',
  
  challengeActive: false,
  challengeTarget: null,
  challengeTimeLeft: 0,
  challengeTotalTime: 0,
  challengeStatus: 'idle',
  
  setDraggedAtom: (id) => set({ draggedAtom: id }),
  setSelectedAtom: (id) => set({ selectedAtom: id }),
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
  setInteractionMode: (interactionMode) => set({ interactionMode }),
  addAtom: (element) => {
    const id = uuidv4();
    set((state) => ({
      atoms: [...state.atoms, { id, element }]
    }));
    return id;
  },
  removeAtom: (id) => set((state) => ({
    atoms: state.atoms.filter(a => a.id !== id),
    bonds: state.bonds.filter(b => b.source !== id && b.target !== id),
    selectedAtom: state.selectedAtom === id ? null : state.selectedAtom
  })),
  addBond: (source, target) => set((state) => {
    if (source === target) return state;
    
    const existing = state.bonds.find(b => (b.source === source && b.target === target) || (b.source === target && b.target === source));
    
    const sourceAtom = state.atoms.find(a => a.id === source);
    const targetAtom = state.atoms.find(a => a.id === target);
    if (!sourceAtom || !targetAtom) return state;
    
    const sourceBonds = state.bonds.filter(b => b.source === source || b.target === source).reduce((sum, b) => sum + b.order, 0);
    const targetBonds = state.bonds.filter(b => b.source === target || b.target === target).reduce((sum, b) => sum + b.order, 0);
    
    if (existing) {
      if (sourceBonds < ELEMENTS[sourceAtom.element].maxBonds && targetBonds < ELEMENTS[targetAtom.element].maxBonds) {
        if (existing.order < 3) {
          return {
            bonds: state.bonds.map(b => b.id === existing.id ? { ...b, order: b.order + 1 } : b)
          };
        }
      }
      return state;
    }
    
    if (sourceBonds < ELEMENTS[sourceAtom.element].maxBonds && targetBonds < ELEMENTS[targetAtom.element].maxBonds) {
      return {
        bonds: [...state.bonds, { id: uuidv4(), source, target, order: 1 }]
      };
    }
    
    return state;
  }),
  removeBond: (id) => set((state) => ({
    bonds: state.bonds.filter(b => b.id !== id)
  })),
  clear: () => set({ atoms: [], bonds: [], selectedAtom: null }),
  
  startChallenge: (target, timeLimit) => set({
    atoms: [],
    bonds: [],
    selectedAtom: null,
    challengeActive: true,
    challengeTarget: target,
    challengeTimeLeft: timeLimit,
    challengeTotalTime: timeLimit,
    challengeStatus: 'playing'
  }),
  
  tickChallenge: () => set((state) => {
    if (state.challengeStatus !== 'playing') return state;
    const newTime = state.challengeTimeLeft - 1;
    if (newTime <= 0) {
      return { challengeTimeLeft: 0, challengeStatus: 'lost' };
    }
    return { challengeTimeLeft: newTime };
  }),
  
  winChallenge: () => set({ challengeStatus: 'won' }),
  
  stopChallenge: () => set({
    challengeActive: false,
    challengeTarget: null,
    challengeStatus: 'idle'
  })
}));
