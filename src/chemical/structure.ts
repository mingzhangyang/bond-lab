import { isAtomBondingValid, type ElementType } from '../chemistry.ts';
import { analyzeMolecule, isValidMoleculeGraph, isConnectedMoleculeGraph } from '../identifier.ts';
import { getMoleculeDefinition } from '../moleculeCatalog.ts';
import type { Atom, Bond } from '../store/types.ts';

export type ChemicalLinkKind = 'covalent' | 'ionic-association';
export type ChemicalRepresentation = 'molecule' | 'formula-unit';

export interface ChemicalAtom extends Atom {
  formalCharge?: number;
  isotope?: number;
}
export interface ChemicalBond extends Bond {
  kind?: ChemicalLinkKind;
}

export interface ExportedChemicalStructure {
  status: 'ready';
  smiles: string;
  atomCount: number;
  /** Ionic connectors are removed from the exported chemical structure. */
  representation: ChemicalRepresentation;
  /** Explicit charge of every atom in editor order. */
  charges: number[];
}
export interface UnsupportedChemicalStructure {
  status: 'unsupported';
  reason: string;
}
export type ChemicalStructureExport = ExportedChemicalStructure | UnsupportedChemicalStructure;

const METALS = new Set<ElementType>(['Na', 'K', 'Ca', 'Mg', 'Al', 'Cu', 'Fe']);

function unsupported(reason: string): UnsupportedChemicalStructure {
  return { status: 'unsupported', reason };
}

function formulaUnitCharges(
  name: string, atoms: readonly ChemicalAtom[],
): { charges: number[]; ionicPairs: Set<string> } | null {
  const metalIndex = atoms.findIndex((atom) => METALS.has(atom.element));
  if (metalIndex < 0) return null;
  const metal = atoms[metalIndex].element;
  const charges = atoms.map(() => 0);
  const ionicPairs = new Set<string>();

  let positive: number;
  if (name.endsWith(' Hydroxide')) {
    positive = atoms.filter((atom) => atom.element === 'O').length;
    if (!positive || positive > 3) return null;
    for (let i = 0; i < atoms.length; i++) {
      if (atoms[i].element === 'O') charges[i] = -1;
      if (atoms[i].element === 'O') ionicPairs.add(pair(metalIndex, i));
    }
  } else {
    const oxidationStates: Record<string, number> = {
      Na: 1, K: 1, Mg: 2, Ca: 2, Al: 3, Cu: 2,
    };
    positive = name === 'Iron(III) Chloride' ? 3
      : name === 'Iron(II) Chloride' ? 2 : oxidationStates[metal] ?? 0;
    if (positive === 0) return null;
    for (let i = 0; i < atoms.length; i++) {
      if (i === metalIndex) continue;
      const element = atoms[i].element;
      charges[i] = element === 'O' ? -2 : element === 'Cl' || element === 'F' ? -1 : 0;
      if (charges[i] !== 0) ionicPairs.add(pair(metalIndex, i));
    }
  }
  charges[metalIndex] = positive;
  if (charges.reduce((sum, charge) => sum + charge, 0) !== 0) return null;
  return { charges, ionicPairs };
}

function pair(a: number, b: number): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

function chargeLabel(charge: number): string {
  if (charge === 0) return '';
  return `${charge > 0 ? '+' : '-'}${Math.abs(charge) === 1 ? '' : Math.abs(charge)}`;
}

/**
 * Export only explicit atoms and bonds. Bracketed SMILES prevents RDKit from
 * silently filling in hydrogens that the player did not actually place.
 * A unique local catalog match permits known ionic formula-unit conversion;
 * arbitrary metal--nonmetal lines never imply an ionic structure by themselves.
 */
