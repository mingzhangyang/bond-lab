import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { type Bond, useStore } from '../store';
import { setBondGroupRef } from '../physics';

interface BondNodeProps {
  bond: Bond;
}

function BondNodeImpl({ bond }: BondNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const removeBond = useStore((state) => state.removeBond);
  const addBond = useStore((state) => state.addBond);
  const interactionMode = useStore((state) => state.interactionMode);

  useEffect(() => {
    if (!groupRef.current) return;
    setBondGroupRef(bond.id, groupRef.current);
    return () => setBondGroupRef(bond.id, null);
  }, [bond.id]);

  const offsets = [];
  if (bond.order === 1) offsets.push(0);
  if (bond.order === 2) offsets.push(-0.15, 0.15);
  if (bond.order === 3) offsets.push(-0.2, 0, 0.2);

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        if (interactionMode === 'delete') {
          removeBond(bond.id);
          return;
        }
        addBond(bond.source, bond.target);
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

export const BondNode = React.memo(BondNodeImpl);
