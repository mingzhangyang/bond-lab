import assert from 'node:assert/strict';
import test from 'node:test';
import { getAtomBondLimit, getAtomBondTarget, isAtomBondingValid } from './chemistry.ts';
import type { BondingAtom, BondingBond } from './chemistry.ts';

const oxygen: BondingAtom[] = [0, 1, 2].map((i) => ({ id: `o${i}`, element: 'O' }));
const allValid = (atoms: BondingAtom[], bonds: BondingBond[]) => atoms.every((atom) => isAtomBondingValid(atom.id, atoms, bonds));

for (const orders of [[1, 2], [2, 1]]) {
  test(`ozone permits only its scoped resonance representation ${orders}`, () => {
    const bonds = [
      { source: 'o0', target: 'o1', order: orders[0] },
      { source: 'o1', target: 'o2', order: orders[1] },
    ];
    assert.equal(allValid(oxygen, bonds), true);
    assert.equal(getAtomBondLimit('o1', oxygen, bonds), 3);
    assert.equal(getAtomBondTarget('o1', oxygen, bonds), 3);
    assert.equal(getAtomBondTarget('o0', oxygen, bonds), orders[0]);
    assert.equal(getAtomBondTarget('o2', oxygen, bonds), orders[1]);
    assert.equal(allValid([...oxygen, { id: 'spare', element: 'H' }], bonds), true);
  });
}

test('oxygen limits are not globally relaxed for water, chains, rings or double-double ozone', () => {
  const cases: [BondingAtom[], BondingBond[]][] = [
    [[...oxygen, { id: 'o3', element: 'O' }], [
      { source: 'o0', target: 'o1', order: 2 },
      { source: 'o1', target: 'o2', order: 1 },
      { source: 'o2', target: 'o3', order: 1 },
    ]],
    [oxygen, [
      { source: 'o0', target: 'o1', order: 2 },
      { source: 'o1', target: 'o2', order: 2 },
    ]],
    [oxygen, [
      { source: 'o0', target: 'o1', order: 2 },
      { source: 'o1', target: 'o2', order: 1 },
      { source: 'o2', target: 'o0', order: 1 },
    ]],
    [[{ id: 'o', element: 'O' }, ...[0, 1, 2].map((i) => ({ id: `h${i}`, element: 'H' as const }))],
      [0, 1, 2].map((i) => ({ source: 'o', target: `h${i}`, order: 1 }))],
  ];
  for (const [atoms, bonds] of cases) assert.equal(allValid(atoms, bonds), false);
});

test('carbon monoxide exception is component-local and does not survive attaching an extra atom', () => {
  const atoms: BondingAtom[] = [
    { id: 'c', element: 'C' }, { id: 'o', element: 'O' }, { id: 'h', element: 'H' },
  ];
  const bonds = [{ source: 'c', target: 'o', order: 3 }];
  assert.equal(allValid(atoms, bonds), true);
  assert.equal(getAtomBondTarget('c', atoms, bonds), 3);
  assert.equal(getAtomBondTarget('o', atoms, bonds), 3);
  assert.equal(allValid(atoms, [...bonds, { source: 'c', target: 'h', order: 1 }]), false);
});