export function exportChemicalStructure(
  atoms: readonly ChemicalAtom[], bonds: readonly ChemicalBond[],
): ChemicalStructureExport {
  if (!isValidMoleculeGraph(atoms, bonds)) return unsupported('invalid_graph');
  if (atoms.length < 2 || bonds.length === 0 || !isConnectedMoleculeGraph(atoms, bonds)) {
    return unsupported('incomplete_graph');
  }
  if (atoms.length > 80 || bonds.length > 160) return unsupported('too_large');
  if (atoms.some((atom) => (atom.formalCharge !== undefined
    && (!Number.isInteger(atom.formalCharge) || Math.abs(atom.formalCharge) > 6))
    || (atom.isotope !== undefined && (!Number.isInteger(atom.isotope) || atom.isotope < 1 || atom.isotope > 300)))) {
    return unsupported('invalid_atom_metadata');
  }
  if (!atoms.every((atom) => isAtomBondingValid(atom.id, atoms, bonds))) {
    return unsupported('invalid_valence');
  }

  const identity = analyzeMolecule(atoms, bonds);
  const definition = identity.status === 'recognized'
    ? getMoleculeDefinition(identity.molecule!.name) : undefined;
  if (definition?.representation === 'simplified-compound') {
    return unsupported('simplified_compound_not_exportable');
  }

  const index = new Map(atoms.map((atom, i) => [atom.id, i]));
  const charges = atoms.map((atom) => atom.formalCharge ?? 0);
  const isFormulaUnit = definition?.representation === 'ionic-formula-unit';
  const ionicPairs = new Set<string>();
  if (isFormulaUnit) {
    const rule = formulaUnitCharges(definition.name, atoms);
    if (!rule) return unsupported('unsupported_formula_unit');
    for (let i = 0; i < atoms.length; i++) {
      if (atoms[i].formalCharge !== undefined && atoms[i].formalCharge !== rule.charges[i]) {
        return unsupported('charge_conflict');
      }
      charges[i] = rule.charges[i];
    }
    for (const value of rule.ionicPairs) ionicPairs.add(value);
  } else if (atoms.some((atom) => METALS.has(atom.element))
    && !bonds.some((bond) => bond.kind === 'ionic-association')) {
    return unsupported('metal_bond_type_not_specified');
  }

  const neighbors: { index: number; order: number }[][] = atoms.map(() => []);
  for (const bond of bonds) {
    const a = index.get(bond.source)!;
    const b = index.get(bond.target)!;
    const ionic = ionicPairs.has(pair(a, b)) || bond.kind === 'ionic-association';
    if (ionic) {
      if (!isFormulaUnit && (atoms[a].formalCharge === undefined || atoms[b].formalCharge === undefined)) {
        return unsupported('ionic_charges_required');
      }
      continue;
    }
    neighbors[a].push({ index: b, order: bond.order });
    neighbors[b].push({ index: a, order: bond.order });
  }

  const seen = new Set<number>();
  const depth = atoms.map(() => -1);
  const children: { index: number; order: number }[][] = atoms.map(() => []);
  const ringMarkers: string[][] = atoms.map(() => []);
  const roots: number[] = [];
  let nextRing = 1;

  const visit = (vertex: number, parent: number, d: number): boolean => {
    seen.add(vertex);
    depth[vertex] = d;
    for (const edge of neighbors[vertex]) {
      const next = edge.index;
      if (next === parent) continue;
      if (!seen.has(next)) {
        children[vertex].push(edge);
        if (!visit(next, vertex, d + 1)) return false;
      } else if (depth[next] < d) {
        if (nextRing > 99) return false;
        const label = nextRing < 10 ? String(nextRing) : `%${nextRing}`;
        const mark = edge.order === 2 ? '=' : edge.order === 3 ? '#' : '';
        ringMarkers[next].push(mark + label);
        ringMarkers[vertex].push(label);
        nextRing++;
      }
    }
    return true;
  };

  for (let i = 0; i < atoms.length; i++) {
    if (seen.has(i)) continue;
    roots.push(i);
    if (!visit(i, -1, 0)) return unsupported('too_many_rings');
  }

  const bondMark = (order: number) => order === 2 ? '=' : order === 3 ? '#' : '';
  const emit = (i: number): string => {
    const atom = atoms[i];
    const isotope = atom.isotope ?? '';
    const token = `[${isotope}${atom.element}${chargeLabel(charges[i])}]`;
    const branches = children[i].map((edge) => bondMark(edge.order) + emit(edge.index));
    return token + ringMarkers[i].join('')
      + branches.map((branch, at) => at < branches.length - 1 ? `(${branch})` : branch).join('');
  };
  const smiles = roots.map(emit).join('.');
  if (smiles.length > 1200) return unsupported('too_large');
  return {
    status: 'ready',
    smiles,
    atomCount: atoms.length,
    representation: isFormulaUnit ? 'formula-unit' : 'molecule',
    charges,
  };
}
