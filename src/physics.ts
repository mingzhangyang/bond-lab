import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore, ELEMENTS } from './store';
import { useEffect } from 'react';

export const atomPositions: Record<string, THREE.Vector3> = {};
export const atomVelocities: Record<string, THREE.Vector3> = {};
export const lonePairs: Record<string, THREE.Vector3[]> = {};

const IDEAL_BOND_LENGTH = 2.0;
const LONE_PAIR_DIST = 1.0;
const K_BOND = 25.0;
const K_VSEPR = 10.0;
const K_REPULSION = 5.0;
const DAMPING = 0.8;

export function PhysicsEngine() {
  const atoms = useStore(state => state.atoms);
  const bonds = useStore(state => state.bonds);
  const draggedAtom = useStore(state => state.draggedAtom);

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
    const atomIds = new Set(atoms.map(a => a.id));
    for (const id in atomPositions) {
      if (!atomIds.has(id)) {
        delete atomPositions[id];
        delete atomVelocities[id];
        delete lonePairs[id];
      }
    }
  }, [atoms]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    
    const forces: Record<string, THREE.Vector3> = {};
    for (const atom of atoms) {
      forces[atom.id] = new THREE.Vector3(0, 0, 0);
    }

    // 1. Global repulsion
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const a1 = atoms[i];
        const a2 = atoms[j];
        const p1 = atomPositions[a1.id];
        const p2 = atomPositions[a2.id];
        if (!p1 || !p2) continue;

        const diff = new THREE.Vector3().subVectors(p1, p2);
        const distSq = diff.lengthSq();
        if (distSq < 0.01) diff.set(Math.random(), Math.random(), Math.random()).normalize();
        
        const dist = Math.sqrt(distSq) || 0.1;
        const forceMag = K_REPULSION / distSq;
        const force = diff.normalize().multiplyScalar(forceMag);
        
        forces[a1.id].add(force);
        forces[a2.id].sub(force);
      }
    }

    // 2. Bond springs
    const adjacency: Record<string, string[]> = {};
    for (const atom of atoms) adjacency[atom.id] = [];

    for (const bond of bonds) {
      const p1 = atomPositions[bond.source];
      const p2 = atomPositions[bond.target];
      if (!p1 || !p2) continue;

      adjacency[bond.source].push(bond.target);
      adjacency[bond.target].push(bond.source);

      const diff = new THREE.Vector3().subVectors(p2, p1);
      const dist = diff.length();
      
      const forceMag = K_BOND * (dist - IDEAL_BOND_LENGTH);
      const force = diff.normalize().multiplyScalar(forceMag);

      forces[bond.source].add(force);
      forces[bond.target].sub(force);
    }

    // 3. VSEPR (Local domain repulsion)
    for (const atom of atoms) {
      const pC = atomPositions[atom.id];
      if (!pC) continue;

      const elementData = ELEMENTS[atom.element];
      const totalBondOrder = bonds.filter(b => b.source === atom.id || b.target === atom.id).reduce((sum, b) => sum + b.order, 0);
      
      // Calculate lone pairs based on valence electrons and bonds
      // H: 1 valence, 1 bond max -> 0 lone pairs
      // C: 4 valence, 4 bonds max -> 0 lone pairs
      // N: 5 valence, 3 bonds max -> (5 - 3) / 2 = 1 lone pair
      // O: 6 valence, 2 bonds max -> (6 - 2) / 2 = 2 lone pairs
      let numLonePairs = 0;
      if (atom.element === 'N') numLonePairs = 1;
      if (atom.element === 'O') numLonePairs = 2;
      
      // If the atom forms fewer bonds than max, it might have unbonded electrons, but for simplicity in this engine, 
      // we usually consider standard lone pairs. Let's stick to the standard octet rule for lone pairs.
      // A more robust way:
      // numLonePairs = Math.floor((elementData.valence - totalBondOrder) / 2);
      // But wait, if N has 0 bonds, it has 5 valence electrons. (5-0)/2 = 2.5 -> 2 lone pairs? No, N typically forms 3 bonds and has 1 lone pair.
      // Actually, the number of lone pairs is typically fixed by the element's group in standard organic molecules:
      // N always has 1 lone pair (to make octet with 3 bonds).
      // O always has 2 lone pairs (to make octet with 2 bonds).
      // Let's use a fixed number based on the element for standard octet compliance.
      numLonePairs = Math.max(0, Math.floor((8 - elementData.maxBonds * 2) / 2));
      if (atom.element === 'H') numLonePairs = 0;
      if (atom.element === 'C') numLonePairs = 0;
      if (atom.element === 'N') numLonePairs = 1;
      if (atom.element === 'O') numLonePairs = 2;

      if (!lonePairs[atom.id]) lonePairs[atom.id] = [];
      const lps = lonePairs[atom.id];

      while (lps.length < numLonePairs) {
        lps.push(pC.clone().add(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(LONE_PAIR_DIST)));
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
            
            const v1 = new THREE.Vector3().subVectors(d1.pos, pC);
            const v2 = new THREE.Vector3().subVectors(d2.pos, pC);
            
            const len1 = v1.length() || 0.1;
            const len2 = v2.length() || 0.1;
            
            const dir1 = v1.clone().divideScalar(len1);
            const dir2 = v2.clone().divideScalar(len2);
            
            const dot = Math.max(-1, Math.min(1, dir1.dot(dir2)));
            const angle = Math.acos(dot);
            
            const angleDiff = idealAngle - angle;
            
            let axis = new THREE.Vector3().crossVectors(dir1, dir2);
            if (axis.lengthSq() < 0.001) {
              axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
              axis.cross(dir1).normalize();
            } else {
              axis.normalize();
            }
            
            const f1Dir = new THREE.Vector3().crossVectors(dir1, axis).normalize();
            const f2Dir = new THREE.Vector3().crossVectors(dir2, axis).normalize().negate();
            
            const forceMag = K_VSEPR * angleDiff;
            
            const f1 = f1Dir.multiplyScalar(forceMag);
            const f2 = f2Dir.multiplyScalar(forceMag);
            
            if (d1.type === 'atom') forces[d1.id!].add(f1);
            else d1.pos.add(f1.clone().multiplyScalar(dt));

            if (d2.type === 'atom') forces[d2.id!].add(f2);
            else d2.pos.add(f2.clone().multiplyScalar(dt));
            
            forces[atom.id].sub(f1).sub(f2);
          }
        }
      }

      // Pull lone pairs towards central atom
      for (const lp of lps) {
        const diff = new THREE.Vector3().subVectors(pC, lp);
        const dist = diff.length();
        const forceMag = K_BOND * (dist - LONE_PAIR_DIST);
        const force = diff.normalize().multiplyScalar(forceMag);
        lp.add(force.clone().multiplyScalar(dt));
        forces[atom.id].sub(force);
      }
    }

    // 4. Center gravity
    for (const atom of atoms) {
      const p = atomPositions[atom.id];
      if (p) {
        const dist = p.length();
        if (dist > 0.1) {
          forces[atom.id].add(p.clone().normalize().multiplyScalar(-0.5 * dist));
        }
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
      vel.add(f.multiplyScalar(dt));
      vel.multiplyScalar(DAMPING);
      pos.add(vel.clone().multiplyScalar(dt));
    }
  });

  return null;
}
