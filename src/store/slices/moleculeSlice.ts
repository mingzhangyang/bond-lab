import type { StateCreator } from 'zustand';
import {
  getBondChemistry,
  isAtomBondingValid,
  type BondChemistry,
} from '../../chemistry.ts';
import type {
  Bond,
  GameState,
  MoleculeActions,
  MoleculeState,
} from '../types.ts';
import { createId } from '../utils.ts';

export type MoleculeSlice = MoleculeState & MoleculeActions;

function isSameBondPair(bond: Bond, source: string, target: string): boolean {
  return (bond.source === source && bond.target === target)
    || (bond.source === target && bond.target === source);
}

export const createMoleculeSlice: StateCreator<GameState, [], [], MoleculeSlice> = (set) => ({
  atoms: [],
  bonds: [],
  lastRemovedBond: null,
  draggedAtom: null,
  rotatingBond: null,
  selectedAtom: null,
  selectedBond: null,
  interactionMode: 'build',

  setDraggedAtom: (id) => set({ draggedAtom: id }),
  setRotatingBond: (id) => set({ rotatingBond: id }),
  setSelectedAtom: (id) => set({ selectedAtom: id, selectedBond: null }),
  setSelectedBond: (id) => set({ selectedBond: id, selectedAtom: null }),
  setInteractionMode: (interactionMode) => set({
    interactionMode,
    selectedAtom: null,
    selectedBond: null,
  }),

  addAtom: (element) => {
    const id = createId();
    set((state) => ({
      atoms: [...state.atoms, { id, element }],
      lastRemovedBond: null,
    }));
    return id;
  },

  removeAtom: (id) => set((state) => ({
    atoms: state.atoms.filter((atom) => atom.id !== id),
    bonds: state.bonds.filter((bond) => bond.source !== id && bond.target !== id),
    lastRemovedBond: null,
    selectedAtom: state.selectedAtom === id ? null : state.selectedAtom,
    selectedBond: null,
  })),

  addBond: (source, target) => set((state) => {
    if (source === target) return state;

    const sourceAtom = state.atoms.find((atom) => atom.id === source);
    const targetAtom = state.atoms.find((atom) => atom.id === target);
    if (!sourceAtom || !targetAtom) return state;

    const existingBond = state.bonds.find((bond) => isSameBondPair(bond, source, target));

    if (existingBond) {
      if (existingBond.order >= 3) return state;

      const nextOrder = existingBond.order + 1;
      const nextBonds = state.bonds.map((bond) => (
        bond.id === existingBond.id
          ? { ...bond, order: nextOrder }
          : bond
      ));

      if (!isAtomBondingValid(source, state.atoms, nextBonds) || !isAtomBondingValid(target, state.atoms, nextBonds)) {
        return state;
      }

      const chemistry: BondChemistry = getBondChemistry(
        sourceAtom.element,
        targetAtom.element,
        nextOrder,
      );

      return {
        bonds: nextBonds.map((bond) => (
          bond.id === existingBond.id
            ? {
                ...bond,
                bondLength: chemistry.bondLength,
                bondEnergy: chemistry.bondEnergy,
                rotatable: chemistry.rotatable,
              }
            : bond
        )),
        lastRemovedBond: null,
        selectedBond: null,
      };
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

    if (!isAtomBondingValid(source, state.atoms, nextBonds) || !isAtomBondingValid(target, state.atoms, nextBonds)) {
      return state;
    }

    const chemistry = getBondChemistry(sourceAtom.element, targetAtom.element, 1);
    return {
      bonds: nextBonds.map((bond) => (
        isSameBondPair(bond, source, target) && bond.order === 1 && !('bondLength' in bond)
          ? {
              ...bond,
              bondLength: chemistry.bondLength,
              bondEnergy: chemistry.bondEnergy,
              rotatable: chemistry.rotatable,
            }
          : bond
      )),
      lastRemovedBond: null,
      selectedBond: null,
    };
  }),

  removeBond: (id) => set((state) => {
    const removedBond = state.bonds.find((bond) => bond.id === id) ?? null;
    if (!removedBond) return state;
    return {
      bonds: state.bonds.filter((bond) => bond.id !== id),
      lastRemovedBond: removedBond,
      rotatingBond: state.rotatingBond === id ? null : state.rotatingBond,
      selectedBond: state.selectedBond === id ? null : state.selectedBond,
    };
  }),

  restoreLastRemovedBond: () => set((state) => {
    const removedBond = state.lastRemovedBond;
    if (!removedBond) return state;

    const atomIds = new Set(state.atoms.map((atom) => atom.id));
    const atomsExist = atomIds.has(removedBond.source) && atomIds.has(removedBond.target);
    const duplicateBondExists = state.bonds.some((bond) => (
      isSameBondPair(bond, removedBond.source, removedBond.target)
    ));

    if (!atomsExist || duplicateBondExists) {
      return { lastRemovedBond: null };
    }

    return {
      bonds: [...state.bonds, removedBond],
      lastRemovedBond: null,
    };
  }),

  discardLastRemovedBond: () => set({ lastRemovedBond: null }),

  clearBondTransientState: () => set({
    lastRemovedBond: null,
    selectedBond: null,
    rotatingBond: null,
  }),

  clear: () => set({
    atoms: [],
    bonds: [],
    lastRemovedBond: null,
    selectedAtom: null,
    selectedBond: null,
    rotatingBond: null,
  }),
});
