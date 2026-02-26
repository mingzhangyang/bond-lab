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

interface KnownMolecule extends MoleculeTemplate {
  c: number;
  h: number;
  n: number;
  o: number;
  s: number;
  d: number;
  t: number;
}

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
];

function getElementCounts(elements: ElementType[]): Record<ElementType, number> {
  const counts: Record<ElementType, number> = { H: 0, C: 0, N: 0, O: 0 };
  for (const element of elements) {
    counts[element]++;
  }
  return counts;
}

function getBondOrderCounts(bonds: Array<{ order: number }>): { single: number, double: number, triple: number } {
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
    c: elementCounts.C,
    h: elementCounts.H,
    n: elementCounts.N,
    o: elementCounts.O,
    s: bondCounts.single,
    d: bondCounts.double,
    t: bondCounts.triple,
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

function matchesGraph(template: MoleculeTemplate, atoms: Atom[], bonds: Bond[]): boolean {
  if (atoms.length !== template.atoms.length) return false;
  if (bonds.length !== template.bonds.length) return false;

  const inputElements = atoms.map((atom) => atom.element);
  const templateCounts = getElementCounts(template.atoms);
  const inputCounts = getElementCounts(inputElements);
  if (
    templateCounts.H !== inputCounts.H ||
    templateCounts.C !== inputCounts.C ||
    templateCounts.N !== inputCounts.N ||
    templateCounts.O !== inputCounts.O
  ) {
    return false;
  }

  const templateBondCounts = getBondOrderCounts(template.bonds);
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

export function identifyMolecule(atoms: Atom[], bonds: Bond[]): { name: string, formula: string } | null {
  if (atoms.length === 0) return null;

  for (const molecule of KNOWN_MOLECULES) {
    if (matchesGraph(molecule, atoms, bonds)) {
      return { name: molecule.name, formula: molecule.formula };
    }
  }

  const counts = getElementCounts(atoms.map((atom) => atom.element));

  let formula = '';
  if (counts.C > 0) formula += `C${counts.C > 1 ? counts.C : ''}`;
  if (counts.H > 0) formula += `H${counts.H > 1 ? counts.H : ''}`;
  if (counts.N > 0) formula += `N${counts.N > 1 ? counts.N : ''}`;
  if (counts.O > 0) formula += `O${counts.O > 1 ? counts.O : ''}`;

  if (formula === '') return null;
  return { name: 'Unknown Molecule', formula };
}
