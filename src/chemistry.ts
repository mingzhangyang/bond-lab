export type ElementType = 'H' | 'C' | 'N' | 'O' | 'S' | 'P' | 'F' | 'Cl';

export interface ElementData {
  symbol: ElementType;
  name: string;
  color: string;
  vdwRadius: number;
  covalentRadius: number;
  valence: number;
  maxBonds: number;
  electronegativity: number;
}

export interface BondChemistry {
  bondLength: number;
  bondEnergy: number;
  rotatable: boolean;
}

export interface BondChemistryInput extends Partial<BondChemistry> {
  order: number;
}

type BondPropertyTable = Record<string, Record<number, number>>;
type BondPropertyEntry = [ElementType, ElementType, Record<number, number>];

function getPairKey(el1: ElementType, el2: ElementType): string {
  return el1 < el2 ? `${el1}-${el2}` : `${el2}-${el1}`;
}

function buildBondPropertyTable(entries: BondPropertyEntry[]): BondPropertyTable {
  const table: BondPropertyTable = {};
  for (const [el1, el2, values] of entries) {
    table[getPairKey(el1, el2)] = values;
  }
  return table;
}

export const ELEMENTS: Record<ElementType, ElementData> = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    color: '#FFFFFF',
    vdwRadius: 1.2,
    covalentRadius: 0.31,
    valence: 1,
    maxBonds: 1,
    electronegativity: 2.20,
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    color: '#444444',
    vdwRadius: 1.7,
    covalentRadius: 0.76,
    valence: 4,
    maxBonds: 4,
    electronegativity: 2.55,
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    color: '#2244FF',
    vdwRadius: 1.55,
    covalentRadius: 0.71,
    valence: 5,
    maxBonds: 3,
    electronegativity: 3.04,
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    color: '#FF2222',
    vdwRadius: 1.52,
    covalentRadius: 0.66,
    valence: 6,
    maxBonds: 2,
    electronegativity: 3.44,
  },
  S: {
    symbol: 'S',
    name: 'Sulfur',
    color: '#FFC857',
    vdwRadius: 1.8,
    covalentRadius: 1.05,
    valence: 6,
    maxBonds: 6,
    electronegativity: 2.58,
  },
  P: {
    symbol: 'P',
    name: 'Phosphorus',
    color: '#FF9F1C',
    vdwRadius: 1.8,
    covalentRadius: 1.07,
    valence: 5,
    maxBonds: 5,
    electronegativity: 2.19,
  },
  F: {
    symbol: 'F',
    name: 'Fluorine',
    color: '#8DE969',
    vdwRadius: 1.47,
    covalentRadius: 0.57,
    valence: 7,
    maxBonds: 1,
    electronegativity: 3.98,
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    color: '#4CD964',
    vdwRadius: 1.75,
    covalentRadius: 1.02,
    valence: 7,
    maxBonds: 1,
    electronegativity: 3.16,
  },
};

const BOND_LENGTHS: BondPropertyTable = buildBondPropertyTable([
  ['H', 'H', { 1: 0.74 }],
  ['C', 'H', { 1: 1.09 }],
  ['C', 'C', { 1: 1.54, 2: 1.34, 3: 1.20 }],
  ['C', 'N', { 1: 1.47, 2: 1.29, 3: 1.16 }],
  ['C', 'O', { 1: 1.43, 2: 1.23, 3: 1.13 }],
  ['N', 'H', { 1: 1.01 }],
  ['N', 'N', { 1: 1.45, 2: 1.25, 3: 1.10 }],
  ['N', 'O', { 1: 1.40, 2: 1.21 }],
  ['O', 'H', { 1: 0.96 }],
  ['O', 'O', { 1: 1.48, 2: 1.21 }],
  ['H', 'F', { 1: 0.92 }],
  ['H', 'Cl', { 1: 1.27 }],
  ['C', 'F', { 1: 1.35 }],
  ['C', 'Cl', { 1: 1.77 }],
  ['C', 'S', { 1: 1.82, 2: 1.60 }],
  ['C', 'P', { 1: 1.84 }],
  ['S', 'H', { 1: 1.34 }],
  ['S', 'O', { 1: 1.58, 2: 1.43 }],
  ['S', 'S', { 1: 2.05 }],
  ['S', 'Cl', { 1: 2.07 }],
  ['P', 'H', { 1: 1.42 }],
  ['P', 'O', { 1: 1.63, 2: 1.50 }],
  ['P', 'P', { 1: 2.21 }],
  ['P', 'F', { 1: 1.56 }],
  ['P', 'Cl', { 1: 2.04 }],
]);

