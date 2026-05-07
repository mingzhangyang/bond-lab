import type { Language } from '../i18n.ts';
import type { InteractionMode, Theme } from '../preferences.ts';
import type { ElementType } from '../chemistry.ts';

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

export type ChallengeStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface ChallengeTarget {
  name: string;
  formula: string;
}

export interface MoleculeState {
  atoms: Atom[];
  bonds: Bond[];
  lastRemovedBond: Bond | null;
  draggedAtom: string | null;
  rotatingBond: string | null;
  selectedAtom: string | null;
  selectedBond: string | null;
  interactionMode: InteractionMode;
}

export interface PreferencesState {
  theme: Theme;
  language: Language;
}

export interface ChallengeState {
  challengeActive: boolean;
  challengeTarget: ChallengeTarget | null;
  challengeTimeLeft: number;
  challengeTotalTime: number;
  challengeStatus: ChallengeStatus;
}

export interface MoleculeActions {
  setDraggedAtom: (id: string | null) => void;
  setRotatingBond: (id: string | null) => void;
  setSelectedAtom: (id: string | null) => void;
  setSelectedBond: (id: string | null) => void;
  setInteractionMode: (mode: InteractionMode) => void;
  addAtom: (element: ElementType) => string;
  removeAtom: (id: string) => void;
  addBond: (source: string, target: string) => void;
  removeBond: (id: string) => void;
  restoreLastRemovedBond: () => void;
  discardLastRemovedBond: () => void;
  clear: () => void;
}

export interface PreferencesActions {
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  cycleLanguage: () => void;
}

export interface ChallengeActions {
  startChallenge: (target: ChallengeTarget, timeLimit: number) => void;
  tickChallenge: () => void;
  winChallenge: () => void;
  stopChallenge: () => void;
}

export type GameState =
  & MoleculeState
  & PreferencesState
  & ChallengeState
  & MoleculeActions
  & PreferencesActions
  & ChallengeActions;
