import { Atom, Bond } from './store';

export const KNOWN_MOLECULES = [
  { name: 'Water', formula: 'H₂O', c: 0, h: 2, n: 0, o: 1, s: 2, d: 0, t: 0 },
  { name: 'Methane', formula: 'CH₄', c: 1, h: 4, n: 0, o: 0, s: 4, d: 0, t: 0 },
  { name: 'Carbon Dioxide', formula: 'CO₂', c: 1, h: 0, n: 0, o: 2, s: 0, d: 2, t: 0 },
  { name: 'Ammonia', formula: 'NH₃', c: 0, h: 3, n: 1, o: 0, s: 3, d: 0, t: 0 },
  { name: 'Ethane', formula: 'C₂H₆', c: 2, h: 6, n: 0, o: 0, s: 7, d: 0, t: 0 },
  { name: 'Ethene', formula: 'C₂H₄', c: 2, h: 4, n: 0, o: 0, s: 4, d: 1, t: 0 },
  { name: 'Ethyne', formula: 'C₂H₂', c: 2, h: 2, n: 0, o: 0, s: 2, d: 0, t: 1 },
  { name: 'Oxygen', formula: 'O₂', c: 0, h: 0, n: 0, o: 2, s: 0, d: 1, t: 0 },
  { name: 'Nitrogen', formula: 'N₂', c: 0, h: 0, n: 2, o: 0, s: 0, d: 0, t: 1 },
  { name: 'Hydrogen', formula: 'H₂', c: 0, h: 2, n: 0, o: 0, s: 1, d: 0, t: 0 },
  { name: 'Methanol', formula: 'CH₃OH', c: 1, h: 4, n: 0, o: 1, s: 5, d: 0, t: 0 },
  { name: 'Ethanol', formula: 'C₂H₅OH', c: 2, h: 6, n: 0, o: 1, s: 8, d: 0, t: 0 },
  { name: 'Formaldehyde', formula: 'CH₂O', c: 1, h: 2, n: 0, o: 1, s: 2, d: 1, t: 0 },
  { name: 'Hydrogen Cyanide', formula: 'HCN', c: 1, h: 1, n: 1, o: 0, s: 1, d: 0, t: 1 },
];

export function identifyMolecule(atoms: Atom[], bonds: Bond[]): { name: string, formula: string } | null {
  if (atoms.length === 0) return null;

  const counts: Record<string, number> = { H: 0, C: 0, N: 0, O: 0 };
  for (const a of atoms) counts[a.element]++;

  const bondCounts = { single: 0, double: 0, triple: 0 };
  for (const b of bonds) {
    if (b.order === 1) bondCounts.single++;
    if (b.order === 2) bondCounts.double++;
    if (b.order === 3) bondCounts.triple++;
  }

  for (const mol of KNOWN_MOLECULES) {
    if (counts.C === mol.c && counts.H === mol.h && counts.N === mol.n && counts.O === mol.o &&
        bondCounts.single === mol.s && bondCounts.double === mol.d && bondCounts.triple === mol.t) {
      return { name: mol.name, formula: mol.formula };
    }
  }

  // Generate generic formula
  let formula = '';
  if (counts.C > 0) formula += `C${counts.C > 1 ? counts.C : ''}`;
  if (counts.H > 0) formula += `H${counts.H > 1 ? counts.H : ''}`;
  if (counts.N > 0) formula += `N${counts.N > 1 ? counts.N : ''}`;
  if (counts.O > 0) formula += `O${counts.O > 1 ? counts.O : ''}`;

  if (formula === '') return null;

  return { name: 'Unknown Molecule', formula };
}
