import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { createRoot, events, extend, unmountComponentAtNode, type RootState } from '@react-three/fiber';
import * as THREE from 'three';

extend({
  Mesh: THREE.Mesh,
  Group: THREE.Group,
  SphereGeometry: THREE.SphereGeometry,
  CylinderGeometry: THREE.CylinderGeometry,
  MeshPhysicalMaterial: THREE.MeshPhysicalMaterial,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  ShaderMaterial: THREE.ShaderMaterial,
  AmbientLight: THREE.AmbientLight,
  DirectionalLight: THREE.DirectionalLight,
});

class RenderBoundary extends Component<{ children: ReactNode; onError: (error: Error) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onError(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

interface SceneCanvasProps {
  children: ReactNode;
  onPointerMissed: () => void;
}

// Own the async configure promise. Fiber's DOM Canvas does not forward renderer
// initialization rejections to an error boundary. A fresh canvas per effect also
// prevents delayed root disposal from destroying a StrictMode replacement.
export function SceneCanvas({ children, onPointerMissed }: SceneCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none';
    host.appendChild(canvas);
    let cancelled = false;
    let renderer: THREE.WebGLRenderer | undefined;
    let root: ReturnType<typeof createRoot> | undefined;
    let state: RootState | undefined;
    const fail = (reason: unknown) => {
      if (!cancelled) setError(reason instanceof Error ? reason : new Error(String(reason)));
    };
    const onContextLost = () => fail(new Error('WebGL context lost'));
    canvas.addEventListener('webglcontextlost', onContextLost);

    const resize = () => {
      if (!state || cancelled) return;
      const rect = host.getBoundingClientRect();
      state.setSize(rect.width, rect.height, rect.top, rect.left);
      state.setDpr(Math.min(2, window.devicePixelRatio || 1));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener('resize', resize);

    const initialize = async () => {
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        root = createRoot(canvas);
        const rect = host.getBoundingClientRect();
        await root.configure({
          gl: renderer,
          events,
          camera: { position: [0, 0, 10], fov: 45 },
          dpr: [1, 2],
          size: { width: rect.width, height: rect.height, top: rect.top, left: rect.left },
          onPointerMissed,
        });
        if (cancelled) return;
        renderer.toneMapping = THREE.NeutralToneMapping;
        renderer.toneMappingExposure = 1.05;
        state = root.render(<RenderBoundary onError={fail}>{children}</RenderBoundary>).getState();
        resize();
      } catch (reason) {
        fail(reason);
      }
    };
    void initialize();

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      // Let scene effects release PMREM/material resources before disposing the
      // renderer's internal caches. Fiber also releases the WebGL context.
      if (root) unmountComponentAtNode(canvas, () => renderer?.dispose());
      else {
        renderer?.dispose();
        renderer?.forceContextLoss();
      }
      canvas.remove();
    };
  }, [children, onPointerMissed]);

  if (error) throw error;
  return <div ref={hostRef} className="absolute inset-0" />;
}
