import { Atom, Bond } from './store';

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

  // Helper to check exact match
  const match = (c: number, h: number, n: number, o: number, s: number, d: number, t: number) => {
    return counts.C === c && counts.H === h && counts.N === n && counts.O === o &&
           bondCounts.single === s && bondCounts.double === d && bondCounts.triple === t;
  };

  if (match(0, 2, 0, 1, 2, 0, 0)) return { name: 'Water', formula: 'H₂O' };
  if (match(1, 4, 0, 0, 4, 0, 0)) return { name: 'Methane', formula: 'CH₄' };
  if (match(1, 0, 0, 2, 0, 2, 0)) return { name: 'Carbon Dioxide', formula: 'CO₂' };
  if (match(0, 3, 1, 0, 3, 0, 0)) return { name: 'Ammonia', formula: 'NH₃' };
  if (match(2, 6, 0, 0, 7, 0, 0)) return { name: 'Ethane', formula: 'C₂H₆' };
  if (match(2, 4, 0, 0, 4, 1, 0)) return { name: 'Ethene', formula: 'C₂H₄' };
  if (match(2, 2, 0, 0, 2, 0, 1)) return { name: 'Ethyne', formula: 'C₂H₂' };
  if (match(0, 0, 0, 2, 0, 1, 0)) return { name: 'Oxygen', formula: 'O₂' };
  if (match(0, 0, 2, 0, 0, 0, 1)) return { name: 'Nitrogen', formula: 'N₂' };
  if (match(0, 2, 0, 0, 1, 0, 0)) return { name: 'Hydrogen', formula: 'H₂' };
  if (match(1, 4, 0, 1, 5, 0, 0)) return { name: 'Methanol', formula: 'CH₃OH' };
  if (match(2, 6, 0, 1, 8, 0, 0)) return { name: 'Ethanol', formula: 'C₂H₅OH' };
  if (match(1, 2, 0, 1, 2, 1, 0)) return { name: 'Formaldehyde', formula: 'CH₂O' };
  if (match(1, 1, 1, 0, 1, 0, 1)) return { name: 'Hydrogen Cyanide', formula: 'HCN' };

  // Generate generic formula
  let formula = '';
  if (counts.C > 0) formula += `C${counts.C > 1 ? counts.C : ''}`;
  if (counts.H > 0) formula += `H${counts.H > 1 ? counts.H : ''}`;
  if (counts.N > 0) formula += `N${counts.N > 1 ? counts.N : ''}`;
  if (counts.O > 0) formula += `O${counts.O > 1 ? counts.O : ''}`;

  if (formula === '') return null;

  return { name: 'Unknown Molecule', formula };
}
