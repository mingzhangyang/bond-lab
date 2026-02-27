import { ELEMENTS, normalizeBondChemistry } from './chemistry.ts';
import type { Atom, Bond } from './store.ts';

export interface StabilityReport {
  score: number;
  energy: number;
  issues: string[];
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface StabilityOptions {
  positions?: Record<string, Position3D | undefined>;
  angleToleranceDeg?: number;
}

function getIdealBondAngle(element: Atom['element'], neighborCount: number, bondOrderSum: number): number | null {
  if (neighborCount < 2) return null;
  const valence = ELEMENTS[element].valence;
  const lonePairs = Math.floor(Math.max(0, valence - bondOrderSum) / 2);
  if (neighborCount === 2) {
    if (lonePairs >= 2) return 104.5; // AX₂E₂: H₂O, H₂S (~92–105°)
    if (lonePairs === 1) return 120;  // AX₂E₁: SO₂, O₃ (~119°)
    return 180;                        // AX₂: CO₂, C₂H₂
  }
  if (neighborCount === 3) {
    if (lonePairs >= 1) {
      if (element === 'P') return 100; // PH₃ (~93.5°), PCl₃ (~100.3°)
      return 107;                       // NH₃ (~107.8°)
    }
    return 120; // AX₃: trigonal planar
  }
  return 109.5; // AX₄: tetrahedral
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

function computeAngleDegrees(center: Position3D, p1: Position3D, p2: Position3D): number | null {
  const v1x = p1.x - center.x;
  const v1y = p1.y - center.y;
  const v1z = p1.z - center.z;
  const v2x = p2.x - center.x;
  const v2y = p2.y - center.y;
  const v2z = p2.z - center.z;

  const mag1 = Math.sqrt(v1x * v1x + v1y * v1y + v1z * v1z);
  const mag2 = Math.sqrt(v2x * v2x + v2y * v2y + v2z * v2z);
  if (mag1 < 1e-6 || mag2 < 1e-6) return null;

  const dot = v1x * v2x + v1y * v2y + v1z * v2z;
  const normalizedDot = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return toDegrees(Math.acos(normalizedDot));
}

function applyGeometryPenalty(
  atoms: Atom[],
  bonds: Bond[],
  positions: Record<string, Position3D | undefined>,
  angleToleranceDeg: number,
): { scorePenalty: number, strainEnergy: number, issues: string[] } {
  const neighborsByAtomId = new Map<string, string[]>();
  const bondOrderSumById = new Map<string, number>();
  for (const atom of atoms) {
    neighborsByAtomId.set(atom.id, []);
    bondOrderSumById.set(atom.id, 0);
  }

  for (const bond of bonds) {
    const sourceNeighbors = neighborsByAtomId.get(bond.source);
    const targetNeighbors = neighborsByAtomId.get(bond.target);
    if (sourceNeighbors) sourceNeighbors.push(bond.target);
    if (targetNeighbors) targetNeighbors.push(bond.source);
    bondOrderSumById.set(bond.source, (bondOrderSumById.get(bond.source) ?? 0) + bond.order);
    bondOrderSumById.set(bond.target, (bondOrderSumById.get(bond.target) ?? 0) + bond.order);
  }

  let totalScorePenalty = 0;
  let totalStrainEnergy = 0;
  const issues: string[] = [];

  for (const atom of atoms) {
    const neighbors = neighborsByAtomId.get(atom.id) ?? [];
    const bondOrderSum = bondOrderSumById.get(atom.id) ?? neighbors.length;
    const idealAngle = getIdealBondAngle(atom.element, neighbors.length, bondOrderSum);
    if (idealAngle === null) continue;

    const center = positions[atom.id];
    if (!center) continue;

    const deviations: number[] = [];
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const p1 = positions[neighbors[i]];
        const p2 = positions[neighbors[j]];
        if (!p1 || !p2) continue;
        const angle = computeAngleDegrees(center, p1, p2);
        if (angle === null) continue;
        deviations.push(Math.abs(angle - idealAngle));
      }
    }

    if (deviations.length === 0) continue;

    const avgDeviation = deviations.reduce((sum, value) => sum + value, 0) / deviations.length;
    const excessDeviation = Math.max(0, avgDeviation - angleToleranceDeg);
    if (excessDeviation <= 0) continue;

    const scorePenalty = Math.min(30, excessDeviation * 0.6);
    const strainEnergy = excessDeviation * 12;
    totalScorePenalty += scorePenalty;
    totalStrainEnergy += strainEnergy;
    issues.push(
      `Geometry strain around ${atom.element} (avg angle deviation ${avgDeviation.toFixed(1)}° from ideal ${idealAngle.toFixed(1)}°).`,
    );
  }

  return {
    scorePenalty: totalScorePenalty,
    strainEnergy: totalStrainEnergy,
    issues,
  };
}

export function calculateStability(atoms: Atom[], bonds: Bond[], options: StabilityOptions = {}): StabilityReport {
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
      totalBondEnergy += normalizeBondChemistry(bond, el1, el2).bondEnergy;
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
      const excess = count - maxBonds;
      score -= 30 + Math.max(0, excess - 1) * 12;
      strainEnergy += 500 + excess * 180; // stronger penalty for larger overfill
      issues.push(`${atom.element} has exceeded its maximum valency (${count}/${maxBonds} bonds).`);
    } else if (count < maxBonds) {
      const deficit = maxBonds - count;
      score -= Math.min(24, deficit * 6);
      strainEnergy += deficit * 110;
      issues.push(`${atom.element} has unsatisfied valency (${count}/${maxBonds} bonds).`);
    }
  }

  if (options.positions) {
    const geometryPenalty = applyGeometryPenalty(
      atoms,
      bonds,
      options.positions,
      options.angleToleranceDeg ?? 8,
    );
    score -= geometryPenalty.scorePenalty;
    strainEnergy += geometryPenalty.strainEnergy;
    issues.push(...geometryPenalty.issues);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const energy = Math.round(totalBondEnergy - strainEnergy);

  // Deduplicate issues
  const uniqueIssues = Array.from(new Set(issues));

  return { score, energy, issues: uniqueIssues };
}
