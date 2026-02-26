import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useStore, ELEMENTS, type ElementType } from '../store';
import { atomPositions, setAtomMeshRef } from '../physics';

interface AtomNodeProps {
  id: string;
  element: ElementType;
}

function AtomNodeImpl({ id, element }: AtomNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerRef = useRef(new THREE.Vector2());
  const planeNormalRef = useRef(new THREE.Vector3());
  const planeRef = useRef(new THREE.Plane());
  const targetRef = useRef(new THREE.Vector3());
  const data = ELEMENTS[element];
  const setDraggedAtom = useStore((state) => state.setDraggedAtom);
  const isDragged = useStore((state) => state.draggedAtom === id);
  const isSelected = useStore((state) => state.selectedAtom === id);
  const setSelectedAtom = useStore((state) => state.setSelectedAtom);
  const addBond = useStore((state) => state.addBond);
  const removeAtom = useStore((state) => state.removeAtom);
  const interactionMode = useStore((state) => state.interactionMode);
  const [hovered, setHovered] = useState(false);
  const { camera, size, raycaster } = useThree();

  useEffect(() => {
    if (!meshRef.current) return;
    setAtomMeshRef(id, meshRef.current);
    return () => setAtomMeshRef(id, null);
  }, [id]);

  useEffect(() => {
    if (!isDragged) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!atomPositions[id]) return;

      const pointer = pointerRef.current;
      pointer.set(
        (e.clientX / size.width) * 2 - 1,
        -(e.clientY / size.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);

      const planeNormal = planeNormalRef.current;
      camera.getWorldDirection(planeNormal);
      const plane = planeRef.current;
      plane.set(planeNormal, -planeNormal.dot(atomPositions[id]));

      const target = targetRef.current;
      if (raycaster.ray.intersectPlane(plane, target)) {
        atomPositions[id].copy(target);
      }
    };

    const handlePointerUp = () => {
      setDraggedAtom(null);
      if (useStore.getState().interactionMode !== 'build') return;

      const p1 = atomPositions[id];
      if (!p1) return;

      const atoms = useStore.getState().atoms;
      const addBondAction = useStore.getState().addBond;

      for (const other of atoms) {
        if (other.id === id) continue;
        const p2 = atomPositions[other.id];
        if (!p2) continue;

        if (p1.distanceTo(p2) < 1.5) {
          addBondAction(id, other.id);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragged, id, camera, size, raycaster, setDraggedAtom]);

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (interactionMode === 'build') {
          setDraggedAtom(id);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (interactionMode === 'delete') {
          removeAtom(id);
          setSelectedAtom(null);
          return;
        }

        const selectedAtom = useStore.getState().selectedAtom;
        if (selectedAtom === null) {
          setSelectedAtom(id);
        } else if (selectedAtom === id) {
          setSelectedAtom(null);
        } else {
          addBond(selectedAtom, id);
          setSelectedAtom(null);
        }
      }}
      onContextMenu={(e) => {
        e.nativeEvent.preventDefault();
        e.stopPropagation();
        removeAtom(id);
      }}
    >
      <sphereGeometry args={[data.vdwRadius * 0.4, 32, 32]} />
      <meshStandardMaterial
        color={data.color}
        roughness={0.3}
        metalness={0.1}
        emissive={isSelected ? '#666' : (hovered ? (interactionMode === 'delete' ? '#660000' : '#333') : '#000')}
      />
      <Text
        position={[0, 0, data.vdwRadius * 0.4 + 0.2]}
        fontSize={0.32}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#000000"
        outlineWidth={0.04}
      >
        {data.symbol}
      </Text>
    </mesh>
  );
}

export const AtomNode = React.memo(AtomNodeImpl);
