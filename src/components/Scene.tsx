import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useStore } from '../store';
import { AtomNode } from './AtomNode';
import { BondNode } from './BondNode';
import { PhysicsEngine, TransformSync } from '../physics';

export function Scene() {
  const atoms = useStore(state => state.atoms);
  const bonds = useStore(state => state.bonds);
  const theme = useStore(state => state.theme);
  const draggedAtom = useStore(state => state.draggedAtom);
  const rotatingBond = useStore(state => state.rotatingBond);
  const isDark = theme === 'dark';
  const [showDeferredEffects, setShowDeferredEffects] = useState(false);

  useEffect(() => {
    const enableEffects = () => setShowDeferredEffects(true);

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(enableEffects, { timeout: 250 });
      return () => {
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutTarget = typeof window !== 'undefined' ? window : globalThis;
    const timeoutId = timeoutTarget.setTimeout(enableEffects, 120);
    return () => {
      timeoutTarget.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`w-full h-full ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        onPointerMissed={() => useStore.getState().setSelectedAtom(null)}
      >
        <color attach="background" args={[isDark ? '#18181b' : '#e2e8f0']} />
        <ambientLight intensity={isDark ? 0.5 : 0.8} />
        <directionalLight position={[10, 10, 5]} intensity={isDark ? 1 : 0.8} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={isDark ? 0.5 : 0.35} />
        
        <PhysicsEngine />
        <TransformSync />
        
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
        {showDeferredEffects ? (
          <>
            <Environment preset={isDark ? 'city' : 'park'} />
            <ContactShadows
              position={[0, -4, 0]}
              opacity={isDark ? 0.4 : 0.22}
              scale={20}
              blur={2}
              far={10}
            />
          </>
        ) : null}
      </Canvas>
    </div>
  );
}
