import type { KNOWN_MOLECULES } from './identifier.ts';

type ChallengeMolecule = (typeof KNOWN_MOLECULES)[number];

export const MAX_CHALLENGE_ATOM_COUNT = 12;
const CHALLENGE_BASE_SECONDS = 30;
const CHALLENGE_SECONDS_PER_ATOM = 5;

export interface ChallengeRound {
  name: string;
  formula: string;
  timeLimit: number;
}

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

export function getChallengeTimeLimit(
  atomCount: number,
  baseSeconds = CHALLENGE_BASE_SECONDS,
  secondsPerAtom = CHALLENGE_SECONDS_PER_ATOM,
): number {
  return baseSeconds + (atomCount * secondsPerAtom);
}

export function createChallengeRound(
  molecules: ChallengeMolecule[],
  randomValue = Math.random(),
): ChallengeRound | null {
  if (molecules.length === 0) return null;

  const challengePool = getChallengeCandidateMolecules(molecules);
  const picked = pickChallengeMolecule(challengePool, randomValue) ?? molecules[0];

  return {
    name: picked.name,
    formula: picked.formula,
    timeLimit: getChallengeTimeLimit(picked.atomCount),
  };
}
