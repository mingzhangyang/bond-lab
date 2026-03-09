import assert from 'node:assert/strict';
import test from 'node:test';
import { getMoleculeInfo } from './moleculeInfo.ts';

test('getMoleculeInfo returns UI metadata for carbon monoxide', () => {
  assert.deepEqual(getMoleculeInfo('Carbon Monoxide'), {
    structure: 'C≡O',
    fact: 'Carbon monoxide is a linear, strongly bound molecule that is dangerous because it binds tightly to hemoglobin.',
  });
});

test('getMoleculeInfo returns null for unknown molecules', () => {
  assert.equal(getMoleculeInfo('Unknown Molecule'), null);
});