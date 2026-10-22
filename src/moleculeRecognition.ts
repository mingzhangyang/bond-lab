import {
  ELEMENT_DISPLAY_ORDER,
  isAtomBondingValid,
  type BondingAtom,
  type BondingBond,
  type ElementType,
} from './chemistry.ts';
import type { MoleculeTemplate } from './data/moleculeTemplates.ts';

export interface MoleculeMatch {
  name: string;
  formula: string;
}

export interface KnownMolecule extends MoleculeTemplate {
  atomCount: number;
  buildable: boolean;
  elementCounts: Record<ElementType, number>;
  bondOrderCounts: { single: number; double: number; triple: number };
}

export type RecognitionStatus = 'empty' | 'incomplete' | 'invalid' | 'disconnected'
  | 'unknown' | 'ambiguous' | 'recognized';

export interface MoleculeRecognition {
  status: RecognitionStatus;
  molecule: MoleculeMatch | null;
  matches: MoleculeMatch[];
  /** Number of indexed candidates, not the number of templates in the catalog. */
  candidateCount: number;
}

export interface PreparedMoleculeGraph {
  elements: ElementType[];
  neighbors: Map<number, number>[];
  labels: string[];
  fingerprint: string;
  componentCount: number;
  elementCounts: Record<ElementType, number>;
  bondOrderCounts: KnownMolecule['bondOrderCounts'];
}

const SUPPORTED_ELEMENTS = new Set<string>(ELEMENT_DISPLAY_ORDER);
const BOND_ORDERS = new Set([1, 2, 3]);

/** Validate once and build a sparse, ID-independent graph in O(V + E) space. */
export function prepareMoleculeGraph(
  atoms: readonly BondingAtom[],
  bonds: readonly BondingBond[],
): PreparedMoleculeGraph | null {
  if (!Array.isArray(atoms) || !Array.isArray(bonds)) return null;
  const indices = new Map<string, number>();
  const elements: ElementType[] = [];
  const elementCounts = Object.fromEntries(
    ELEMENT_DISPLAY_ORDER.map((element) => [element, 0]),
  ) as Record<ElementType, number>;

  for (const atom of atoms) {
    if (!atom || typeof atom.id !== 'string' || atom.id.length === 0
      || indices.has(atom.id) || !SUPPORTED_ELEMENTS.has(atom.element)) return null;
    indices.set(atom.id, elements.length);
    elements.push(atom.element);
    elementCounts[atom.element]++;
  }

  const neighbors = elements.map(() => new Map<number, number>());
  const bondOrderCounts = { single: 0, double: 0, triple: 0 };
  for (const bond of bonds) {
    if (!bond || !BOND_ORDERS.has(bond.order)) return null;
    const a = indices.get(bond.source);
    const b = indices.get(bond.target);
    if (a === undefined || b === undefined || a === b || neighbors[a].has(b)) return null;
    neighbors[a].set(b, bond.order);
    neighbors[b].set(a, bond.order);
    if (bond.order === 1) bondOrderCounts.single++;
    if (bond.order === 2) bondOrderCounts.double++;
    if (bond.order === 3) bondOrderCounts.triple++;
  }

  let componentCount = 0;
  const visited = new Set<number>();
  for (let start = 0; start < elements.length; start++) {
    if (visited.has(start)) continue;
    componentCount++;
    const pending = [start];
    visited.add(start);
    for (let i = 0; i < pending.length; i++) {
      for (const next of neighbors[pending[i]].keys()) {
        if (!visited.has(next)) {
          visited.add(next);
          pending.push(next);
        }
      }
    }
  }

  // This is only an isomorphism-invariant index key, never proof of identity.
  const labels = elements.map((element, i) => `${element}|${
    [...neighbors[i]].map(([other, order]) => `${elements[other]}:${order}`).sort().join(',')
  }`);
  return {
    elements, neighbors, labels, componentCount, elementCounts, bondOrderCounts,
    fingerprint: [...labels].sort().join(';'),
  };
}

export function isValidMoleculeGraph(atoms: readonly BondingAtom[], bonds: readonly BondingBond[]): boolean {
  return prepareMoleculeGraph(atoms, bonds) !== null;
}

export function isConnectedMoleculeGraph(atoms: readonly BondingAtom[], bonds: readonly BondingBond[]): boolean {
  const graph = prepareMoleculeGraph(atoms, bonds);
  return graph !== null && graph.componentCount <= 1;
}

function matchesGraph(template: PreparedMoleculeGraph, input: PreparedMoleculeGraph): boolean {
  if (template.fingerprint !== input.fingerprint) return false;
  const candidates = template.labels.map((label) => input.labels
    .flatMap((other, index) => other === label ? [index] : []));
  const order = template.elements.map((_, index) => index).sort((a, b) =>
    candidates[a].length - candidates[b].length || template.neighbors[b].size - template.neighbors[a].size);
  const mapped = new Map<number, number>();
  const used = new Set<number>();

  const search = (depth: number): boolean => {
    if (depth === order.length) return true;
    const vertex = order[depth];
    for (const candidate of candidates[vertex]) {
      if (used.has(candidate)) continue;
      let compatible = true;
      for (const [other, matched] of mapped) {
        if (template.neighbors[vertex].get(other) !== input.neighbors[candidate].get(matched)) {
          compatible = false;
          break;
        }
      }
      if (!compatible) continue;
      mapped.set(vertex, candidate);
      used.add(candidate);
      if (search(depth + 1)) return true;
      mapped.delete(vertex);
      used.delete(candidate);
    }
    return false;
  };
  return search(0);
}

