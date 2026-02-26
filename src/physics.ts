import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ELEMENTS, useStore } from './store';
import { computeBondPlacement } from './bondPlacement';

export const atomPositions: Record<string, THREE.Vector3> = {};
export const atomVelocities: Record<string, THREE.Vector3> = {};
export const lonePairs: Record<string, THREE.Vector3[]> = {};
const atomMeshRefs: Record<string, THREE.Mesh> = {};
const bondGroupRefs: Record<string, THREE.Group> = {};

const IDEAL_BOND_LENGTH = 2.0;
const LONE_PAIR_DIST = 1.0;
const K_BOND = 25.0;
const K_VSEPR = 10.0;
const K_REPULSION = 5.0;
const DAMPING = 0.8;
const MIN_DIST_SQ = 0.01;
const MIN_DIST = 0.001;
const BOND_OVERLAP = 0.08;
const BOND_UP_AXIS = new THREE.Vector3(0, 1, 0);

export function setAtomMeshRef(id: string, mesh: THREE.Mesh | null): void {
  if (mesh) {
    atomMeshRefs[id] = mesh;
    return;
  }
  delete atomMeshRefs[id];
}

export function setBondGroupRef(id: string, group: THREE.Group | null): void {
  if (group) {
    bondGroupRefs[id] = group;
    return;
  }
  delete bondGroupRefs[id];
}

export function TransformSync() {
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const diffRef = useRef(new THREE.Vector3());
  const midRef = useRef(new THREE.Vector3());
  const atomRadiiRef = useRef(new Map<string, number>());

  useFrame(() => {
    const diff = diffRef.current;
    const mid = midRef.current;
    const atomRadii = atomRadiiRef.current;
    atomRadii.clear();

    for (const atom of atoms) {
      const mesh = atomMeshRefs[atom.id];
      const position = atomPositions[atom.id];
      if (!mesh || !position) continue;
      mesh.position.copy(position);
      atomRadii.set(atom.id, ELEMENTS[atom.element].vdwRadius * 0.4);
    }

    for (const bond of bonds) {
      const group = bondGroupRefs[bond.id];
      const p1 = atomPositions[bond.source];
      const p2 = atomPositions[bond.target];
      if (!group || !p1 || !p2) continue;

      diff.subVectors(p2, p1);
      const dist = diff.length();
      const sourceRadius = atomRadii.get(bond.source) ?? 0;
      const targetRadius = atomRadii.get(bond.target) ?? 0;
      const placement = computeBondPlacement(
        dist,
        sourceRadius,
        targetRadius,
        BOND_OVERLAP,
        MIN_DIST,
      );

      if (dist > MIN_DIST) {
        diff.multiplyScalar(1 / dist);
        mid.copy(p1).addScaledVector(diff, placement.centerOffset);
        group.position.copy(mid);
        group.quaternion.setFromUnitVectors(BOND_UP_AXIS, diff);
      } else {
        mid.addVectors(p1, p2).multiplyScalar(0.5);
        group.position.copy(mid);
      }

      for (const child of group.children) {
        child.scale.set(1, placement.length, 1);
      }
    }
  });

  return null;
}

