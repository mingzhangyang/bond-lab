import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import type { Messages } from '../i18n.ts';
import type { InteractionMode } from '../preferences.ts';
import type { Bond } from '../store.ts';
import { QuickStartGuide } from '../components/QuickStartGuide.tsx';
import { BondActionBar } from '../components/ui/BondActionBar.tsx';
import { BondUndoToast } from '../components/ui/BondUndoToast.tsx';
import { DeleteModeHint } from '../components/ui/DeleteModeHint.tsx';
import { DesktopElementsRail } from '../components/ui/DesktopElementsRail.tsx';
import { InteractionModeFab } from '../components/ui/InteractionModeFab.tsx';
import { MoleculeInspectorPanels } from '../components/ui/MoleculeInspectorPanels.tsx';
import { SettingsMenu } from '../components/ui/SettingsMenu.tsx';

interface DesktopContext {
  messages: Messages;
  language: ComponentProps<typeof SettingsMenu>['language'];
  isDark: boolean;
  isDesktopViewport: boolean;
}

interface DesktopPresentation {
  themeActionText: string;
  softPanelClass: string;
  ghostButtonClass: string;
  settingsItemClass: string;
  elementPanelHighlightClass: string;
  panelClass: string;
  headingTextClass: string;
  inactiveModeClass: string;
  primaryTextClass: string;
  secondaryTextClass: string;
  dangerButtonClass: string;
  sceneExploreHighlightClass: string;
  interactionBubbleClass: string;
}

interface DesktopState {
  onboardingStep: ComponentProps<typeof QuickStartGuide>['step'] | null;
  isOnboardingActive: boolean;
  atomCount: number;
  bondCount: number;
  isElementsPanelOpen: boolean;
  isMobileChallengeOpen: boolean;
  molecule: ComponentProps<typeof MoleculeInspectorPanels>['molecule'];
  moleculeName: ComponentProps<typeof MoleculeInspectorPanels>['moleculeName'];
  moleculeInfo: ComponentProps<typeof MoleculeInspectorPanels>['moleculeInfo'];
  isMobileInfoCollapsed: boolean;
  structureTitle: string;
  factTitle: string;
  polarityTitle: string;
  polarityLabel: string;
  polarityClassification: ComponentProps<typeof MoleculeInspectorPanels>['polarityClassification'];
  polarityReason: string;
  interactionMode: InteractionMode;
  selectedBond: Bond | null;
  showBondUndoToast: boolean;
  lastRemovedBond: ComponentProps<typeof BondUndoToast>['lastRemovedBond'];
}

interface DesktopHandlers {
  onToggleTheme: () => void;
  onSetLanguage: (language: ComponentProps<typeof SettingsMenu>['language']) => void;
  onReplayOnboarding: () => void;
  onOpenFeedback: () => void;
  onStartOnboarding: () => void;
  onDismissOnboarding: () => void;
  onOpenElementsFromGuide: () => void;
  onOpenElementsPanel: () => void;
  onCloseElementsPanel: () => void;
  onElementDragStart: ComponentProps<typeof DesktopElementsRail>['onElementDragStart'];
  onAddAtom: ComponentProps<typeof DesktopElementsRail>['onAddAtom'];
  onClear: ComponentProps<typeof DesktopElementsRail>['onClear'];
  onStartChallenge: () => void;
  setIsMobileInfoCollapsed: ComponentProps<typeof MoleculeInspectorPanels>['setIsMobileInfoCollapsed'];
  onToggleInteractionMode: () => void;
  onUpgradeBond: () => void;
  onDeleteBond: () => void;
  onUndoBond: () => void;
}

export interface UseDesktopLabViewModelParams {
  context: DesktopContext;
  presentation: DesktopPresentation;
  state: DesktopState;
  handlers: DesktopHandlers;
}

