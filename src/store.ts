import { create } from 'zustand';
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
import {
  ELEMENTS,
  ELEMENT_DISPLAY_ORDER,
  getBondChemistry,
  isAtomBondingValid,
  type BondChemistry,
  type ElementType,
} from './chemistry.ts';

export { ELEMENTS, ELEMENT_DISPLAY_ORDER };
export type { ElementType };

export interface Atom {
  id: string;
  element: ElementType;
}

export interface Bond {
  id: string;
  source: string;
  target: string;
  order: number;
  bondLength?: number;
  bondEnergy?: number;
  rotatable?: boolean;
}

interface GameState {
  atoms: Atom[];
  bonds: Bond[];
  draggedAtom: string | null;
  rotatingBond: string | null;
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
  setRotatingBond: (id: string | null) => void;
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

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export const useStore = create<GameState>((set) => ({
  atoms: [],
  bonds: [],
  draggedAtom: null,
  rotatingBond: null,
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
  setRotatingBond: (id) => set({ rotatingBond: id }),
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
    const id = createId();
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
    
    if (existing) {
      if (existing.order < 3) {
        const nextOrder = existing.order + 1;
        const nextBonds = state.bonds.map((bond) => (
          bond.id === existing.id
            ? { ...bond, order: nextOrder }
            : bond
        ));

        if (isAtomBondingValid(source, state.atoms, nextBonds) && isAtomBondingValid(target, state.atoms, nextBonds)) {
          const chemistry: BondChemistry = getBondChemistry(
            sourceAtom.element,
            targetAtom.element,
            nextOrder,
          );
          return {
            bonds: nextBonds.map((bond) => (
              bond.id === existing.id
                ? {
                    ...bond,
                    bondLength: chemistry.bondLength,
                    bondEnergy: chemistry.bondEnergy,
                    rotatable: chemistry.rotatable,
                  }
                : bond
            ))
          };
        }
      }
      return state;
    }

    const nextBonds = [
      ...state.bonds,
      {
        id: createId(),
        source,
        target,
        order: 1,
      },
    ];

    if (isAtomBondingValid(source, state.atoms, nextBonds) && isAtomBondingValid(target, state.atoms, nextBonds)) {
      const chemistry = getBondChemistry(sourceAtom.element, targetAtom.element, 1);
      return {
        bonds: nextBonds.map((bond) => (
          bond.source === source && bond.target === target && bond.order === 1 && !('bondLength' in bond)
            ? {
                ...bond,
                bondLength: chemistry.bondLength,
                bondEnergy: chemistry.bondEnergy,
                rotatable: chemistry.rotatable,
              }
            : bond
        ))
      };
    }
    
    return state;
  }),
  removeBond: (id) => set((state) => ({
    bonds: state.bonds.filter(b => b.id !== id),
    rotatingBond: state.rotatingBond === id ? null : state.rotatingBond,
  })),
  clear: () => set({ atoms: [], bonds: [], selectedAtom: null, rotatingBond: null }),
  
  startChallenge: (target, timeLimit) => set({
    atoms: [],
    bonds: [],
    selectedAtom: null,
    rotatingBond: null,
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
    challengeStatus: 'idle',
    rotatingBond: null
  })
}));
