import type { Atom, Bond, ElementType } from './store.ts';

interface MoleculeBondTemplate {
  a: number;
  b: number;
  order: 1 | 2 | 3;
}

interface MoleculeTemplate {
  name: string;
  formula: string;
  atoms: ElementType[];
  bonds: MoleculeBondTemplate[];
}

interface BondOrderCounts {
  single: number;
  double: number;
  triple: number;
}

interface KnownMolecule extends MoleculeTemplate {
  atomCount: number;
  elementCounts: Record<ElementType, number>;
  bondOrderCounts: BondOrderCounts;
}

const ELEMENT_TYPES: ElementType[] = ['H', 'C', 'N', 'O', 'S', 'P', 'F', 'Cl'];
const UNKNOWN_FORMULA_ORDER: ElementType[] = ['C', 'H', 'N', 'O', 'S', 'P', 'F', 'Cl'];

const MOLECULE_TEMPLATES: MoleculeTemplate[] = [
  {
    name: 'Water',
    formula: 'H₂O',
    atoms: ['O', 'H', 'H'],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }],
  },
  {
    name: 'Methane',
    formula: 'CH₄',
    atoms: ['C', 'H', 'H', 'H', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
    ],
  },
  {
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    atoms: ['O', 'C', 'O'],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 1, b: 2, order: 2 }],
  },
  {
    name: 'Ammonia',
    formula: 'NH₃',
    atoms: ['N', 'H', 'H', 'H'],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }],
  },
  {
    name: 'Ethane',
    formula: 'C₂H₆',
    atoms: ['C', 'C', 'H', 'H', 'H', 'H', 'H', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 1, b: 5, order: 1 },
      { a: 1, b: 6, order: 1 },
      { a: 1, b: 7, order: 1 },
    ],
  },
  {
    name: 'Ethene',
    formula: 'C₂H₄',
    atoms: ['C', 'C', 'H', 'H', 'H', 'H'],
    bonds: [
      { a: 0, b: 1, order: 2 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 1, b: 4, order: 1 },
      { a: 1, b: 5, order: 1 },
    ],
  },
  {
    name: 'Ethyne',
    formula: 'C₂H₂',
    atoms: ['C', 'C', 'H', 'H'],
    bonds: [{ a: 0, b: 1, order: 3 }, { a: 0, b: 2, order: 1 }, { a: 1, b: 3, order: 1 }],
  },
  {
    name: 'Oxygen',
    formula: 'O₂',
    atoms: ['O', 'O'],
    bonds: [{ a: 0, b: 1, order: 2 }],
  },
  {
    name: 'Nitrogen',
    formula: 'N₂',
    atoms: ['N', 'N'],
    bonds: [{ a: 0, b: 1, order: 3 }],
  },
  {
    name: 'Hydrogen',
    formula: 'H₂',
    atoms: ['H', 'H'],
    bonds: [{ a: 0, b: 1, order: 1 }],
  },
  {
    name: 'Methanol',
    formula: 'CH₃OH',
    atoms: ['C', 'O', 'H', 'H', 'H', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 1, b: 5, order: 1 },
    ],
  },
  {
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    atoms: ['C', 'C', 'O', 'H', 'H', 'H', 'H', 'H', 'H'],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
      { a: 0, b: 5, order: 1 },
      { a: 1, b: 2, order: 1 },
      { a: 1, b: 6, order: 1 },
      { a: 1, b: 7, order: 1 },
      { a: 2, b: 8, order: 1 },
    ],
  },
  {
    name: 'Formaldehyde',
    formula: 'CH₂O',
    atoms: ['C', 'O', 'H', 'H'],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }],
  },
  {
    name: 'Hydrogen Cyanide',
    formula: 'HCN',
    atoms: ['H', 'C', 'N'],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 1, b: 2, order: 3 }],
  },
  {
    name: 'Hydrogen Fluoride',
    formula: 'HF',
    atoms: ['H', 'F'],
    bonds: [{ a: 0, b: 1, order: 1 }],
  },
  {
    name: 'Hydrogen Chloride',
    formula: 'HCl',
    atoms: ['H', 'Cl'],
    bonds: [{ a: 0, b: 1, order: 1 }],
  },
  {
    name: 'Hydrogen Sulfide',
    formula: 'H₂S',
    atoms: ['S', 'H', 'H'],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }],
  },
  {
    name: 'Sulfur Dioxide',
    formula: 'SO₂',
    atoms: ['O', 'S', 'O'],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 1, b: 2, order: 2 }],
  },
  {
    name: 'Phosphine',
    formula: 'PH₃',
    atoms: ['P', 'H', 'H', 'H'],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }],
  },
  {
    name: 'Phosphorus Trichloride',
    formula: 'PCl₃',
    atoms: ['P', 'Cl', 'Cl', 'Cl'],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }],
  },
  {
    name: 'Carbon Tetrachloride',
    formula: 'CCl₄',
    atoms: ['C', 'Cl', 'Cl', 'Cl', 'Cl'],
    bonds: [
      { a: 0, b: 1, order: 1 },
      { a: 0, b: 2, order: 1 },
      { a: 0, b: 3, order: 1 },
      { a: 0, b: 4, order: 1 },
    ],
  },
];

