export type OnboardingStep = 'welcome' | 'add-atoms' | 'create-bond' | 'explore';

export const ONBOARDING_STORAGE_KEY = 'bondlab-onboarding-version';
export const ONBOARDING_VERSION = '2026-03-quickstart-v1';

export interface OnboardingProgressInput {
  atomCount: number;
  bondCount: number;
}

export function shouldShowOnboarding(
  storedVersion: string | null,
  currentVersion: string = ONBOARDING_VERSION,
): boolean {
  return storedVersion !== currentVersion;
}

export function advanceOnboardingStep(
  step: OnboardingStep,
  { atomCount, bondCount }: OnboardingProgressInput,
): OnboardingStep {
  if (step === 'add-atoms' && atomCount >= 2) {
    return 'create-bond';
  }

  if (step === 'create-bond' && bondCount >= 1) {
    return 'explore';
  }

  return step;
}

export function getOnboardingStepIndex(step: Exclude<OnboardingStep, 'welcome'>): number {
  if (step === 'add-atoms') return 1;
  if (step === 'create-bond') return 2;
  return 3;
}