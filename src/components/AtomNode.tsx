import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, ELEMENTS, type ElementType } from '../store';
import { atomPositions, setAtomMeshRef, setAtomPosition, IDEAL_BOND_LENGTH } from '../physics';
import { toNormalizedDeviceCoordinates } from '../drag';
import { startPointerSession } from '../pointerSession';
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
  const setSelectedAtom = useStore((state) => state.setSelectedAtom);
  const addBond = useStore((state) => state.addBond);
  const removeAtom = useStore((state) => state.removeAtom);
  const interactionMode = useStore((state) => state.interactionMode);
  const [hovered, setHovered] = useState(false);
  const { camera, gl, raycaster } = useThree();
  const spawnProgressRef = useRef(prefersReducedMotion() ? 1 : 0);
  const cancelDragRef = useRef<(() => void) | null>(null);
  const suppressClickRef = useRef(false);
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

  useEffect(() => () => cancelDragRef.current?.(), []);

  const startDrag = (pointerId: number, startX: number, startY: number) => {
    cancelDragRef.current?.();
    // Replacing a session on the same atom must not suppress the new tap.
    suppressClickRef.current = false;
    setDraggedAtom(id);
    let didDrag = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (!didDrag) {
        // A press or a little finger jitter is a click, not a proximity drag.
        didDrag = Math.hypot(e.clientX - startX, e.clientY - startY) >= DRAG_START_THRESHOLD_PX;
        if (!didDrag) return;
      }
      if (!atomPositions[id]) return;

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

    const finishDrag = (completed: boolean) => {
      cancelDragRef.current = null;
      if (useStore.getState().draggedAtom === id) setDraggedAtom(null);
      // A cancelled pointer or a real drag must never become click-to-bond.
      // A fresh pointerdown resets this marker even if the browser skipped click.
      if (!completed || didDrag) suppressClickRef.current = true;
      if (!completed || !didDrag || useStore.getState().interactionMode !== 'build') return;

      const p1 = atomPositions[id];
      if (!p1) return;

      const state = useStore.getState();
      let foundNearbyAtom = false;
      for (const other of state.atoms) {
        if (other.id === id) continue;
        const p2 = atomPositions[other.id];
        if (!p2) continue;

        if (p1.distanceTo(p2) < IDEAL_BOND_LENGTH * 0.75) {
          state.addBond(id, other.id);
          foundNearbyAtom = true;
        }
      }
      if (foundNearbyAtom) useStore.getState().setSelectedAtom(null);
    };

    cancelDragRef.current = startPointerSession(window, {
      pointerId,
      onMove: handlePointerMove,
      onFinish: finishDrag,
      subscribeToCancel: (cancel) => useStore.subscribe((state) => {
        // Store notifications are synchronous: a second touch takes ownership
        // before the old finger gets a chance to move the first atom again.
        if (state.draggedAtom !== id
          || state.interactionMode !== 'build'
          || !state.atoms.some((atom) => atom.id === id)) {
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
        e.stopPropagation();
        suppressClickRef.current = false;
        if (interactionMode === 'build') {
          // Selecting a bond clears the atom selection in the store. Do not
          // clear it again on the second atom's pointerdown: it is the source
          // of the bond that the following click is meant to create.
          if (useStore.getState().selectedBond !== null) setSelectedBond(null);
          startDrag(e.pointerId, e.clientX, e.clientY);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }
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
