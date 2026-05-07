import { useEffect, useState } from 'react';
import {
  advanceOnboardingStep,
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_VERSION,
  shouldShowOnboarding,
  type OnboardingStep,
} from '../onboarding';

function getStoredOnboardingVersion(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  } catch {
    return null;
  }
}

function persistOnboardingSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, ONBOARDING_VERSION);
  } catch {
    // No-op when storage is unavailable.
  }
}

interface UseOnboardingGuideParams {
  atomCount: number;
  bondCount: number;
  isDesktopViewport: boolean;
  isElementsPanelOpen: boolean;
  setIsElementsPanelOpen: (open: boolean) => void;
  closeDrawer: () => void;
}

export function useOnboardingGuide({
  atomCount,
  bondCount,
  isDesktopViewport,
  isElementsPanelOpen,
  setIsElementsPanelOpen,
  closeDrawer,
}: UseOnboardingGuideParams) {
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(() => {
    if (typeof window === 'undefined') return null;
    return shouldShowOnboarding(getStoredOnboardingVersion()) ? 'welcome' : null;
  });

  useEffect(() => {
    if (!onboardingStep || onboardingStep === 'welcome') return;
    setOnboardingStep((current) => {
      if (!current || current === 'welcome') return current;
      return advanceOnboardingStep(current, {
        atomCount,
        bondCount,
      });
    });
  }, [atomCount, bondCount, onboardingStep]);

  useEffect(() => {
    if (onboardingStep === 'add-atoms' && isDesktopViewport && !isElementsPanelOpen) {
      setIsElementsPanelOpen(true);
    }
  }, [isDesktopViewport, isElementsPanelOpen, onboardingStep, setIsElementsPanelOpen]);

  const handleDismissOnboarding = () => {
    persistOnboardingSeen();
    setOnboardingStep(null);
  };

  const handleStartOnboarding = () => {
    setOnboardingStep('add-atoms');
  };

  const handleReplayOnboarding = () => {
    closeDrawer();
    if (isDesktopViewport) {
      setIsElementsPanelOpen(true);
    }
    setOnboardingStep('welcome');
  };

  return {
    onboardingStep,
    isOnboardingActive: onboardingStep !== null,
    handleDismissOnboarding,
    handleStartOnboarding,
    handleReplayOnboarding,
  };
}
