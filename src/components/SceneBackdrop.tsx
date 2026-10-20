import type { CSSProperties } from 'react';
import { useStore } from '../store';
import { getAppShellTheme } from '../appShell';

export function SceneBackdrop() {
  const theme = useStore((state) => state.theme);
  const shellTheme = getAppShellTheme(theme);

  return (
    <div
      className="lab-scene-backdrop"
      data-theme={theme}
      style={{ '--lab-shell-bg': shellTheme.canvasBackground } as CSSProperties}
      aria-hidden="true"
    >
      <div className="lab-scene-grid" />
      <div className="lab-scene-glow lab-scene-glow-primary" />
      <div className="lab-scene-glow lab-scene-glow-secondary" />
      <div className="lab-scene-vignette" />
    </div>
  );
}
