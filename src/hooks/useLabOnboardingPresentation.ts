import { useMemo } from 'react';
import { deriveOnboardingHighlightClasses } from '../labOnboardingPresentation.ts';
import { useOnboardingGuide } from './useOnboardingGuide.ts';

interface UseLabOnboardingPresentationParams {
  atomCount: number;
  bondCount: number;
  isDesktopViewport: boolean;
  isElementsPanelOpen: boolean;
  setIsElementsPanelOpen: (open: boolean) => void;
  closeDrawer: () => void;
}

export function useLabOnboardingPresentation({
  atomCount,
  bondCount,
  isDesktopViewport,
  isElementsPanelOpen,
  setIsElementsPanelOpen,
  closeDrawer,
}: UseLabOnboardingPresentationParams) {
  const onboarding = useOnboardingGuide({
    atomCount,
    bondCount,
    isDesktopViewport,
    isElementsPanelOpen,
    setIsElementsPanelOpen,
    closeDrawer,
  });

  const highlights = useMemo(
    () => deriveOnboardingHighlightClasses(onboarding.onboardingStep),
    [onboarding.onboardingStep],
  );

  return {
    ...onboarding,
    ...highlights,
  };
}
