import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useStore } from '../store';
import { AtomNode } from './AtomNode';
import { BondNode } from './BondNode';
import { PhysicsEngine, TransformSync, setAtomPosition } from '../physics';
import { getElementFromDragData, hasElementDragData, projectPointerToScenePlane } from '../drag';
import { getSceneLighting } from '../sceneArt';
import { SceneBackdrop } from './SceneBackdrop';
import { SceneCanvas } from './SceneCanvas';

function SceneDropTarget() {
  const addAtom = useStore((state) => state.addAtom);
  const setSelectedAtom = useStore((state) => state.setSelectedAtom);
  const { camera, gl, raycaster } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleDragOver = (event: DragEvent) => {
      if (!hasElementDragData(event.dataTransfer)) return;
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDrop = (event: DragEvent) => {
      const element = getElementFromDragData(event.dataTransfer);
      if (!element) return;

      event.preventDefault();

      const position = projectPointerToScenePlane(
        { clientX: event.clientX, clientY: event.clientY },
        canvas.getBoundingClientRect(),
        camera,
        raycaster,
      );

      if (!position) return;

      const atomId = addAtom(element);
      setAtomPosition(atomId, position);
      setSelectedAtom(atomId);
    };

    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);

    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
    };
  }, [addAtom, camera, gl, raycaster, setSelectedAtom]);

  return null;
}

function SceneEnvironment({ intensity }: { intensity: number }) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    let envTarget: THREE.WebGLRenderTarget;
    try {
      envTarget = pmrem.fromScene(room, 0.04);
    } finally {
      // These are generation scratch resources; only the output target is
      // needed by the live scene.
      room.dispose();
      pmrem.dispose();
    }
    scene.environment = envTarget.texture;

    return () => {
      if (scene.environment === envTarget.texture) scene.environment = null;
      envTarget.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    scene.environmentIntensity = intensity;
  }, [scene, intensity]);

  return null;
}

function SceneContents() {
  const atoms = useStore(state => state.atoms);
  const bonds = useStore(state => state.bonds);
  const theme = useStore(state => state.theme);
  const draggedAtom = useStore(state => state.draggedAtom);
  const rotatingBond = useStore(state => state.rotatingBond);
  const lighting = getSceneLighting(theme);

  return (
    <>
      <SceneEnvironment intensity={lighting.environmentIntensity} />
      <ambientLight intensity={lighting.ambient} />
      <directionalLight position={[6, 8, 10]} intensity={lighting.key} color="#fff7ed" />
      <directionalLight position={[-8, -4, 6]} intensity={lighting.fill} color="#e0e7ff" />
      <directionalLight position={[-4, 6, -10]} intensity={lighting.rimIntensity} color={lighting.rimColor} />

      <PhysicsEngine />
      <TransformSync />
      <SceneDropTarget />

      <group>
        {atoms.map(atom => (
          <AtomNode key={atom.id} id={atom.id} element={atom.element} />
        ))}
        {bonds.map(bond => (
          <BondNode key={bond.id} bond={bond} />
        ))}
      </group>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={true}
        enabled={draggedAtom === null && rotatingBond === null}
      />
    </>
  );
}

const sceneContents = <SceneContents />;
const clearSelection = () => {
  useStore.getState().setSelectedAtom(null);
  useStore.getState().setSelectedBond(null);
};

export function Scene() {
  return (
    <div className="relative w-full h-full">
      <SceneBackdrop />
      <SceneCanvas onPointerMissed={clearSelection}>{sceneContents}</SceneCanvas>
    </div>
  );
}
