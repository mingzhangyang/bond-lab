import assert from 'node:assert/strict';
import test from 'node:test';
import { KNOWN_MOLECULES } from './identifier.ts';
import { createMoleculeRecognizer } from './moleculeRecognition.ts';
import {
  createChallengeRound,
  getChallengeCandidateMolecules,
  getChallengeTimeLimit,
  MAX_CHALLENGE_ATOM_COUNT,
  pickChallengeMolecule,
} from './challengeTargets.ts';

test('getChallengeCandidateMolecules excludes oversized molecules from challenge pool', () => {
  const pool = getChallengeCandidateMolecules(KNOWN_MOLECULES);
  assert.ok(pool.length > 0);
  assert.ok(pool.length < KNOWN_MOLECULES.length);
  assert.equal(
    pool.every((molecule) => molecule.buildable && molecule.atomCount <= MAX_CHALLENGE_ATOM_COUNT),
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

test('getChallengeTimeLimit scales linearly with atom count', () => {
  assert.equal(getChallengeTimeLimit(0), 30);
  assert.equal(getChallengeTimeLimit(3), 45);
  assert.equal(getChallengeTimeLimit(12), 90);
});

test('createChallengeRound returns a target and derived time limit', () => {
  const candidates = getChallengeCandidateMolecules(KNOWN_MOLECULES);
  const picked = pickChallengeMolecule(candidates, 0.5);
  const round = createChallengeRound(KNOWN_MOLECULES, 0.5);

  assert.ok(picked);
  assert.equal(round?.name, picked?.name);
  assert.equal(round?.formula, picked?.formula);
  assert.equal(round?.timeLimit, getChallengeTimeLimit(picked?.atomCount ?? 0));
});

test('createChallengeRound returns null rather than selecting an oversized target', () => {
  const oversizedOnly = KNOWN_MOLECULES.filter((molecule) => molecule.atomCount > MAX_CHALLENGE_ATOM_COUNT);
  assert.ok(oversizedOnly.length > 0);
  assert.equal(createChallengeRound(oversizedOnly, 0.2), null);
  assert.equal(createChallengeRound([], 0.2), null);
});

test('future templates blocked by editor rules are never issued as challenges', () => {
  const { knownMolecules } = createMoleculeRecognizer([{
    name: 'Unbuildable test fixture', formula: 'H2O', atoms: ['O', 'H', 'H'],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, order: 1 }],
  }]);
  assert.equal(knownMolecules[0].buildable, false);
  assert.deepEqual(getChallengeCandidateMolecules(knownMolecules), []);
  assert.equal(createChallengeRound(knownMolecules), null);
});

test('calcium hydroxide and ozone are eligible after the shared rules are applied', () => {
  const names = new Set(getChallengeCandidateMolecules(KNOWN_MOLECULES).map((molecule) => molecule.name));
  assert.equal(names.has('Calcium Hydroxide'), true);
  assert.equal(names.has('Ozone'), true);
});