function getElementCounts(elements: ElementType[]): Record<ElementType, number> {
  const counts = Object.fromEntries(
    ELEMENT_TYPES.map((element) => [element, 0]),
  ) as Record<ElementType, number>;
  for (const element of elements) {
    counts[element]++;
  }
  return counts;
}

function getBondOrderCounts(bonds: Array<{ order: number }>): BondOrderCounts {
  let single = 0;
  let double = 0;
  let triple = 0;

  for (const bond of bonds) {
    if (bond.order === 1) single++;
    if (bond.order === 2) double++;
    if (bond.order === 3) triple++;
  }

  return { single, double, triple };
}

function toKnownMolecule(template: MoleculeTemplate): KnownMolecule {
  const elementCounts = getElementCounts(template.atoms);
  const bondCounts = getBondOrderCounts(template.bonds);

  return {
    ...template,
    atomCount: template.atoms.length,
    elementCounts,
    bondOrderCounts: bondCounts,
  };
}

function buildAdjacencyMatrix(size: number, edges: Array<{ a: number, b: number, order: number }>): number[][] {
  const matrix = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  for (const edge of edges) {
    if (edge.a < 0 || edge.b < 0 || edge.a >= size || edge.b >= size || edge.a === edge.b) continue;
    matrix[edge.a][edge.b] = Math.max(matrix[edge.a][edge.b], edge.order);
    matrix[edge.b][edge.a] = Math.max(matrix[edge.b][edge.a], edge.order);
  }
  return matrix;
}

function getWeightedDegrees(matrix: number[][]): number[] {
  return matrix.map((row) => row.reduce((sum, order) => sum + order, 0));
}

const VALID_BOND_ORDERS = new Set<number>([1, 2, 3]);

function getUndirectedBondKey(source: string, target: string): string {
  return source < target ? `${source}|${target}` : `${target}|${source}`;
}

export function isValidMoleculeGraph(atoms: Atom[], bonds: Bond[]): boolean {
  const atomIdSet = new Set(atoms.map((atom) => atom.id));
  if (atomIdSet.size !== atoms.length) return false;

  const seenPairs = new Set<string>();
  for (const bond of bonds) {
    if (!atomIdSet.has(bond.source) || !atomIdSet.has(bond.target)) return false;
    if (bond.source === bond.target) return false;
    if (!VALID_BOND_ORDERS.has(bond.order)) return false;

    const key = getUndirectedBondKey(bond.source, bond.target);
    if (seenPairs.has(key)) return false;
    seenPairs.add(key);
  }

  return true;
}

export function isConnectedMoleculeGraph(atoms: Atom[], bonds: Bond[]): boolean {
  if (atoms.length <= 1) return true;

  const atomIdSet = new Set(atoms.map((atom) => atom.id));
  if (atomIdSet.size !== atoms.length) return false;

  const adjacency = new Map<string, string[]>();
  for (const atom of atoms) {
    adjacency.set(atom.id, []);
  }

  for (const bond of bonds) {
    const sourceNeighbors = adjacency.get(bond.source);
    const targetNeighbors = adjacency.get(bond.target);
    if (!sourceNeighbors || !targetNeighbors) return false;
    sourceNeighbors.push(bond.target);
    targetNeighbors.push(bond.source);
  }

  const visited = new Set<string>();
  const queue: string[] = [atoms[0].id];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const neighbor of adjacency.get(current) ?? []) {
      if (!visited.has(neighbor)) queue.push(neighbor);
    }
  }

  return visited.size === atoms.length;
}

