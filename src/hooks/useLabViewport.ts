import { useEffect, useState } from 'react';
import { subscribeToMediaQuery } from '../mediaQuery';

function hasTouchInput(): boolean {
  if (typeof window === 'undefined') return false;
  return ('ontouchstart' in window) || ((window.navigator?.maxTouchPoints ?? 0) > 0);
}

export function useLabViewport() {
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(min-width: 768px)').matches
  ));
  const [isNarrowViewport, setIsNarrowViewport] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 1023px)').matches
  ));
  const [isCoarsePointer, setIsCoarsePointer] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(hover: none), (pointer: coarse)').matches
  ));
  const [hasTouch, setHasTouch] = useState(() => hasTouchInput());

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const desktopMedia = window.matchMedia('(min-width: 768px)');
    const narrowMedia = window.matchMedia('(max-width: 1023px)');
    const coarseMedia = window.matchMedia('(hover: none), (pointer: coarse)');

    const updateViewport = () => {
      setIsDesktopViewport(desktopMedia.matches);
      setIsNarrowViewport(narrowMedia.matches);
      setIsCoarsePointer(coarseMedia.matches);
      setHasTouch(hasTouchInput());
    };

    updateViewport();
    const unsubscribeDesktop = subscribeToMediaQuery(desktopMedia, updateViewport);
    const unsubscribeNarrow = subscribeToMediaQuery(narrowMedia, updateViewport);
    const unsubscribeCoarse = subscribeToMediaQuery(coarseMedia, updateViewport);

    return () => {
      unsubscribeDesktop();
      unsubscribeNarrow();
      unsubscribeCoarse();
    };
  }, []);

  return {
    isDesktopViewport,
    isNarrowViewport,
    isCoarsePointer,
    hasTouchInput: hasTouch,
  };
}
