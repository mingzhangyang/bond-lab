import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { type Bond, useStore } from '../store';
import { atomPositions, setBondGroupRef } from '../physics';
import {
  getRotationGroupAtomIds,
  isBondRotatable,
  rotateAtomPositionsAroundAxis,
} from '../rotation';

interface BondNodeProps {
  bond: Bond;
}

interface RotationState {
  active: boolean;
  lastClientX: number;
  rotatingAtomIds: string[];
  anchorAtomId: string;
  pivotAtomId: string;
  didRotate: boolean;
  accumulatedAbsDelta: number;
}

const ROTATION_START_THRESHOLD_PX = 2;
const ROTATION_SENSITIVITY = 0.008;
const ROTATION_MAX_DELTA_PX = 20;

function BondNodeImpl({ bond }: BondNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  const suppressClickRef = useRef(false);
  const rotationRef = useRef<RotationState | null>(null);
  const removeBond = useStore((state) => state.removeBond);
  const addBond = useStore((state) => state.addBond);
  const interactionMode = useStore((state) => state.interactionMode);
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const rotatingBondId = useStore((state) => state.rotatingBond);
  const setRotatingBond = useStore((state) => state.setRotatingBond);
  const { gl } = useThree();
  const isRotating = rotatingBondId === bond.id;
  const bondRotatable = useMemo(() => isBondRotatable(bond), [bond]);

  useEffect(() => {
    if (!groupRef.current) return;
    setBondGroupRef(bond.id, groupRef.current);
    return () => setBondGroupRef(bond.id, null);
  }, [bond.id]);

  useEffect(() => {
    return () => {
      if (useStore.getState().rotatingBond === bond.id) {
        useStore.getState().setRotatingBond(null);
      }
    };
  }, [bond.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') setShiftPressed(true);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') setShiftPressed(false);
    };
    const resetShift = () => setShiftPressed(false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetShift);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', resetShift);
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    if (isRotating) {
      canvas.style.cursor = 'grabbing';
      return () => {
        if (canvas.style.cursor === 'grabbing') canvas.style.cursor = 'auto';
      };
    }
    if (!hovered) {
      canvas.style.cursor = 'auto';
      return;
    }
    if (interactionMode === 'delete') {
      canvas.style.cursor = 'pointer';
      return;
    }
    if (interactionMode === 'build' && shiftPressed) {
      canvas.style.cursor = bondRotatable ? 'grab' : 'not-allowed';
      return;
    }
    canvas.style.cursor = 'pointer';
  }, [gl, hovered, interactionMode, shiftPressed, bondRotatable, isRotating]);

  const offsets = [];
  if (bond.order === 1) offsets.push(0);
  if (bond.order === 2) offsets.push(-0.15, 0.15);
  if (bond.order === 3) offsets.push(-0.2, 0, 0.2);

  const startRotation = (clientX: number) => {
    const anchorAtomId = bond.source;
    const pivotAtomId = bond.target;
    const anchorPos = atomPositions[anchorAtomId];
    const pivotPos = atomPositions[pivotAtomId];
    if (!anchorPos || !pivotPos) return;

    const rotatingAtomIds = getRotationGroupAtomIds(atoms, bonds, anchorAtomId, pivotAtomId);
    if (rotatingAtomIds.length === 0) return;

    rotationRef.current = {
      active: true,
      lastClientX: clientX,
      rotatingAtomIds,
      anchorAtomId,
      pivotAtomId,
      didRotate: false,
      accumulatedAbsDelta: 0,
    };
    setRotatingBond(bond.id);

    const handlePointerMove = (event: PointerEvent) => {
      const rotationState = rotationRef.current;
      if (!rotationState || !rotationState.active) return;

      const deltaX = event.clientX - rotationState.lastClientX;
      rotationState.lastClientX = event.clientX;
      rotationState.accumulatedAbsDelta += Math.abs(deltaX);
      if (rotationState.accumulatedAbsDelta < ROTATION_START_THRESHOLD_PX) return;
      if (Math.abs(deltaX) < 0.2) return;

      const anchor = atomPositions[rotationState.anchorAtomId];
      const pivot = atomPositions[rotationState.pivotAtomId];
      if (!anchor || !pivot) return;

      const axis = {
        x: pivot.x - anchor.x,
        y: pivot.y - anchor.y,
        z: pivot.z - anchor.z,
      };
      rotateAtomPositionsAroundAxis(
        atomPositions,
        rotationState.rotatingAtomIds,
        anchor,
        axis,
        Math.max(-ROTATION_MAX_DELTA_PX, Math.min(ROTATION_MAX_DELTA_PX, deltaX)) * ROTATION_SENSITIVITY,
      );
      rotationState.didRotate = true;
    };

    const stopRotation = () => {
      const rotationState = rotationRef.current;
      if (rotationState?.didRotate) {
        suppressClickRef.current = true;
      }
      rotationRef.current = null;
      setRotatingBond(null);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopRotation);
      window.removeEventListener('pointercancel', stopRotation);
      window.removeEventListener('blur', stopRotation);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopRotation);
    window.addEventListener('pointercancel', stopRotation);
    window.addEventListener('blur', stopRotation);
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        if (interactionMode !== 'build') return;
        if (!e.shiftKey) return;
        e.stopPropagation();

        if (!bondRotatable) return;
        startRotation(e.clientX);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }
        if (interactionMode === 'delete') {
          removeBond(bond.id);
          return;
        }
        if (interactionMode === 'build' && e.shiftKey) {
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
            color={
              isRotating
                ? '#38bdf8'
                : (
                    hovered
                      ? (
                          interactionMode === 'delete'
                            ? '#ef4444'
                            : (
                                interactionMode === 'build' && shiftPressed
                                  ? (bondRotatable ? '#f59e0b' : '#f87171')
                                  : '#aaaaaa'
                              )
                        )
                      : '#888888'
                  )
            }
            roughness={0.4}
            metalness={0.2}
            emissive={
              isRotating
                ? '#0c4a6e'
                : (
                    hovered
                      ? (
                          interactionMode === 'delete'
                            ? '#330000'
                            : (
                                interactionMode === 'build' && shiftPressed
                                  ? (bondRotatable ? '#5b3410' : '#450a0a')
                                  : '#222'
                              )
                        )
                      : '#000'
                  )
            }
          />
        </mesh>
      ))}
    </group>
  );
}

export const BondNode = React.memo(BondNodeImpl);
