import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Bond, useStore } from '../store';
import { atomPositions } from '../physics';

export function BondNode({ bond }: { bond: Bond }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const removeBond = useStore(state => state.removeBond);
  const addBond = useStore(state => state.addBond);
  const interactionMode = useStore(state => state.interactionMode);
  
  useFrame(() => {
    if (!meshRef.current) return;
    const p1 = atomPositions[bond.source];
    const p2 = atomPositions[bond.target];
    if (!p1 || !p2) return;

    const diff = new THREE.Vector3().subVectors(p2, p1);
    const dist = diff.length();
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

    meshRef.current.position.copy(mid);
    meshRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), diff.clone().normalize());
    
    meshRef.current.children.forEach(child => {
      child.scale.set(1, dist, 1);
    });
  });

  const offsets = [];
  if (bond.order === 1) offsets.push(0);
  if (bond.order === 2) offsets.push(-0.15, 0.15);
  if (bond.order === 3) offsets.push(-0.2, 0, 0.2);

  return (
    <group 
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        if (interactionMode === 'delete') {
          removeBond(bond.id);
          return;
        }
        addBond(bond.source, bond.target); // this upgrades the bond
      }}
      onContextMenu={(e) => {
        e.nativeEvent.preventDefault();
        e.stopPropagation();
        removeBond(bond.id);
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {offsets.map((offset, i) => (
        <mesh key={i} position={[offset, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
          <meshStandardMaterial
            color={hovered ? (interactionMode === 'delete' ? '#ef4444' : '#aaaaaa') : '#888888'}
            roughness={0.4}
            metalness={0.2}
            emissive={hovered ? (interactionMode === 'delete' ? '#330000' : '#222') : '#000'}
          />
        </mesh>
      ))}
    </group>
  );
}
