import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useStore } from '../store';
import { AtomNode } from './AtomNode';
import { BondNode } from './BondNode';
import { PhysicsEngine } from '../physics';

export function Scene() {
  const atoms = useStore(state => state.atoms);
  const bonds = useStore(state => state.bonds);

  return (
    <div className="w-full h-full bg-zinc-900">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        onPointerMissed={() => useStore.getState().setSelectedAtom(null)}
      >
        <color attach="background" args={['#18181b']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <PhysicsEngine />
        
        <group>
          {atoms.map(atom => (
            <AtomNode key={atom.id} id={atom.id} element={atom.element} />
          ))}
          {bonds.map(bond => (
            <BondNode key={bond.id} bond={bond} />
          ))}
        </group>

        <OrbitControls makeDefault enablePan={false} enableZoom={true} />
        <Environment preset="city" />
        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={10} />
      </Canvas>
    </div>
  );
}