export function PhysicsEngine() {
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const draggedAtom = useStore((state) => state.draggedAtom);
  const rotatingBond = useStore((state) => state.rotatingBond);
  const forcesRef = useRef<Record<string, THREE.Vector3>>({});
  const adjacencyRef = useRef<Record<string, string[]>>({});
  const scratchRef = useRef({
    diff: new THREE.Vector3(),
    v1: new THREE.Vector3(),
    v2: new THREE.Vector3(),
    dir1: new THREE.Vector3(),
    dir2: new THREE.Vector3(),
    axis: new THREE.Vector3(),
    tangent1: new THREE.Vector3(),
    tangent2: new THREE.Vector3(),
    force1: new THREE.Vector3(),
    force2: new THREE.Vector3(),
    random: new THREE.Vector3(),
    lpDiff: new THREE.Vector3(),
  });

  // Initialize new atoms
  useEffect(() => {
    for (const atom of atoms) {
      if (!atomPositions[atom.id]) {
        atomPositions[atom.id] = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        atomVelocities[atom.id] = new THREE.Vector3(0, 0, 0);
      }
    }

    // Cleanup removed atoms
    const atomIds = new Set(atoms.map((a) => a.id));
    for (const id in atomPositions) {
      if (!atomIds.has(id)) {
        delete atomPositions[id];
        delete atomVelocities[id];
        delete lonePairs[id];
        delete atomMeshRefs[id];
      }
    }
  }, [atoms]);

  useFrame((_, delta) => {
    if (rotatingBond !== null) {
      return;
    }

    const dt = Math.min(delta, 0.05);
    const forces = forcesRef.current;
    const adjacency = adjacencyRef.current;
    const atomIds = new Set<string>();
    const {
      diff,
      v1,
      v2,
      dir1,
      dir2,
      axis,
      tangent1,
      tangent2,
      force1,
      force2,
      random,
      lpDiff,
    } = scratchRef.current;

    for (const atom of atoms) {
      atomIds.add(atom.id);

      if (!forces[atom.id]) {
        forces[atom.id] = new THREE.Vector3();
      } else {
        forces[atom.id].set(0, 0, 0);
      }

      if (!adjacency[atom.id]) {
        adjacency[atom.id] = [];
      } else {
        adjacency[atom.id].length = 0;
      }
    }

    for (const id in forces) {
      if (!atomIds.has(id)) delete forces[id];
    }
    for (const id in adjacency) {
      if (!atomIds.has(id)) delete adjacency[id];
    }

    // 1. Global repulsion
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const a1 = atoms[i];
        const a2 = atoms[j];
        const p1 = atomPositions[a1.id];
        const p2 = atomPositions[a2.id];
        if (!p1 || !p2) continue;

        diff.subVectors(p1, p2);
        let distSq = diff.lengthSq();
        if (distSq < MIN_DIST_SQ) {
          random.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
          diff.copy(random);
          distSq = MIN_DIST_SQ;
        }

        const forceScale = K_REPULSION / (distSq * Math.sqrt(distSq));
        forces[a1.id].addScaledVector(diff, forceScale);
        forces[a2.id].addScaledVector(diff, -forceScale);
      }
    }

    // 2. Bond springs
    for (const bond of bonds) {
      const p1 = atomPositions[bond.source];
      const p2 = atomPositions[bond.target];
      if (!p1 || !p2) continue;

      adjacency[bond.source].push(bond.target);
      adjacency[bond.target].push(bond.source);

      diff.subVectors(p2, p1);
      const dist = diff.length();
      if (dist < MIN_DIST) continue;

      const forceScale = (K_BOND * (dist - IDEAL_BOND_LENGTH)) / dist;
      forces[bond.source].addScaledVector(diff, forceScale);
      forces[bond.target].addScaledVector(diff, -forceScale);
    }

    // 3. VSEPR (Local domain repulsion)
    for (const atom of atoms) {
      const pC = atomPositions[atom.id];
      if (!pC) continue;

      let numLonePairs = 0;
      if (atom.element === 'N') numLonePairs = 1;
      if (atom.element === 'O') numLonePairs = 2;

      if (!lonePairs[atom.id]) lonePairs[atom.id] = [];
      const lps = lonePairs[atom.id];

      while (lps.length < numLonePairs) {
        random.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        lps.push(pC.clone().add(random.multiplyScalar(LONE_PAIR_DIST)));
      }
      while (lps.length > numLonePairs) {
        lps.pop();
      }

      const neighbors = adjacency[atom.id];
      const domains: { type: 'atom' | 'lp', id?: string, pos: THREE.Vector3 }[] = [];

      for (const n of neighbors) {
        if (atomPositions[n]) domains.push({ type: 'atom', id: n, pos: atomPositions[n] });
      }
      for (const lp of lps) {
        domains.push({ type: 'lp', pos: lp });
      }

      // Repel domains from each other to enforce ideal angles
      const numDomains = domains.length;
      if (numDomains > 1) {
        let idealAngle = Math.PI; // 180
        if (numDomains === 3) idealAngle = 2 * Math.PI / 3; // 120
        else if (numDomains >= 4) idealAngle = Math.acos(-1 / 3); // 109.47

        for (let i = 0; i < numDomains; i++) {
          for (let j = i + 1; j < numDomains; j++) {
            const d1 = domains[i];
            const d2 = domains[j];

            v1.subVectors(d1.pos, pC);
            v2.subVectors(d2.pos, pC);

            const len1 = v1.length() || 0.1;
            const len2 = v2.length() || 0.1;

            dir1.copy(v1).divideScalar(len1);
            dir2.copy(v2).divideScalar(len2);

            const dot = Math.max(-1, Math.min(1, dir1.dot(dir2)));
            const angle = Math.acos(dot);

            let currentIdealAngle = idealAngle;
            let repulsionFactor = 1.0;

            if (numDomains >= 4) {
              if (d1.type === 'lp' && d2.type === 'lp') {
                currentIdealAngle = 114 * Math.PI / 180;
                repulsionFactor = 1.5;
              } else if (d1.type === 'lp' || d2.type === 'lp') {
                if (numLonePairs === 1) currentIdealAngle = 111.8 * Math.PI / 180;
                else currentIdealAngle = 109.5 * Math.PI / 180;
                repulsionFactor = 1.2;
              } else {
                if (numLonePairs === 1) currentIdealAngle = 107 * Math.PI / 180;
                else if (numLonePairs === 2) currentIdealAngle = 104.5 * Math.PI / 180;
                else currentIdealAngle = 109.47 * Math.PI / 180;
                repulsionFactor = 0.8;
              }
            } else if (numDomains === 3) {
              if (d1.type === 'lp' || d2.type === 'lp') {
                currentIdealAngle = 122 * Math.PI / 180;
                repulsionFactor = 1.2;
              } else {
                if (numLonePairs === 1) currentIdealAngle = 116 * Math.PI / 180;
                else currentIdealAngle = 120 * Math.PI / 180;
                repulsionFactor = 0.8;
              }
            }

            const angleDiff = currentIdealAngle - angle;

            axis.crossVectors(dir1, dir2);
            if (axis.lengthSq() < 0.001) {
              random.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
              random.cross(dir1);
              if (random.lengthSq() < MIN_DIST_SQ) {
                random.set(1, 0, 0).cross(dir1);
              }
              axis.copy(random).normalize();
            } else {
              axis.normalize();
            }

            tangent1.crossVectors(dir1, axis).normalize();
            tangent2.crossVectors(dir2, axis).normalize().negate();

            const forceMag = K_VSEPR * angleDiff * repulsionFactor;

            force1.copy(tangent1).multiplyScalar(forceMag);
            force2.copy(tangent2).multiplyScalar(forceMag);

            if (d1.type === 'atom') forces[d1.id!].add(force1);
            else d1.pos.addScaledVector(force1, dt);

            if (d2.type === 'atom') forces[d2.id!].add(force2);
            else d2.pos.addScaledVector(force2, dt);

            forces[atom.id].sub(force1).sub(force2);
          }
        }
      }

      // Pull lone pairs towards central atom
      for (const lp of lps) {
        lpDiff.subVectors(pC, lp);
        const dist = lpDiff.length();
        if (dist < MIN_DIST) continue;
        const forceMag = K_BOND * (dist - LONE_PAIR_DIST);
        const forceScale = forceMag / dist;
        lp.addScaledVector(lpDiff, forceScale * dt);
        forces[atom.id].addScaledVector(lpDiff, -forceScale);
      }
    }

    // 4. Center gravity
    for (const atom of atoms) {
      const p = atomPositions[atom.id];
      if (p && p.lengthSq() > 0.01) {
        forces[atom.id].addScaledVector(p, -0.5);
      }
    }

    // Apply forces
    for (const atom of atoms) {
      if (atom.id === draggedAtom) {
        atomVelocities[atom.id].set(0, 0, 0);
        continue;
      }

      const vel = atomVelocities[atom.id];
      const pos = atomPositions[atom.id];
      if (!vel || !pos) continue;

      const f = forces[atom.id];
      vel.addScaledVector(f, dt);
      vel.multiplyScalar(DAMPING);
      pos.addScaledVector(vel, dt);
    }
  });

  return null;
}