export function useDesktopLabViewModel({
  context,
  presentation,
  state,
  handlers,
}: UseDesktopLabViewModelParams) {
  const { messages, language, isDark, isDesktopViewport } = context;
  const {
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
  } = presentation;
  const {
    onboardingStep,
    isOnboardingActive,
    atomCount,
    bondCount,
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
    polarityClassification,
    polarityReason,
    interactionMode,
    selectedBond,
    showBondUndoToast,
    lastRemovedBond,
  } = state;
  const {
    onToggleTheme,
    onSetLanguage,
    onReplayOnboarding,
    onOpenFeedback,
    onStartOnboarding,
    onDismissOnboarding,
    onOpenElementsFromGuide,
    onOpenElementsPanel,
    onCloseElementsPanel,
    onElementDragStart,
    onAddAtom,
    onClear,
    onStartChallenge,
    setIsMobileInfoCollapsed,
    onToggleInteractionMode,
    onUpgradeBond,
    onDeleteBond,
    onUndoBond,
  } = handlers;

  return useMemo(() => ({
    quickStartGuideProps: {
      messages,
      isDark,
      isDesktopViewport,
      step: onboardingStep ?? 'welcome',
      atomCount,
      bondCount,
      onStart: onStartOnboarding,
      onSkip: onDismissOnboarding,
      onFinish: onDismissOnboarding,
      onOpenElements: onOpenElementsFromGuide,
    } satisfies ComponentProps<typeof QuickStartGuide>,
    settingsMenuProps: {
      messages,
      isDark,
      language,
      themeActionText,
      softPanelClass,
      ghostButtonClass,
      settingsItemClass,
      onToggleTheme,
      onSetLanguage,
      onReplayOnboarding,
      onOpenFeedback,
    } satisfies ComponentProps<typeof SettingsMenu>,
    desktopElementsRailProps: {
      isDesktopViewport,
      isElementsPanelOpen,
      elementPanelHighlightClass,
      softPanelClass,
      panelClass,
      headingTextClass,
      ghostButtonClass,
      inactiveModeClass,
      primaryTextClass,
      secondaryTextClass,
      dangerButtonClass,
      isDark,
      sceneExploreHighlightClass,
      messages,
      onOpenPanel: onOpenElementsPanel,
      onClosePanel: onCloseElementsPanel,
      onElementDragStart,
      onAddAtom,
      onClear,
      onStartChallenge,
    } satisfies ComponentProps<typeof DesktopElementsRail>,
    moleculeInspectorPanelsProps: {
      isDesktopViewport,
      isMobileChallengeOpen,
      atomsLength: atomCount,
      molecule,
      moleculeName,
      moleculeInfo,
      isMobileInfoCollapsed,
      setIsMobileInfoCollapsed,
      panelClass,
      headingTextClass,
      primaryTextClass,
      secondaryTextClass,
      ghostButtonClass,
      isDark,
      structureTitle,
      factTitle,
      polarityTitle,
      polarityLabel,
      polarityClassification,
      polarityReason,
      messages,
    } satisfies ComponentProps<typeof MoleculeInspectorPanels>,
    interactionModeFabProps: {
      isDesktopViewport,
      interactionMode,
      onToggle: onToggleInteractionMode,
      interactionBubbleClass,
      sceneExploreHighlightClass,
      messages,
    } satisfies ComponentProps<typeof InteractionModeFab>,
    deleteModeHintProps: {
      interactionMode,
      messages,
      softPanelClass,
    } satisfies ComponentProps<typeof DeleteModeHint>,
    bondUndoToastProps: {
      showBondUndoToast,
      lastRemovedBond,
      onUndo: onUndoBond,
      softPanelClass,
      isDark,
      messages,
    } satisfies ComponentProps<typeof BondUndoToast>,
    bondActionBarProps: {
      interactionMode,
      selectedBond,
      onUpgrade: onUpgradeBond,
      onDelete: onDeleteBond,
      softPanelClass,
      secondaryTextClass,
      isDark,
      messages,
    } satisfies ComponentProps<typeof BondActionBar>,
    isOnboardingVisible: isOnboardingActive && onboardingStep !== null,
  }), [
    atomCount,
    bondCount,
    dangerButtonClass,
    elementPanelHighlightClass,
    factTitle,
    ghostButtonClass,
    headingTextClass,
    inactiveModeClass,
    interactionBubbleClass,
    interactionMode,
    isDark,
    isDesktopViewport,
    isElementsPanelOpen,
    isMobileChallengeOpen,
    isMobileInfoCollapsed,
    isOnboardingActive,
    language,
    lastRemovedBond,
    messages,
    molecule,
    moleculeInfo,
    moleculeName,
    onAddAtom,
    onClear,
    onCloseElementsPanel,
    onDeleteBond,
    onDismissOnboarding,
    onElementDragStart,
    onOpenElementsFromGuide,
    onOpenElementsPanel,
    onOpenFeedback,
    onReplayOnboarding,
    onSetLanguage,
    onStartChallenge,
    onStartOnboarding,
    onToggleInteractionMode,
    onToggleTheme,
    onUndoBond,
    onUpgradeBond,
    onboardingStep,
    panelClass,
    polarityClassification,
    polarityLabel,
    polarityReason,
    polarityTitle,
    primaryTextClass,
    sceneExploreHighlightClass,
    secondaryTextClass,
    selectedBond,
    setIsMobileInfoCollapsed,
    settingsItemClass,
    showBondUndoToast,
    softPanelClass,
    structureTitle,
    themeActionText,
  ]);
}
