import assert from 'node:assert/strict';
import test from 'node:test';
import { KNOWN_MOLECULES } from './identifier.ts';
import {
  getChallengeCandidateMolecules,
  MAX_CHALLENGE_ATOM_COUNT,
  pickChallengeMolecule,
} from './challengeTargets.ts';

test('getChallengeCandidateMolecules excludes oversized molecules from challenge pool', () => {
  const pool = getChallengeCandidateMolecules(KNOWN_MOLECULES);
  assert.ok(pool.length > 0);
  assert.ok(pool.length < KNOWN_MOLECULES.length);
  assert.equal(
    pool.every((molecule) => molecule.atomCount <= MAX_CHALLENGE_ATOM_COUNT),
    true,
  );
});

test('pickChallengeMolecule is deterministic for a provided random value', () => {
  const candidates = getChallengeCandidateMolecules(KNOWN_MOLECULES);
  const first = pickChallengeMolecule(candidates, 0);
  const middle = pickChallengeMolecule(candidates, 0.5);
  const last = pickChallengeMolecule(candidates, 0.999999);

  assert.equal(first, candidates[0]);
  assert.equal(middle, candidates[Math.floor(candidates.length * 0.5)]);
  assert.equal(last, candidates[candidates.length - 1]);
});

test('pickChallengeMolecule returns null for an empty pool', () => {
  assert.equal(pickChallengeMolecule([], 0.5), null);
});