const BOND_ENERGIES: BondPropertyTable = buildBondPropertyTable([
  ['H', 'H', { 1: 432 }],
  ['C', 'H', { 1: 413 }],
  ['C', 'C', { 1: 347, 2: 614, 3: 839 }],
  ['C', 'N', { 1: 305, 2: 615, 3: 891 }],
  ['C', 'O', { 1: 358, 2: 799, 3: 1072 }],
  ['N', 'H', { 1: 391 }],
  ['N', 'N', { 1: 160, 2: 418, 3: 941 }],
  ['N', 'O', { 1: 201, 2: 607 }],
  ['O', 'H', { 1: 467 }],
  ['O', 'O', { 1: 146, 2: 495 }],
  ['H', 'F', { 1: 567 }],
  ['H', 'Cl', { 1: 431 }],
  ['C', 'F', { 1: 485 }],
  ['C', 'Cl', { 1: 338 }],
  ['C', 'S', { 1: 272, 2: 573 }],
  ['C', 'P', { 1: 264 }],
  ['S', 'H', { 1: 347 }],
  ['S', 'O', { 1: 364, 2: 523 }],
  ['S', 'S', { 1: 266 }],
  ['S', 'Cl', { 1: 253 }],
  ['P', 'H', { 1: 322 }],
  ['P', 'O', { 1: 335, 2: 544 }],
  ['P', 'P', { 1: 201 }],
  ['P', 'F', { 1: 490 }],
  ['P', 'Cl', { 1: 326 }],
]);

function clampBondOrder(order: number): 1 | 2 | 3 {
  if (order <= 1) return 1;
  if (order >= 3) return 3;
  return 2;
}

function getFallbackBondLength(el1: ElementType, el2: ElementType, order: 1 | 2 | 3): number {
  const base = ELEMENTS[el1].covalentRadius + ELEMENTS[el2].covalentRadius;
  if (order === 2) return base * 0.9;
  if (order === 3) return base * 0.82;
  return base;
}

function getFallbackBondEnergy(order: 1 | 2 | 3): number {
  return 250 * order;
}

export function getBondChemistry(
  elementA: ElementType,
  elementB: ElementType,
  orderInput: number,
): BondChemistry {
  const order = clampBondOrder(orderInput);
  const pair = getPairKey(elementA, elementB);
  const bondLength = BOND_LENGTHS[pair]?.[order] ?? getFallbackBondLength(elementA, elementB, order);
  const bondEnergy = BOND_ENERGIES[pair]?.[order] ?? getFallbackBondEnergy(order);

  return {
    bondLength,
    bondEnergy,
    rotatable: order === 1,
  };
}

export function getFallbackBondChemistry(orderInput: number): BondChemistry {
  const order = clampBondOrder(orderInput);
  return {
    bondLength: getFallbackBondLength('C', 'C', order),
    bondEnergy: getFallbackBondEnergy(order),
    rotatable: order === 1,
  };
}

export function normalizeBondChemistry(
  bond: BondChemistryInput,
  elementA?: ElementType,
  elementB?: ElementType,
): BondChemistry {
  const derived = elementA && elementB
    ? getBondChemistry(elementA, elementB, bond.order)
    : getFallbackBondChemistry(bond.order);

  return {
    bondLength: bond.bondLength ?? derived.bondLength,
    bondEnergy: bond.bondEnergy ?? derived.bondEnergy,
    rotatable: bond.rotatable ?? derived.rotatable,
  };
}
