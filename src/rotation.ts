import type { Bond } from './store.ts';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

interface AtomLike {
  id: string;
}

interface BondLike {
  id?: string;
  order?: number;
  rotatable?: boolean;
  source: string;
  target: string;
}

export function isBondRotatable(bond: Pick<Bond, 'order' | 'rotatable'>): boolean {
  return bond.rotatable ?? bond.order === 1;
}

function isSameUndirectedBond(
  a: Pick<BondLike, 'id' | 'source' | 'target'>,
  b: Pick<BondLike, 'id' | 'source' | 'target'>,
): boolean {
  if (a.id && b.id && a.id === b.id) return true;
  return (
    (a.source === b.source && a.target === b.target) ||
    (a.source === b.target && a.target === b.source)
  );
}

export function isBondInCycle(
  bond: Pick<BondLike, 'id' | 'source' | 'target'>,
  bonds: Array<Pick<BondLike, 'id' | 'source' | 'target'>>,
): boolean {
  const adjacency = new Map<string, string[]>();
  for (const edge of bonds) {
    if (isSameUndirectedBond(edge, bond)) continue;
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
    adjacency.get(edge.source)!.push(edge.target);
    adjacency.get(edge.target)!.push(edge.source);
  }

  const target = bond.target;
  const queue: string[] = [bond.source];
  const visited = new Set<string>();
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    if (current === target) return true;
    visited.add(current);

    for (const neighbor of adjacency.get(current) ?? []) {
      if (!visited.has(neighbor)) queue.push(neighbor);
    }
  }

  return false;
}

export function canRotateBond(
  bond: Pick<Bond, 'id' | 'source' | 'target' | 'order' | 'rotatable'>,
  bonds: Array<Pick<BondLike, 'id' | 'source' | 'target'>>,
): boolean {
  if (!isBondRotatable(bond)) return false;
  return !isBondInCycle(bond, bonds);
}

export function getRotationGroupAtomIds(
  atoms: AtomLike[],
  bonds: BondLike[],
  anchorAtomId: string,
  rotatingRootAtomId: string,
): string[] {
  const atomIdSet = new Set(atoms.map((atom) => atom.id));
  if (!atomIdSet.has(anchorAtomId) || !atomIdSet.has(rotatingRootAtomId)) return [];
  if (anchorAtomId === rotatingRootAtomId) return [];

  const adjacency = new Map<string, string[]>();
  for (const atom of atoms) {
    adjacency.set(atom.id, []);
  }
  for (const bond of bonds) {
    adjacency.get(bond.source)?.push(bond.target);
    adjacency.get(bond.target)?.push(bond.source);
  }

  const visited = new Set<string>([anchorAtomId]);
  const queue: string[] = [rotatingRootAtomId];
  const result: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    result.push(current);

    for (const neighbor of adjacency.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}

function normalizeAxis(axis: Position3D): Position3D | null {
  const magnitude = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
  if (magnitude < 1e-9) return null;
  return {
    x: axis.x / magnitude,
    y: axis.y / magnitude,
    z: axis.z / magnitude,
  };
}

export function rotatePointAroundAxis(
  point: Position3D,
  origin: Position3D,
  axis: Position3D,
  angleRad: number,
): Position3D {
  const unitAxis = normalizeAxis(axis);
  if (!unitAxis) return { ...point };

  const px = point.x - origin.x;
  const py = point.y - origin.y;
  const pz = point.z - origin.z;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const { x: kx, y: ky, z: kz } = unitAxis;

  const dot = kx * px + ky * py + kz * pz;
  const crossX = ky * pz - kz * py;
  const crossY = kz * px - kx * pz;
  const crossZ = kx * py - ky * px;

  const rx = px * cos + crossX * sin + kx * dot * (1 - cos);
  const ry = py * cos + crossY * sin + ky * dot * (1 - cos);
  const rz = pz * cos + crossZ * sin + kz * dot * (1 - cos);

  return {
    x: origin.x + rx,
    y: origin.y + ry,
    z: origin.z + rz,
  };
}

export function rotateAtomPositionsAroundAxis(
  positions: Record<string, Position3D | undefined>,
  atomIds: string[],
  origin: Position3D,
  axis: Position3D,
  angleRad: number,
): void {
  for (const atomId of atomIds) {
    const position = positions[atomId];
    if (!position) continue;
    const rotated = rotatePointAroundAxis(position, origin, axis, angleRad);
    position.x = rotated.x;
    position.y = rotated.y;
    position.z = rotated.z;
  }
}
