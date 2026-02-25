import * as THREE from 'three';
import { Atom, Bond, ELEMENTS } from './store';
import { atomPositions } from './physics';

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

  // Calculate base bond energies
  for (const bond of bonds) {
    const el1 = atoms.find(a => a.id === bond.source)?.element;
    const el2 = atoms.find(a => a.id === bond.target)?.element;
    if (el1 && el2) {
      totalBondEnergy += getBondEnergy(el1, el2, bond.order);
    }
  }

  // 1. Valency / Octet Rule
  const bondCounts: Record<string, number> = {};
  for (const atom of atoms) bondCounts[atom.id] = 0;

  for (const bond of bonds) {
    bondCounts[bond.source] += bond.order;
    bondCounts[bond.target] += bond.order;
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

  // 2. Bond Angles
  // For each atom, find its neighbors
  const adjacency: Record<string, string[]> = {};
  for (const atom of atoms) adjacency[atom.id] = [];
  for (const bond of bonds) {
    adjacency[bond.source].push(bond.target);
    adjacency[bond.target].push(bond.source);
  }

  for (const atom of atoms) {
    const neighbors = adjacency[atom.id];
    const pC = atomPositions[atom.id];
    if (!pC || neighbors.length < 2) continue;
    
    let numLonePairs = 0;
    if (atom.element === 'N') numLonePairs = 1;
    if (atom.element === 'O') numLonePairs = 2;

    const numDomains = neighbors.length + numLonePairs;
    
    let idealAngle = Math.PI; // 180
    if (numDomains === 3) {
      if (numLonePairs === 1) idealAngle = 116 * Math.PI / 180;
      else idealAngle = 120 * Math.PI / 180;
    }
    else if (numDomains >= 4) {
      if (numLonePairs === 1) idealAngle = 107 * Math.PI / 180;
      else if (numLonePairs === 2) idealAngle = 104.5 * Math.PI / 180;
      else idealAngle = 109.47 * Math.PI / 180;
    }

    // Check angles between all pairs of bonded neighbors
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const p1 = atomPositions[neighbors[i]];
        const p2 = atomPositions[neighbors[j]];
        if (!p1 || !p2) continue;

        const v1 = new THREE.Vector3().subVectors(p1, pC).normalize();
        const v2 = new THREE.Vector3().subVectors(p2, pC).normalize();
        
        const dot = Math.max(-1, Math.min(1, v1.dot(v2)));
        const angle = Math.acos(dot);
        
        const angleDiff = Math.abs(angle - idealAngle);
        const angleDiffDeg = angleDiff * 180 / Math.PI;

        if (angleDiffDeg > 15) { // 15 degrees tolerance
          const penalty = Math.min(20, Math.floor(angleDiffDeg / 2));
          score -= penalty;
          strainEnergy += penalty * 15; // 15 kJ/mol per score penalty point
          issues.push(`Strained bond angle around ${atom.element} (off by ${Math.round(angleDiffDeg)}°).`);
        }
      }
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const energy = Math.round(totalBondEnergy - strainEnergy);

  // Deduplicate issues
  const uniqueIssues = Array.from(new Set(issues));

  return { score, energy, issues: uniqueIssues };
}
