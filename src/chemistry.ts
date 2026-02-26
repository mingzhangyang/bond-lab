export type ElementType = 'H' | 'C' | 'N' | 'O';

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
};

const BOND_LENGTHS: BondPropertyTable = {
  'H-H': { 1: 0.74 },
  'C-H': { 1: 1.09 },
  'C-C': { 1: 1.54, 2: 1.34, 3: 1.20 },
  'C-N': { 1: 1.47, 2: 1.29, 3: 1.16 },
  'C-O': { 1: 1.43, 2: 1.23, 3: 1.13 },
  'N-H': { 1: 1.01 },
  'N-N': { 1: 1.45, 2: 1.25, 3: 1.10 },
  'N-O': { 1: 1.40, 2: 1.21 },
  'O-H': { 1: 0.96 },
  'O-O': { 1: 1.48, 2: 1.21 },
};

const BOND_ENERGIES: BondPropertyTable = {
  'H-H': { 1: 432 },
  'C-H': { 1: 413 },
  'C-C': { 1: 347, 2: 614, 3: 839 },
  'C-N': { 1: 305, 2: 615, 3: 891 },
  'C-O': { 1: 358, 2: 799, 3: 1072 },
  'N-H': { 1: 391 },
  'N-N': { 1: 160, 2: 418, 3: 941 },
  'N-O': { 1: 201, 2: 607 },
  'O-H': { 1: 467 },
  'O-O': { 1: 146, 2: 495 },
};

function getPairKey(el1: ElementType, el2: ElementType): string {
  return el1 < el2 ? `${el1}-${el2}` : `${el2}-${el1}`;
}

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
