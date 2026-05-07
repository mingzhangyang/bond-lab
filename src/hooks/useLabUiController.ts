import { useMemo, useState } from 'react';
import { atomPositions, useAtomPositionVersion } from '../physics.ts';
import { deriveMoleculeInsights } from '../moleculeInsights.ts';
import { getMobileChallengeProgress } from '../mobileLabUi.ts';
import { getMessages } from '../i18n.ts';
import { shouldUseMobileChallengeDrawer } from '../challengeLayout.ts';
import { useLabViewport } from './useLabViewport.ts';
import { useLabStoreSnapshot } from './useLabStoreSnapshot.ts';
import { useMobileLabUiState } from './useMobileLabUiState.ts';
import { useLabPresentation } from './useLabPresentation.ts';
import { useLabUiActions } from './useLabUiActions.ts';
import { useDesktopLabViewModel } from './useDesktopLabViewModel.ts';
import { useMobileLabViewModel } from './useMobileLabViewModel.ts';
import { useBondActions } from './useBondActions.ts';
import { useLabOnboardingPresentation } from './useLabOnboardingPresentation.ts';

export function useLabUiController() {
  const {
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
  } = useLabStoreSnapshot();
  const [isElementsPanelOpen, setIsElementsPanelOpen] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const {
    isDesktopViewport,
    isNarrowViewport,
    isCoarsePointer,
    hasTouchInput,
  } = useLabViewport();

  const messages = useMemo(() => getMessages(language), [language]);
  const atomPositionVersion = useAtomPositionVersion();
  const isDark = theme === 'dark';
  const {
    molecule,
    moleculeName,
    moleculeInfo,
    polarityReport,
    polarityLabel,
    polarityTitle,
    structureTitle,
    factTitle,
  } = useMemo(
    () => deriveMoleculeInsights({
      atoms,
      bonds,
      language,
      positions: atomPositions,
    }),
    [atoms, bonds, language, atomPositionVersion],
  );
  const {
    panelClass,
    topBarPanelClass,
    softPanelClass,
    primaryTextClass,
    secondaryTextClass,
    headingTextClass,
    ghostButtonClass,
    inactiveModeClass,
    dangerButtonClass,
    settingsItemClass,
    interactionBubbleClass,
    themeActionText,
    themeVars,
  } = useLabPresentation({
    theme,
    language,
    interactionMode,
  });

  const isDrawerLayout = shouldUseMobileChallengeDrawer(isNarrowViewport, isCoarsePointer, hasTouchInput);
  const mobileChallengeProgress = getMobileChallengeProgress(
    challengeStatus,
    challengeTimeLeft,
    challengeTotalTime,
  );
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    isMobileChallengeOpen,
    setIsMobileChallengeOpen,
    isMobileInfoCollapsed,
    setIsMobileInfoCollapsed,
    mobileStatusChip,
    showMobileStatusChip,
  } = useMobileLabUiState({
    isDesktopViewport,
    isDrawerLayout,
    challengeActive,
    challengeStatus,
  });
  const {
    onboardingStep,
    isOnboardingActive,
    handleDismissOnboarding,
    handleStartOnboarding,
    handleReplayOnboarding,
    elementPanelHighlightClass,
    sceneExploreHighlightClass,
  } = useLabOnboardingPresentation({
    atomCount: atoms.length,
    bondCount: bonds.length,
    isDesktopViewport,
    isElementsPanelOpen,
    setIsElementsPanelOpen,
    closeDrawer: () => setIsDrawerOpen(false),
  });

  const {
    selectedBond,
    lastRemovedBond,
    showBondUndoToast,
    handleUndoBondRemoval,
    handleUpgradeSelectedBond,
    handleRemoveSelectedBond,
  } = useBondActions({
    bonds,
    interactionMode,
    setInteractionMode,
    showMobileStatusChip,
    messages,
  });
  const {
    handleStartChallenge,
    handleElementDragStart,
    handleToggleInteractionMode,
    handleMobileAddAtom,
    handleMobileClear,
    handleMobileAddClick,
    handleChallengeClick,
  } = useLabUiActions({
    messages,
    interactionMode,
    challengeActive,
    isDrawerLayout,
    addAtom,
    clear,
    startChallenge,
    setInteractionMode,
    setIsDrawerOpen,
    setIsMobileChallengeOpen,
    showMobileStatusChip,
  });
  const {
    quickStartGuideProps,
    settingsMenuProps,
    desktopElementsRailProps,
    moleculeInspectorPanelsProps,
    interactionModeFabProps,
    deleteModeHintProps,
    bondUndoToastProps,
    bondActionBarProps,
    isOnboardingVisible,
  } = useDesktopLabViewModel({
    context: {
      messages,
      language,
      isDark,
      isDesktopViewport,
    },
    presentation: {
      themeActionText,
      softPanelClass,
      ghostButtonClass,
      settingsItemClass,
      elementPanelHighlightClass,
      panelClass,
      headingTextClass,
      inactiveModeClass,
      primaryTextClass,
      secondaryTextClass,
      dangerButtonClass,
      sceneExploreHighlightClass,
      interactionBubbleClass,
    },
    state: {
      onboardingStep,
      isOnboardingActive,
      atomCount: atoms.length,
      bondCount: bonds.length,
      isElementsPanelOpen,
      isMobileChallengeOpen,
      molecule,
      moleculeName,
      moleculeInfo,
      isMobileInfoCollapsed,
      structureTitle,
      factTitle,
      polarityTitle,
      polarityLabel,
      polarityClassification: polarityReport.classification,
      polarityReason: polarityReport.reason,
      interactionMode,
      selectedBond,
      showBondUndoToast,
      lastRemovedBond,
    },
    handlers: {
      onToggleTheme: toggleTheme,
      onSetLanguage: setLanguage,
      onReplayOnboarding: handleReplayOnboarding,
      onOpenFeedback: () => setIsFeedbackOpen(true),
      onStartOnboarding: handleStartOnboarding,
      onDismissOnboarding: handleDismissOnboarding,
      onOpenElementsFromGuide: () => setIsDrawerOpen(true),
      onOpenElementsPanel: () => setIsElementsPanelOpen(true),
      onCloseElementsPanel: () => setIsElementsPanelOpen(false),
      onElementDragStart: handleElementDragStart,
      onAddAtom: addAtom,
      onClear: clear,
      onStartChallenge: handleStartChallenge,
      setIsMobileInfoCollapsed,
      onToggleInteractionMode: handleToggleInteractionMode,
      onUpgradeBond: handleUpgradeSelectedBond,
      onDeleteBond: handleRemoveSelectedBond,
      onUndoBond: handleUndoBondRemoval,
    },
  });
  const {
    mobileElementsDrawerProps,
    mobileActionDockProps,
    challengeModeProps,
  } = useMobileLabViewModel({
    context: {
      messages,
      isDark,
      isDesktopViewport,
    },
    presentation: {
      softPanelClass,
      ghostButtonClass,
      dangerButtonClass,
      primaryTextClass,
      sceneExploreHighlightClass,
    },
    state: {
      isDrawerOpen,
      mobileStatusChip,
      challengeActive,
      mobileChallengeProgress,
      isDrawerLayout,
      onboardingStep,
      interactionMode,
      isMobileChallengeOpen,
    },
    handlers: {
      onCloseDrawer: () => setIsDrawerOpen(false),
      onMobileAddAtom: handleMobileAddAtom,
      onMobileClear: handleMobileClear,
      onChallengeClick: handleChallengeClick,
      onAddClick: handleMobileAddClick,
      onToggleInteractionMode: handleToggleInteractionMode,
      onToggleMobileChallengeOpen: setIsMobileChallengeOpen,
      onStartChallenge: handleStartChallenge,
    },
  });

  return {
    rootClassName: `lab-ui-root absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 overflow-hidden ${primaryTextClass}`,
    themeVars,
    isDark,
    isDesktopViewport,
    topBarPanelClass,
    primaryTextClass,
    isOnboardingVisible,
    quickStartGuideProps,
    settingsMenuProps,
    desktopElementsRailProps,
    moleculeInspectorPanelsProps,
    mobileElementsDrawerProps,
    mobileActionDockProps,
    challengeModeProps,
    interactionModeFabProps,
    deleteModeHintProps,
    bondUndoToastProps,
    bondActionBarProps,
    feedbackModalProps: {
      isOpen: isFeedbackOpen,
      onClose: () => setIsFeedbackOpen(false),
      messages,
      isDark,
      softPanelClass,
      settingsItemClass,
    },
  };
}
