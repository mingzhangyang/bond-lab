import { useStore } from '../store.ts';

export function useLabStoreSnapshot() {
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const addAtom = useStore((state) => state.addAtom);
  const clear = useStore((state) => state.clear);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);
  const interactionMode = useStore((state) => state.interactionMode);
  const setInteractionMode = useStore((state) => state.setInteractionMode);
  const challengeActive = useStore((state) => state.challengeActive);
  const challengeStatus = useStore((state) => state.challengeStatus);
  const challengeTimeLeft = useStore((state) => state.challengeTimeLeft);
  const challengeTotalTime = useStore((state) => state.challengeTotalTime);
  const startChallenge = useStore((state) => state.startChallenge);

  return {
    atoms,
    bonds,
    addAtom,
    clear,
    theme,
    toggleTheme,
    language,
    setLanguage,
    interactionMode,
    setInteractionMode,
    challengeActive,
    challengeStatus,
    challengeTimeLeft,
    challengeTotalTime,
    startChallenge,
  };
}
