type MediaQueryChangeHandler = () => void;
type LegacyMediaQueryListener = ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;

export function subscribeToMediaQuery(
  mediaQueryList: MediaQueryList,
  handler: MediaQueryChangeHandler,
): () => void {
  const listener = () => {
    handler();
  };

  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }

  const legacyMediaQueryList = mediaQueryList as {
    addListener?: (callback: LegacyMediaQueryListener) => void;
    removeListener?: (callback: LegacyMediaQueryListener) => void;
  };
  if (typeof legacyMediaQueryList.addListener === 'function') {
    legacyMediaQueryList.addListener(listener);
    return () => {
      legacyMediaQueryList.removeListener?.(listener);
    };
  }

  return () => undefined;
}
