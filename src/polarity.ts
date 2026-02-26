import { ELEMENTS } from './chemistry.ts';
import type { Atom, Bond } from './store.ts';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export type PolarityClass = 'polar' | 'nonpolar' | 'unknown';

export interface PolarityReport {
  classification: PolarityClass;
  netDipole: number;
  reason: string;
}

function vectorLength(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

export function calculateMolecularPolarity(
  atoms: Atom[],
  bonds: Bond[],
  positions?: Record<string, Position3D | undefined>,
): PolarityReport {
  if (!positions || atoms.length === 0 || bonds.length === 0) {
    return {
      classification: 'unknown',
      netDipole: 0,
      reason: 'Insufficient geometry data to evaluate molecular polarity.',
    };
  }

  const atomById = new Map(atoms.map((atom) => [atom.id, atom]));
  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;
  let componentCount = 0;
  let totalBondDipole = 0;

  for (const bond of bonds) {
    const sourceAtom = atomById.get(bond.source);
    const targetAtom = atomById.get(bond.target);
    const sourcePos = positions[bond.source];
    const targetPos = positions[bond.target];
    if (!sourceAtom || !targetAtom || !sourcePos || !targetPos) continue;

    const sourceEN = ELEMENTS[sourceAtom.element].electronegativity;
    const targetEN = ELEMENTS[targetAtom.element].electronegativity;
    const diff = Math.abs(sourceEN - targetEN);
    if (diff < 1e-9) continue;

    const dirX = targetPos.x - sourcePos.x;
    const dirY = targetPos.y - sourcePos.y;
    const dirZ = targetPos.z - sourcePos.z;
    const dist = vectorLength(dirX, dirY, dirZ);
    if (dist < 1e-9) continue;

    const pointsToTarget = targetEN >= sourceEN;
    const sign = pointsToTarget ? 1 : -1;
    const magnitude = diff * Math.max(1, bond.order);
    const nx = (dirX / dist) * sign;
    const ny = (dirY / dist) * sign;
    const nz = (dirZ / dist) * sign;

    sumX += nx * magnitude;
    sumY += ny * magnitude;
    sumZ += nz * magnitude;
    totalBondDipole += magnitude;
    componentCount++;
  }

  if (componentCount === 0) {
    return {
      classification: 'nonpolar',
      netDipole: 0,
      reason: 'All bonds are effectively nonpolar under the current model.',
    };
  }

  const netDipole = vectorLength(sumX, sumY, sumZ);
  const averageBondDipole = totalBondDipole / componentCount;
  const nonpolarThreshold = Math.max(0.12, averageBondDipole * 0.2);

  if (netDipole <= nonpolarThreshold) {
    return {
      classification: 'nonpolar',
      netDipole,
      reason: 'Bond dipoles largely cancel due to molecular geometry symmetry.',
    };
  }

  return {
    classification: 'polar',
    netDipole,
    reason: 'Bond dipoles do not cancel, leaving a net molecular dipole.',
  };
}
