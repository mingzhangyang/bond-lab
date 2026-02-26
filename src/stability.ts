import { ELEMENTS } from './store.ts';
import type { Atom, Bond } from './store.ts';

export interface StabilityReport {
  score: number;
  energy: number;
  issues: string[];
}

const BOND_ENERGIES: Record<string, Record<number, number>> = {
  'H-H': { 1: 432 },
  'C-H': { 1: 413 },
  'C-C': { 1: 347, 2: 614, 3: 839 },
  'C-N': { 1: 305, 2: 615, 3: 891 },
  'C-O': { 1: 358, 2: 799, 3: 1072 },
  'N-H': { 1: 391 },
  'N-N': { 1: 160, 2: 418, 3: 941 },
  'N-O': { 1: 201, 2: 607 },
  'O-H': { 1: 467 },
  'O-O': { 1: 146, 2: 495 },
};

function getBondEnergy(el1: string, el2: string, order: number): number {
  const pair1 = `${el1}-${el2}`;
  const pair2 = `${el2}-${el1}`;
  
  if (BOND_ENERGIES[pair1] && BOND_ENERGIES[pair1][order]) return BOND_ENERGIES[pair1][order];
  if (BOND_ENERGIES[pair2] && BOND_ENERGIES[pair2][order]) return BOND_ENERGIES[pair2][order];
  
  // Fallback approximations
  const base = 250;
  return base * order;
}

export function calculateStability(atoms: Atom[], bonds: Bond[]): StabilityReport {
  if (atoms.length === 0) return { score: 100, energy: 0, issues: [] };

  let score = 100;
  let totalBondEnergy = 0;
  let strainEnergy = 0;
  const issues: string[] = [];
  const atomById = new Map(atoms.map((atom) => [atom.id, atom]));

  // Calculate base bond energies
  for (const bond of bonds) {
    const el1 = atomById.get(bond.source)?.element;
    const el2 = atomById.get(bond.target)?.element;
    if (el1 && el2) {
      totalBondEnergy += getBondEnergy(el1, el2, bond.order);
    }
  }

  // Valency / Octet Rule (topology only, engine-agnostic)
  const bondCounts: Record<string, number> = {};
  for (const atom of atoms) {
    bondCounts[atom.id] = 0;
  }

  for (const bond of bonds) {
    if (bondCounts[bond.source] !== undefined) {
      bondCounts[bond.source] += bond.order;
    }
    if (bondCounts[bond.target] !== undefined) {
      bondCounts[bond.target] += bond.order;
    }
  }

  for (const atom of atoms) {
    const count = bondCounts[atom.id];
    const maxBonds = ELEMENTS[atom.element].maxBonds;
    
    if (count > maxBonds) {
      score -= 30;
      strainEnergy += 500; // massive energy penalty for illegal valency
      issues.push(`${atom.element} has exceeded its maximum valency (${count}/${maxBonds} bonds).`);
    } else if (count < maxBonds) {
      score -= 10;
      strainEnergy += 150; // penalty for unsatisfied valency (radicals/ions)
      issues.push(`${atom.element} has unsatisfied valency (${count}/${maxBonds} bonds).`);
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const energy = Math.round(totalBondEnergy - strainEnergy);

  // Deduplicate issues
  const uniqueIssues = Array.from(new Set(issues));

  return { score, energy, issues: uniqueIssues };
}
