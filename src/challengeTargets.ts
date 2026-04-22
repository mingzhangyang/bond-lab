import type { KNOWN_MOLECULES } from './identifier.ts';

type ChallengeMolecule = (typeof KNOWN_MOLECULES)[number];

export const MAX_CHALLENGE_ATOM_COUNT = 12;

export function getChallengeCandidateMolecules(
  molecules: ChallengeMolecule[],
  maxAtomCount = MAX_CHALLENGE_ATOM_COUNT,
): ChallengeMolecule[] {
  return molecules.filter((molecule) => molecule.atomCount <= maxAtomCount);
}

export function pickChallengeMolecule(
  molecules: ChallengeMolecule[],
  randomValue = Math.random(),
): ChallengeMolecule | null {
  if (molecules.length === 0) return null;
  const normalized = Number.isFinite(randomValue) ? randomValue : 0;
  const clamped = Math.max(0, Math.min(0.999999, normalized));
  const index = Math.floor(clamped * molecules.length);
  return molecules[index];
}
