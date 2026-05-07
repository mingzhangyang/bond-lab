import React, { useEffect, useMemo, useState } from 'react';
import { useStore, type ElementType } from '../store';
import { identifyMolecule, KNOWN_MOLECULES } from '../identifier';
import { calculateMolecularPolarity } from '../polarity';
import { atomPositions, useAtomPositionVersion } from '../physics';
import { getMoleculeInfo } from '../moleculeInfo';
import {
  ChallengeMode,
} from './ChallengeMode';
import { getMessages, localizeMoleculeName } from '../i18n';
import { toggleInteractionMode } from '../preferences';
import { getLabThemeVars } from '../theme';
import {
  setElementDragData,
} from '../drag';
import {
  shouldUseMobileChallengeDrawer,
} from '../challengeLayout';
import { QuickStartGuide } from './QuickStartGuide';
import {
  getChallengeCandidateMolecules,
  pickChallengeMolecule,
} from '../challengeTargets';
import { SettingsMenu } from './ui/SettingsMenu';
import { useLabViewport } from '../hooks/useLabViewport';
import { useBondActions } from '../hooks/useBondActions';
import { MobileActionDock } from './ui/MobileActionDock';
import { InteractionModeFab } from './ui/InteractionModeFab';
import { DeleteModeHint } from './ui/DeleteModeHint';
import { BondActionBar } from './ui/BondActionBar';
import { BondUndoToast } from './ui/BondUndoToast';
import { DesktopElementsRail } from './ui/DesktopElementsRail';
import { MobileElementsDrawer } from './ui/MobileElementsDrawer';
import { useOnboardingGuide } from '../hooks/useOnboardingGuide';
import { TopBrandHeader } from './ui/TopBrandHeader';
import { MoleculeInspectorPanels } from './ui/MoleculeInspectorPanels';