/** A composition fallback, not an inferred compound name or structural formula. */
function formatComposition(counts: Record<ElementType, number>): string {
  const elements = ELEMENT_DISPLAY_ORDER.filter((element) => counts[element] > 0).sort();
  const ordered = counts.C > 0
    ? ['C', ...(counts.H > 0 ? ['H'] : []), ...elements.filter((element) => element !== 'C' && element !== 'H')]
    : elements;
  return ordered.map((element) => {
    const count = counts[element as ElementType];
    return `${element}${count > 1 ? count : ''}`;
  }).join('');
}

export function templateToMoleculeGraph(template: MoleculeTemplate) {
  return {
    atoms: template.atoms.map((element, index) => ({ id: `a${index}`, element })),
    bonds: template.bonds.map(({ a, b, order }, index) => ({
      id: `b${index}`, source: `a${a}`, target: `a${b}`, order,
    })),
  };
}

/** Use the same incremental single-bond/upgrade rules as the editor. */
export function canBuildMolecule(template: MoleculeTemplate): boolean {
  const { atoms, bonds } = templateToMoleculeGraph(template);
  const graph = prepareMoleculeGraph(atoms, bonds);
  if (!graph || atoms.length < 2 || graph.componentCount !== 1) return false;
  const built: BondingBond[] = [];
  for (const bond of bonds) {
    const next = { ...bond, order: 0 };
    built.push(next);
    for (let order = 1; order <= bond.order; order++) {
      next.order = order;
      if (!atoms.every((atom) => isAtomBondingValid(atom.id, atoms, built))) return false;
    }
  }
  return true;
}

/** Compile templates once; each edit prepares the input only once. */
export function createMoleculeRecognizer(templates: readonly MoleculeTemplate[]) {
  const index = new Map<string, { molecule: KnownMolecule; graph: PreparedMoleculeGraph }[]>();
  const names = new Set<string>();
  const knownMolecules = templates.map((template): KnownMolecule => {
    if (names.has(template.name)) throw new Error(`Duplicate molecule name: ${template.name}`);
    names.add(template.name);
    const input = templateToMoleculeGraph(template);
    const graph = prepareMoleculeGraph(input.atoms, input.bonds);
    if (!template.name || !template.formula || !graph || graph.elements.length < 2 || graph.componentCount !== 1) {
      throw new Error(`Invalid molecule template: ${template.name}`);
    }
    const molecule: KnownMolecule = {
      name: template.name,
      formula: template.formula,
      atoms: [...template.atoms],
      bonds: template.bonds.map((bond) => Object.freeze({ ...bond })),
      atomCount: template.atoms.length,
      buildable: canBuildMolecule(template),
      elementCounts: Object.freeze({ ...graph.elementCounts }),
      bondOrderCounts: Object.freeze({ ...graph.bondOrderCounts }),
    };
    Object.freeze(molecule.atoms);
    Object.freeze(molecule.bonds);
    Object.freeze(molecule);
    const bucket = index.get(graph.fingerprint) ?? [];
    bucket.push({ molecule, graph });
    index.set(graph.fingerprint, bucket);
    return molecule;
  });

  const analyze = (atoms: readonly BondingAtom[], bonds: readonly BondingBond[]): MoleculeRecognition => {
    const graph = prepareMoleculeGraph(atoms, bonds);
    const empty = (status: RecognitionStatus): MoleculeRecognition => ({
      status, molecule: null, matches: [], candidateCount: 0,
    });
    if (!graph) return empty('invalid');
    if (atoms.length === 0) return empty('empty');
    if (atoms.length < 2) return empty('incomplete');
    if (graph.componentCount !== 1) return empty('disconnected');

    const candidates = index.get(graph.fingerprint) ?? [];
    const matches = candidates.filter((candidate) => matchesGraph(candidate.graph, graph))
      .map(({ molecule }) => ({ name: molecule.name, formula: molecule.formula }));
    const status = matches.length === 1 ? 'recognized' : matches.length > 1 ? 'ambiguous' : 'unknown';
    return {
      status,
      molecule: matches.length === 1 ? matches[0] : {
        name: 'Unknown Molecule', formula: formatComposition(graph.elementCounts),
      },
      matches,
      candidateCount: candidates.length,
    };
  };

  return Object.freeze({
    knownMolecules: Object.freeze(knownMolecules),
    analyze,
    identify: (atoms: readonly BondingAtom[], bonds: readonly BondingBond[]) => analyze(atoms, bonds).molecule,
  });
}