function matchesGraph(template: KnownMolecule, atoms: Atom[], bonds: Bond[]): boolean {
  if (atoms.length !== template.atoms.length) return false;
  if (bonds.length !== template.bonds.length) return false;

  const inputElements = atoms.map((atom) => atom.element);
  const templateCounts = template.elementCounts;
  const inputCounts = getElementCounts(inputElements);
  for (const element of ELEMENT_TYPES) {
    if (templateCounts[element] !== inputCounts[element]) return false;
  }

  const templateBondCounts = template.bondOrderCounts;
  const inputBondCounts = getBondOrderCounts(bonds);
  if (
    templateBondCounts.single !== inputBondCounts.single ||
    templateBondCounts.double !== inputBondCounts.double ||
    templateBondCounts.triple !== inputBondCounts.triple
  ) {
    return false;
  }

  const idToIndex = new Map<string, number>();
  atoms.forEach((atom, index) => {
    idToIndex.set(atom.id, index);
  });

  const templateAdj = buildAdjacencyMatrix(template.atoms.length, template.bonds);
  const inputEdges = bonds
    .map((bond) => ({
      a: idToIndex.get(bond.source) ?? -1,
      b: idToIndex.get(bond.target) ?? -1,
      order: bond.order,
    }))
    .filter((edge) => edge.a >= 0 && edge.b >= 0);
  const inputAdj = buildAdjacencyMatrix(atoms.length, inputEdges);

  const templateDegrees = getWeightedDegrees(templateAdj);
  const inputDegrees = getWeightedDegrees(inputAdj);

  const candidateInputIndexes = template.atoms.map((templateElement, templateIndex) => {
    const degree = templateDegrees[templateIndex];
    const candidates: number[] = [];

    for (let inputIndex = 0; inputIndex < atoms.length; inputIndex++) {
      if (atoms[inputIndex].element !== templateElement) continue;
      if (inputDegrees[inputIndex] !== degree) continue;
      candidates.push(inputIndex);
    }

    return candidates;
  });

  if (candidateInputIndexes.some((candidates) => candidates.length === 0)) {
    return false;
  }

  const orderedTemplateIndexes = Array.from({ length: template.atoms.length }, (_, index) => index).sort((a, b) => {
    if (candidateInputIndexes[a].length !== candidateInputIndexes[b].length) {
      return candidateInputIndexes[a].length - candidateInputIndexes[b].length;
    }
    return templateDegrees[b] - templateDegrees[a];
  });

  const mappedInputByTemplate = Array.from({ length: template.atoms.length }, () => -1);
  const usedInputIndexes = new Set<number>();

  const search = (depth: number): boolean => {
    if (depth === orderedTemplateIndexes.length) return true;

    const templateIndex = orderedTemplateIndexes[depth];
    for (const inputIndex of candidateInputIndexes[templateIndex]) {
      if (usedInputIndexes.has(inputIndex)) continue;

      let compatible = true;
      for (let otherTemplateIndex = 0; otherTemplateIndex < mappedInputByTemplate.length; otherTemplateIndex++) {
        const mappedInputIndex = mappedInputByTemplate[otherTemplateIndex];
        if (mappedInputIndex === -1) continue;

        if (templateAdj[templateIndex][otherTemplateIndex] !== inputAdj[inputIndex][mappedInputIndex]) {
          compatible = false;
          break;
        }
      }
      if (!compatible) continue;

      mappedInputByTemplate[templateIndex] = inputIndex;
      usedInputIndexes.add(inputIndex);
      if (search(depth + 1)) return true;
      usedInputIndexes.delete(inputIndex);
      mappedInputByTemplate[templateIndex] = -1;
    }

    return false;
  };

  return search(0);
}

export const KNOWN_MOLECULES: KnownMolecule[] = MOLECULE_TEMPLATES.map(toKnownMolecule);

function formatUnknownFormula(counts: Record<ElementType, number>): string {
  let formula = '';
  for (const element of UNKNOWN_FORMULA_ORDER) {
    const count = counts[element];
    if (count <= 0) continue;
    formula += `${element}${count > 1 ? count : ''}`;
  }
  return formula;
}

export function identifyMolecule(atoms: Atom[], bonds: Bond[]): { name: string, formula: string } | null {
  if (atoms.length === 0) return null;

  const counts = getElementCounts(atoms.map((atom) => atom.element));
  const formula = formatUnknownFormula(counts);
  if (formula === '') return null;

  if (!isValidMoleculeGraph(atoms, bonds) || !isConnectedMoleculeGraph(atoms, bonds)) {
    return { name: 'Unknown Molecule', formula };
  }

  for (const molecule of KNOWN_MOLECULES) {
    if (matchesGraph(molecule, atoms, bonds)) {
      return { name: molecule.name, formula: molecule.formula };
    }
  }

  return { name: 'Unknown Molecule', formula };
}
