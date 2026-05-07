import type { OnboardingStep } from './onboarding.ts';

export interface OnboardingHighlightClasses {
  elementPanelHighlightClass: string;
  sceneExploreHighlightClass: string;
}

const ONBOARDING_HIGHLIGHT_CLASS = 'lab-onboarding-highlight';

export function deriveOnboardingHighlightClasses(
  onboardingStep: OnboardingStep | null,
): OnboardingHighlightClasses {
  return {
    elementPanelHighlightClass: onboardingStep === 'add-atoms' ? ONBOARDING_HIGHLIGHT_CLASS : '',
    sceneExploreHighlightClass: onboardingStep === 'explore' ? ONBOARDING_HIGHLIGHT_CLASS : '',
  };
}
