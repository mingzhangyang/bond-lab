import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, ELEMENTS, ElementType } from '../store';
import { atomPositions } from '../physics';
import { Html } from '@react-three/drei';

export function AtomNode({ id, element }: { id: string, element: ElementType }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const data = ELEMENTS[element];
  const setDraggedAtom = useStore(state => state.setDraggedAtom);
  const draggedAtom = useStore(state => state.draggedAtom);
  const selectedAtom = useStore(state => state.selectedAtom);
  const setSelectedAtom = useStore(state => state.setSelectedAtom);
  const addBond = useStore(state => state.addBond);
  const [hovered, setHovered] = useState(false);
  const { camera, size, raycaster } = useThree();

  useFrame(() => {
    if (meshRef.current && atomPositions[id]) {
      meshRef.current.position.copy(atomPositions[id]);
    }
  });

  useEffect(() => {
    if (draggedAtom !== id) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!atomPositions[id]) return;
      
      const x = (e.clientX / size.width) * 2 - 1;
      const y = -(e.clientY / size.height) * 2 + 1;
      
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const planeNormal = camera.getWorldDirection(new THREE.Vector3());
      const plane = new THREE.Plane(planeNormal, -planeNormal.dot(atomPositions[id]));
      
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);
      
      if (target) {
        atomPositions[id].copy(target);
      }
    };

    const handlePointerUp = () => {
      setDraggedAtom(null);
      
      const p1 = atomPositions[id];
      if (!p1) return;
      
      const atoms = useStore.getState().atoms;
      const addBond = useStore.getState().addBond;
      
      for (const other of atoms) {
        if (other.id === id) continue;
        const p2 = atomPositions[other.id];
        if (!p2) continue;
        
        const dist = p1.distanceTo(p2);
        if (dist < 1.5) {
          addBond(id, other.id);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggedAtom, id, camera, size, raycaster, setDraggedAtom]);

  const isSelected = selectedAtom === id;

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onPointerDown={(e) => {
        e.stopPropagation();
        setDraggedAtom(id);
      }}
      onClick={(e) => {
        e.stopPropagation();
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
        e.stopPropagation();
        useStore.getState().removeAtom(id);
      }}
    >
      <sphereGeometry args={[data.vdwRadius * 0.4, 32, 32]} />
      <meshStandardMaterial 
        color={data.color} 
        roughness={0.3} 
        metalness={0.1} 
        emissive={isSelected ? '#666' : (hovered ? '#333' : '#000')} 
      />
      <Html center position={[0, 0, data.vdwRadius * 0.4 + 0.2]} style={{ pointerEvents: 'none' }}>
        <div className="text-white font-bold text-sm drop-shadow-md select-none" style={{ textShadow: '0px 0px 2px black, 0px 0px 4px black' }}>
          {data.symbol}
        </div>
      </Html>
    </mesh>
  );
}
