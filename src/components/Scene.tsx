import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import { useStore } from '../store';
import { AtomNode } from './AtomNode';
import { BondNode } from './BondNode';
import { PhysicsEngine, TransformSync, setAtomPosition } from '../physics';
import { getElementFromDragData, hasElementDragData, projectPointerToScenePlane } from '../drag';

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

export function Scene() {
  const atoms = useStore(state => state.atoms);
  const bonds = useStore(state => state.bonds);
  const theme = useStore(state => state.theme);
  const draggedAtom = useStore(state => state.draggedAtom);
  const rotatingBond = useStore(state => state.rotatingBond);
  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-full ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        onPointerMissed={() => useStore.getState().setSelectedAtom(null)}
      >
        <color attach="background" args={[isDark ? '#18181b' : '#e2e8f0']} />
        <ambientLight intensity={isDark ? 0.6 : 0.85} />
        <hemisphereLight
          args={[isDark ? '#6b7280' : '#e2e8f0', isDark ? '#1f2937' : '#94a3b8', isDark ? 0.25 : 0.3]}
        />
        <directionalLight position={[10, 10, 5]} intensity={isDark ? 0.9 : 0.7} />
        <directionalLight position={[-10, -10, -5]} intensity={isDark ? 0.5 : 0.35} />
        
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
      </Canvas>
    </div>
  );
}
