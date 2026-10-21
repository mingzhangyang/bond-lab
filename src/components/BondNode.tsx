import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { type Bond, ELEMENTS, useStore } from '../store';
import { atomPositions, notifyAtomPositionsChanged, setBondGroupRef } from '../physics';
import { useShiftPressed } from '../keyboard';
import {
  canRotateBond,
  getRotationGroupAtomIds,
  rotateAtomPositionsAroundAxis,
} from '../rotation';
import { getBondHighlight } from '../sceneArt';
import { startPointerSession } from '../pointerSession';

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
const BOND_RADIUS_BY_ORDER: Record<number, number> = { 1: 0.1, 2: 0.075, 3: 0.065 };
const NEUTRAL_BOND_COLOR = '#9ca3af';

function BondNodeImpl({ bond }: BondNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const shiftPressed = useShiftPressed();
  const suppressClickRef = useRef(false);
  const rotationRef = useRef<RotationState | null>(null);
  const cancelRotationRef = useRef<(() => void) | null>(null);
  const removeBond = useStore((state) => state.removeBond);
  const interactionMode = useStore((state) => state.interactionMode);
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const selectedBondId = useStore((state) => state.selectedBond);
  const setSelectedBond = useStore((state) => state.setSelectedBond);
  const setSelectedAtom = useStore((state) => state.setSelectedAtom);
  const rotatingBondId = useStore((state) => state.rotatingBond);
  const setRotatingBond = useStore((state) => state.setRotatingBond);
  const { gl } = useThree();
  const isRotating = rotatingBondId === bond.id;
  const isSelected = selectedBondId === bond.id;
  const bondRotatable = useMemo(() => canRotateBond(bond, bonds), [bond, bonds]);
  const highlight = getBondHighlight({ isRotating, isSelected, hovered, interactionMode, shiftPressed, bondRotatable });
  const sourceElement = atoms.find((atom) => atom.id === bond.source)?.element;
  const targetElement = atoms.find((atom) => atom.id === bond.target)?.element;
  // Each half takes its atom's color (CPK ball-and-stick); highlights tint the whole bond.
  const halves = [
    { y: -0.25, color: highlight?.color ?? (sourceElement ? ELEMENTS[sourceElement].color : NEUTRAL_BOND_COLOR) },
    { y: 0.25, color: highlight?.color ?? (targetElement ? ELEMENTS[targetElement].color : NEUTRAL_BOND_COLOR) },
  ];
  const bondRadius = BOND_RADIUS_BY_ORDER[bond.order] ?? BOND_RADIUS_BY_ORDER[1];

  useEffect(() => {
    if (!groupRef.current) return;
    setBondGroupRef(bond.id, groupRef.current);
    return () => setBondGroupRef(bond.id, null);
  }, [bond.id]);

  useEffect(() => {
    return () => {
      cancelRotationRef.current?.();
      if (useStore.getState().rotatingBond === bond.id) {
        useStore.getState().setRotatingBond(null);
      }
    };
  }, [bond.id]);

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

  const startRotation = (clientX: number, pointerId: number) => {
    cancelRotationRef.current?.();
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
      notifyAtomPositionsChanged();
      rotationState.didRotate = true;
    };

    const stopRotation = () => {
      const rotationState = rotationRef.current;
      if (rotationState?.didRotate) {
        suppressClickRef.current = true;
      }
      rotationRef.current = null;
      if (useStore.getState().rotatingBond === bond.id) setRotatingBond(null);
    };

    cancelRotationRef.current = startPointerSession(window, {
      pointerId,
      onMove: handlePointerMove,
      onFinish: stopRotation,
    });
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        if (interactionMode !== 'build') return;
        if (!e.shiftKey) return;
        e.stopPropagation();

        if (!bondRotatable) return;
        startRotation(e.clientX, e.pointerId);
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
        setSelectedAtom(null);
        setSelectedBond(isSelected ? null : bond.id);
      }}
      onContextMenu={(e) => {
        e.nativeEvent.preventDefault();
        e.stopPropagation();
        if (interactionMode !== 'delete') return;
        removeBond(bond.id);
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {offsets.map((offset, i) => (
        <group key={i} position={[offset, 0, 0]}>
          {halves.map((half) => (
            <mesh key={half.y} position={[0, half.y, 0]}>
              <cylinderGeometry args={[bondRadius, bondRadius, 0.5, 20, 1, true]} />
              <meshStandardMaterial
                color={half.color}
                roughness={0.38}
                metalness={0.05}
                emissive={highlight?.emissive ?? '#000'}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export const BondNode = React.memo(BondNodeImpl);
