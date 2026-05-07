import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import type { Messages } from '../i18n.ts';
import type { InteractionMode } from '../preferences.ts';
import { ChallengeMode } from '../components/ChallengeMode.tsx';
import { MobileActionDock } from '../components/ui/MobileActionDock.tsx';
import { MobileElementsDrawer } from '../components/ui/MobileElementsDrawer.tsx';

interface MobileContext {
  messages: Messages;
  isDark: boolean;
  isDesktopViewport: boolean;
}

interface MobilePresentation {
  softPanelClass: string;
  ghostButtonClass: string;
  dangerButtonClass: string;
  primaryTextClass: string;
  sceneExploreHighlightClass: string;
}

interface MobileState {
  isDrawerOpen: boolean;
  mobileStatusChip: string | null;
  challengeActive: boolean;
  mobileChallengeProgress: number | null;
  isDrawerLayout: boolean;
  onboardingStep: ComponentProps<typeof MobileActionDock>['onboardingStep'];
  interactionMode: InteractionMode;
  isMobileChallengeOpen: boolean;
}

interface MobileHandlers {
  onCloseDrawer: () => void;
  onMobileAddAtom: ComponentProps<typeof MobileElementsDrawer>['onAddAtom'];
  onMobileClear: () => void;
  onChallengeClick: () => void;
  onAddClick: () => void;
  onToggleInteractionMode: () => void;
  onToggleMobileChallengeOpen: ComponentProps<typeof ChallengeMode>['setIsMobileDrawerOpen'];
  onStartChallenge: () => void;
}

export interface UseMobileLabViewModelParams {
  context: MobileContext;
  presentation: MobilePresentation;
  state: MobileState;
  handlers: MobileHandlers;
}

export function useMobileLabViewModel({
  context,
  presentation,
  state,
  handlers,
}: UseMobileLabViewModelParams) {
  const { messages, isDark, isDesktopViewport } = context;
  const {
    softPanelClass,
    ghostButtonClass,
    dangerButtonClass,
    primaryTextClass,
    sceneExploreHighlightClass,
  } = presentation;
  const {
    isDrawerOpen,
    mobileStatusChip,
    challengeActive,
    mobileChallengeProgress,
    isDrawerLayout,
    onboardingStep,
    interactionMode,
    isMobileChallengeOpen,
  } = state;
  const {
    onCloseDrawer,
    onMobileAddAtom,
    onMobileClear,
    onChallengeClick,
    onAddClick,
    onToggleInteractionMode,
    onToggleMobileChallengeOpen,
    onStartChallenge,
  } = handlers;

  return useMemo(() => ({
    mobileElementsDrawerProps: {
      isOpen: isDrawerOpen,
      isDark,
      softPanelClass,
      ghostButtonClass,
      dangerButtonClass,
      primaryTextClass,
      messages,
      onClose: onCloseDrawer,
      onAddAtom: onMobileAddAtom,
      onClear: onMobileClear,
    } satisfies ComponentProps<typeof MobileElementsDrawer>,
    mobileActionDockProps: {
      isDesktopViewport,
      mobileStatusChip,
      softPanelClass,
      isDark,
      challengeActive,
      mobileChallengeProgress,
      isDrawerLayout,
      sceneExploreHighlightClass,
      onboardingStep,
      interactionMode,
      messages,
      onChallengeClick,
      onAddClick,
      onToggleInteractionMode,
    } satisfies ComponentProps<typeof MobileActionDock>,
    challengeModeProps: {
      isDrawerLayout,
      isMobileDrawerOpen: isMobileChallengeOpen,
      setIsMobileDrawerOpen: onToggleMobileChallengeOpen,
      onStart: onStartChallenge,
    } satisfies ComponentProps<typeof ChallengeMode>,
  }), [
    challengeActive,
    dangerButtonClass,
    ghostButtonClass,
    interactionMode,
    isDark,
    isDesktopViewport,
    isDrawerLayout,
    isDrawerOpen,
    isMobileChallengeOpen,
    messages,
    mobileChallengeProgress,
    mobileStatusChip,
    onAddClick,
    onChallengeClick,
    onCloseDrawer,
    onMobileAddAtom,
    onMobileClear,
    onStartChallenge,
    onToggleInteractionMode,
    onToggleMobileChallengeOpen,
    onboardingStep,
    primaryTextClass,
    sceneExploreHighlightClass,
    softPanelClass,
  ]);
}
