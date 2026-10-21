import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, ELEMENTS, type ElementType } from '../store';
import { atomPositions, setAtomMeshRef, setAtomPosition, IDEAL_BOND_LENGTH } from '../physics';
import { toNormalizedDeviceCoordinates } from '../drag';
import { startPointerSession } from '../pointerSession';
import { applyAtomTap } from '../atomTap';
import { easeOutBack, getAtomHalo, type AtomHalo } from '../sceneArt';

const SPAWN_DURATION_S = 0.35;
const DRAG_START_THRESHOLD_PX = 5;
const ignoreRaycast = () => null;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

interface AtomNodeProps {
  id: string;
  element: ElementType;
}

// Back-face fresnel glow: strongest at the atom's silhouette, fading to the halo's edge.
const HALO_VERTEX_SHADER = `
varying float vIntensity;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vec3 viewNormal = normalize(normalMatrix * normal);
  vIntensity = pow(max(-dot(viewNormal, normalize(-mvPosition.xyz)), 0.0), 1.2);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const HALO_FRAGMENT_SHADER = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vIntensity;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vIntensity);
  #include <colorspace_fragment>
}
`;

function AtomHaloMesh({ radius, halo }: { radius: number; halo: AtomHalo }) {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color() },
    uOpacity: { value: 0 },
  }), []);
  uniforms.uColor.value.set(halo.color);
  uniforms.uOpacity.value = halo.opacity;

  return (
    <mesh scale={halo.scale} raycast={ignoreRaycast}>
      <sphereGeometry args={[radius, 32, 24]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={HALO_VERTEX_SHADER}
        fragmentShader={HALO_FRAGMENT_SHADER}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function AtomNodeImpl({ id, element }: AtomNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerRef = useRef(new THREE.Vector2());
  const planeNormalRef = useRef(new THREE.Vector3());
  const planeRef = useRef(new THREE.Plane());
  const targetRef = useRef(new THREE.Vector3());
  const data = ELEMENTS[element];
  const setDraggedAtom = useStore((state) => state.setDraggedAtom);
  const setSelectedBond = useStore((state) => state.setSelectedBond);
  const isSelected = useStore((state) => state.selectedAtom === id);
  const removeAtom = useStore((state) => state.removeAtom);
  const interactionMode = useStore((state) => state.interactionMode);
  const [hovered, setHovered] = useState(false);
  const { camera, gl, raycaster } = useThree();
  const spawnProgressRef = useRef(prefersReducedMotion() ? 1 : 0);
  const cancelPointerRef = useRef<(() => void) | null>(null);
  const radius = data.vdwRadius * 0.4;
  const halo = getAtomHalo({ isSelected, hovered, interactionMode });

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || spawnProgressRef.current >= 1) return;
    spawnProgressRef.current = Math.min(1, spawnProgressRef.current + delta / SPAWN_DURATION_S);
    mesh.scale.setScalar(Math.max(0.001, easeOutBack(spawnProgressRef.current)));
  });

  useEffect(() => {
    if (!meshRef.current) return;
    setAtomMeshRef(id, meshRef.current);
    return () => setAtomMeshRef(id, null);
  }, [id]);

  useEffect(() => () => cancelPointerRef.current?.(), []);

  const startAtomPointerSession = (pointerId: number, startX: number, startY: number) => {
    cancelPointerRef.current?.();
    const startedMode = useStore.getState().interactionMode;
    if (startedMode === 'build') setDraggedAtom(id);
    let didDrag = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (!didDrag) {
        // A small involuntary finger movement is still a tap.
        didDrag = Math.hypot(e.clientX - startX, e.clientY - startY) >= DRAG_START_THRESHOLD_PX;
        if (!didDrag) return;
      }
      // In Delete mode, movement cancels the tap but never moves an atom.
      if (startedMode !== 'build' || !atomPositions[id]) return;

      const rect = gl.domElement.getBoundingClientRect();
      const ndc = toNormalizedDeviceCoordinates(
        { clientX: e.clientX, clientY: e.clientY },
        rect,
      );

      const pointer = pointerRef.current;
      pointer.set(ndc.x, ndc.y);
      raycaster.setFromCamera(pointer, camera);

      const planeNormal = planeNormalRef.current;
      camera.getWorldDirection(planeNormal);
      const plane = planeRef.current;
      plane.set(planeNormal, -planeNormal.dot(atomPositions[id]));

      const target = targetRef.current;
      if (raycaster.ray.intersectPlane(plane, target)) {
        setAtomPosition(id, target);
      }
    };

    const finishInteraction = (completed: boolean) => {
      cancelPointerRef.current = null;
      const state = useStore.getState();
      if (startedMode === 'build' && state.draggedAtom === id) setDraggedAtom(null);
      if (!completed || state.interactionMode !== startedMode) return;

      if (!didDrag) {
        // A completed tap commits on the matching pointerup, not a later
        // synthetic click (which iOS Safari can omit on a WebGL canvas).
        applyAtomTap(id, useStore.getState());
        return;
      }
      if (startedMode !== 'build') return;

      const p1 = atomPositions[id];
      if (!p1) return;

      const updatedState = useStore.getState();
      let foundNearbyAtom = false;
      for (const other of updatedState.atoms) {
        if (other.id === id) continue;
        const p2 = atomPositions[other.id];
        if (!p2) continue;

        if (p1.distanceTo(p2) < IDEAL_BOND_LENGTH * 0.75) {
          updatedState.addBond(id, other.id);
          foundNearbyAtom = true;
        }
      }
      if (foundNearbyAtom) useStore.getState().setSelectedAtom(null);
    };

    // Registered synchronously on pointerdown, filtered by pointerId.
    // Both mouse clicks and touch taps complete exactly once on pointerup.
    cancelPointerRef.current = startPointerSession(window, {
      pointerId,
      onMove: handlePointerMove,
      onFinish: finishInteraction,
      subscribeToCancel: (cancel) => useStore.subscribe((state) => {
        if (state.interactionMode !== startedMode
          || !state.atoms.some((atom) => atom.id === id)
          || (startedMode === 'build' && state.draggedAtom !== id)) {
          cancel();
        }
      }),
    });
  };

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        if (interactionMode === 'build' && useStore.getState().selectedBond !== null) {
          setSelectedBond(null);
        }
        startAtomPointerSession(e.pointerId, e.clientX, e.clientY);
      }}
      // Tap actions are already committed by pointerup. Retain an inert click
      // handler to stop 3D event propagation without double-applying the tap.
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.nativeEvent.preventDefault();
        e.stopPropagation();
        if (interactionMode !== 'delete') return;
        removeAtom(id);
      }}
    >
      <sphereGeometry args={[radius, 48, 32]} />
      <meshPhysicalMaterial
        color={data.color}
        roughness={0.32}
        metalness={0}
        clearcoat={0.6}
        clearcoatRoughness={0.18}
        emissive={isSelected ? '#312e81' : (hovered ? (interactionMode === 'delete' ? '#450a0a' : '#1e293b') : '#000')}
      />
      {halo && <AtomHaloMesh radius={radius} halo={halo} />}
    </mesh>
  );
}

export const AtomNode = React.memo(AtomNodeImpl);