export function UI() {
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isElementsPanelOpen, setIsElementsPanelOpen] = useState(true);
  const {
    isDesktopViewport,
    isNarrowViewport,
    isCoarsePointer,
    hasTouchInput,
  } = useLabViewport();
  const [isMobileChallengeOpen, setIsMobileChallengeOpen] = useState(false);
  const [isMobileInfoCollapsed, setIsMobileInfoCollapsed] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && !window.matchMedia('(min-width: 768px)').matches
  ));
  const [mobileStatusChip, setMobileStatusChip] = useState<string | null>(null);

  const messages = useMemo(() => getMessages(language), [language]);
  const atomPositionVersion = useAtomPositionVersion();
  const isDark = theme === 'dark';
  const molecule = useMemo(() => identifyMolecule(atoms, bonds), [atoms, bonds]);
  const moleculeName = useMemo(
    () => (molecule ? localizeMoleculeName(language, molecule.name) : null),
    [language, molecule],
  );
  const moleculeInfo = useMemo(
    () => (molecule ? getMoleculeInfo(molecule.name) : null),
    [molecule],
  );
  const polarityReport = useMemo(
    () => calculateMolecularPolarity(atoms, bonds, atomPositions),
    [atoms, bonds, atomPositionVersion],
  );

  const polarityLabel = useMemo(() => {
    const labels = {
      en: { polar: 'Polar', nonpolar: 'Nonpolar', unknown: 'Unknown' },
      es: { polar: 'Polar', nonpolar: 'No polar', unknown: 'Desconocido' },
      zh: { polar: '极性', nonpolar: '非极性', unknown: '未知' },
      fr: { polar: 'Polaire', nonpolar: 'Apolaire', unknown: 'Inconnu' },
      ja: { polar: '極性', nonpolar: '無極性', unknown: '不明' },
    } as const;
    return labels[language][polarityReport.classification];
  }, [language, polarityReport.classification]);

  const polarityTitle = useMemo(() => {
    const titles = {
      en: 'Polarity',
      es: 'Polaridad',
      zh: '极性',
      fr: 'Polarite',
      ja: '極性',
    } as const;
    return titles[language];
  }, [language]);

  const structureTitle = useMemo(() => {
    const titles = {
      en: 'Structure',
      es: 'Estructura',
      zh: '结构式',
      fr: 'Structure',
      ja: '構造式',
    } as const;
    return titles[language];
  }, [language]);

  const factTitle = useMemo(() => {
    const titles = {
      en: 'Quick Fact',
      es: 'Dato',
      zh: '小知识',
      fr: 'Info',
      ja: '豆知识',
    } as const;
    return titles[language];
  }, [language]);
  const themeActionText = useMemo(() => {
    const labels = {
      en: { dark: 'Use dark mode', light: 'Use light mode' },
      es: { dark: 'Usar modo oscuro', light: 'Usar modo claro' },
      zh: { dark: '切换到深色', light: '切换到浅色' },
      fr: { dark: 'Utiliser le mode sombre', light: 'Utiliser le mode clair' },
      ja: { dark: 'ダークモードへ', light: 'ライトモードへ' },
    } as const;
    return isDark ? labels[language].light : labels[language].dark;
  }, [isDark, language]);

  const panelClass = 'lab-panel lab-panel-glow border backdrop-blur-xl';
  const topBarPanelClass = 'bg-transparent';
  const softPanelClass = 'lab-soft-panel border backdrop-blur-md';
  const primaryTextClass = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const secondaryTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const headingTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const ghostButtonClass = isDark
    ? 'lab-ghost text-zinc-300 hover:text-white'
    : 'lab-ghost text-zinc-600 hover:text-zinc-900';
  const inactiveModeClass = isDark
    ? 'lab-tile text-zinc-200 hover:text-white'
    : 'lab-tile text-zinc-700';
  const dangerButtonClass = isDark
    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/25'
    : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300';
  const settingsItemClass = isDark
    ? 'lab-ghost text-zinc-200'
    : 'lab-ghost text-zinc-700';
  const interactionBubbleClass = interactionMode === 'delete'
    ? (isDark
      ? 'lab-fab bg-red-500 text-white hover:bg-red-600'
      : 'lab-fab bg-red-500 text-white hover:bg-red-600')
    : 'lab-fab text-white';
  const {
    onboardingStep,
    isOnboardingActive,
    handleDismissOnboarding,
    handleStartOnboarding,
    handleReplayOnboarding,
  } = useOnboardingGuide({
    atomCount: atoms.length,
    bondCount: bonds.length,
    isDesktopViewport,
    isElementsPanelOpen,
    setIsElementsPanelOpen,
    closeDrawer: () => setIsDrawerOpen(false),
  });
  const elementPanelHighlightClass = onboardingStep === 'add-atoms' ? 'lab-onboarding-highlight' : '';
  const sceneExploreHighlightClass = onboardingStep === 'explore' ? 'lab-onboarding-highlight' : '';
  const themeVars = getLabThemeVars(theme);
  const isDrawerLayout = shouldUseMobileChallengeDrawer(isNarrowViewport, isCoarsePointer, hasTouchInput);
  const mobileChallengeProgress = challengeStatus === 'playing' && challengeTotalTime > 0
    ? Math.max(0, Math.min(1, challengeTimeLeft / challengeTotalTime))
    : null;

  useEffect(() => {
    if (!isDrawerLayout) {
      setIsMobileChallengeOpen(false);
      return;
    }
    if (challengeActive) {
      setIsMobileChallengeOpen(true);
    }
  }, [challengeActive, isDrawerLayout]);

  useEffect(() => {
    if (!isDrawerLayout || !challengeActive) return;
    if (challengeStatus !== 'playing') {
      setIsMobileChallengeOpen(true);
    }
  }, [challengeActive, challengeStatus, isDrawerLayout]);

  useEffect(() => {
    if (!mobileStatusChip) return;
    const timeout = window.setTimeout(() => setMobileStatusChip(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [mobileStatusChip]);

  const showMobileStatusChip = (label: string) => {
    if (isDesktopViewport) return;
    setMobileStatusChip(label);
  };

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

  const handleStartChallenge = () => {
    const challengePool = getChallengeCandidateMolecules(KNOWN_MOLECULES);
    const randomMol = pickChallengeMolecule(challengePool, Math.random()) ?? KNOWN_MOLECULES[0];
    if (!randomMol) return;
    const timeLimit = 30 + randomMol.atomCount * 5;
    startChallenge({ name: randomMol.name, formula: randomMol.formula }, timeLimit);
    if (isDrawerLayout) {
      setIsMobileChallengeOpen(true);
    }
    showMobileStatusChip(messages.challenge.title);
  };

  const handleElementDragStart = (event: React.DragEvent<HTMLButtonElement>, element: ElementType) => {
    setElementDragData(event.dataTransfer, element);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleToggleInteractionMode = () => {
    const nextMode = toggleInteractionMode(interactionMode);
    setInteractionMode(nextMode);
    showMobileStatusChip(nextMode === 'build' ? messages.ui.buildMode : messages.ui.removeHint);
  };

  return (
    <div
      className={`lab-ui-root absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 overflow-hidden ${primaryTextClass}`}
      style={themeVars}
    >
      {isOnboardingActive && onboardingStep && (
        <QuickStartGuide
          messages={messages}
          isDark={isDark}
          isDesktopViewport={isDesktopViewport}
          step={onboardingStep}
          atomCount={atoms.length}
          bondCount={bonds.length}
          onStart={handleStartOnboarding}
          onSkip={handleDismissOnboarding}
          onFinish={handleDismissOnboarding}
          onOpenElements={() => setIsDrawerOpen(true)}
        />
      )}

      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className={`lab-orb absolute -top-20 left-1/4 h-64 w-64 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-200/60'}`} />
        <div className={`lab-orb absolute -bottom-24 right-1/5 h-72 w-72 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/12' : 'bg-cyan-100/70'}`} style={{ animationDelay: '1.5s' }} />
      </div>
      <TopBrandHeader
        isDesktopViewport={isDesktopViewport}
        topBarPanelClass={topBarPanelClass}
        primaryTextClass={primaryTextClass}
      />

      <SettingsMenu
        messages={messages}
        isDark={isDark}
        language={language}
        themeActionText={themeActionText}
        softPanelClass={softPanelClass}
        ghostButtonClass={ghostButtonClass}
        settingsItemClass={settingsItemClass}
        onToggleTheme={toggleTheme}
        onSetLanguage={setLanguage}
        onReplayOnboarding={handleReplayOnboarding}
      />

      <DesktopElementsRail
        isDesktopViewport={isDesktopViewport}
        isElementsPanelOpen={isElementsPanelOpen}
        elementPanelHighlightClass={elementPanelHighlightClass}
        softPanelClass={softPanelClass}
        panelClass={panelClass}
        headingTextClass={headingTextClass}
        ghostButtonClass={ghostButtonClass}
        inactiveModeClass={inactiveModeClass}
        primaryTextClass={primaryTextClass}
        secondaryTextClass={secondaryTextClass}
        dangerButtonClass={dangerButtonClass}
        isDark={isDark}
        sceneExploreHighlightClass={sceneExploreHighlightClass}
        messages={messages}
        onOpenPanel={() => setIsElementsPanelOpen(true)}
        onClosePanel={() => setIsElementsPanelOpen(false)}
        onElementDragStart={handleElementDragStart}
        onAddAtom={addAtom}
        onClear={clear}
        onStartChallenge={handleStartChallenge}
      />

      <MoleculeInspectorPanels
        isDesktopViewport={isDesktopViewport}
        isMobileChallengeOpen={isMobileChallengeOpen}
        atomsLength={atoms.length}
        molecule={molecule}
        moleculeName={moleculeName}
        moleculeInfo={moleculeInfo}
        isMobileInfoCollapsed={isMobileInfoCollapsed}
        setIsMobileInfoCollapsed={setIsMobileInfoCollapsed}
        panelClass={panelClass}
        headingTextClass={headingTextClass}
        primaryTextClass={primaryTextClass}
        secondaryTextClass={secondaryTextClass}
        ghostButtonClass={ghostButtonClass}
        isDark={isDark}
        structureTitle={structureTitle}
        factTitle={factTitle}
        polarityTitle={polarityTitle}
        polarityLabel={polarityLabel}
        polarityClassification={polarityReport.classification}
        polarityReason={polarityReport.reason}
        messages={messages}
      />

      <MobileElementsDrawer
        isOpen={isDrawerOpen}
        isDark={isDark}
        softPanelClass={softPanelClass}
        ghostButtonClass={ghostButtonClass}
        dangerButtonClass={dangerButtonClass}
        primaryTextClass={primaryTextClass}
        messages={messages}
        onClose={() => setIsDrawerOpen(false)}
        onAddAtom={(el) => {
          addAtom(el);
          setIsDrawerOpen(false);
          showMobileStatusChip(messages.elements[el]);
        }}
        onClear={() => {
          clear();
          setIsDrawerOpen(false);
          showMobileStatusChip(messages.ui.clearAll);
        }}
      />

      <MobileActionDock
        isDesktopViewport={isDesktopViewport}
        mobileStatusChip={mobileStatusChip}
        softPanelClass={softPanelClass}
        isDark={isDark}
        challengeActive={challengeActive}
        mobileChallengeProgress={mobileChallengeProgress}
        isDrawerLayout={isDrawerLayout}
        sceneExploreHighlightClass={sceneExploreHighlightClass}
        onboardingStep={onboardingStep}
        interactionMode={interactionMode}
        messages={messages}
        onChallengeClick={challengeActive
          ? () => setIsMobileChallengeOpen((isOpen) => !isOpen)
          : handleStartChallenge}
        onAddClick={() => {
          setIsDrawerOpen(true);
          showMobileStatusChip(messages.ui.addElement);
        }}
        onToggleInteractionMode={handleToggleInteractionMode}
      />

      {!isDesktopViewport && (
        <div className="pointer-events-auto md:hidden">
          <ChallengeMode
            isDrawerLayout={isDrawerLayout}
            isMobileDrawerOpen={isMobileChallengeOpen}
            setIsMobileDrawerOpen={setIsMobileChallengeOpen}
            onStart={handleStartChallenge}
          />
        </div>
      )}

      <InteractionModeFab
        isDesktopViewport={isDesktopViewport}
        interactionMode={interactionMode}
        onToggle={handleToggleInteractionMode}
        interactionBubbleClass={interactionBubbleClass}
        sceneExploreHighlightClass={sceneExploreHighlightClass}
        messages={messages}
      />

      <DeleteModeHint
        interactionMode={interactionMode}
        messages={messages}
        softPanelClass={softPanelClass}
      />

      <BondUndoToast
        showBondUndoToast={showBondUndoToast}
        lastRemovedBond={lastRemovedBond}
        onUndo={handleUndoBondRemoval}
        softPanelClass={softPanelClass}
        isDark={isDark}
        messages={messages}
      />

      <BondActionBar
        interactionMode={interactionMode}
        selectedBond={selectedBond}
        onUpgrade={handleUpgradeSelectedBond}
        onDelete={handleRemoveSelectedBond}
        softPanelClass={softPanelClass}
        secondaryTextClass={secondaryTextClass}
        isDark={isDark}
        messages={messages}
      />
    </div>
  );
}
