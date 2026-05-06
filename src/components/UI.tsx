import React, { useEffect, useMemo, useState } from 'react';
import { useStore, ELEMENTS, ELEMENT_DISPLAY_ORDER } from '../store';
import { identifyMolecule, KNOWN_MOLECULES } from '../identifier';
import { calculateMolecularPolarity } from '../polarity';
import { atomPositions, useAtomPositionVersion } from '../physics';
import { getMoleculeInfo } from '../moleculeInfo';
import {
  Atom,
  Trash2,
  X,
  Plus,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { StabilityDisplay } from './StabilityDisplay';
import {
  ChallengeMode,
  MobileChallengeTrigger,
  MOBILE_CHALLENGE_TRIGGER_RADIUS,
} from './ChallengeMode';
import { getMessages, localizeMoleculeName } from '../i18n';
import { toggleInteractionMode } from '../preferences';
import { getLabThemeVars } from '../theme';
import {
  advanceOnboardingStep,
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_VERSION,
  shouldShowOnboarding,
  type OnboardingStep,
} from '../onboarding';
import {
  setElementDragData,
} from '../drag';
import {
  getChallengeTimerArc,
  shouldUseMobileChallengeDrawer,
} from '../challengeLayout';
import { QuickStartGuide } from './QuickStartGuide';
import {
  getChallengeCandidateMolecules,
  pickChallengeMolecule,
} from '../challengeTargets';
import { SettingsMenu } from './ui/SettingsMenu';
import { MoleculeInspector } from './ui/MoleculeInspector';

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
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(min-width: 768px)').matches
  ));
  const [isNarrowViewport, setIsNarrowViewport] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 1023px)').matches
  ));
  const [isCoarsePointer, setIsCoarsePointer] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(hover: none), (pointer: coarse)').matches
  ));
  const [hasTouchInput, setHasTouchInput] = useState(() => (
    typeof window !== 'undefined'
    && (
      ('ontouchstart' in window)
      || ((window.navigator?.maxTouchPoints ?? 0) > 0)
    )
  ));
  const [isMobileChallengeOpen, setIsMobileChallengeOpen] = useState(false);
  const [isMobileInfoCollapsed, setIsMobileInfoCollapsed] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && !window.matchMedia('(min-width: 768px)').matches
  ));
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(() => {
    if (typeof window === 'undefined') return null;
    return shouldShowOnboarding(getStoredOnboardingVersion()) ? 'welcome' : null;
  });

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
  const isOnboardingActive = onboardingStep !== null;
  const elementPanelHighlightClass = onboardingStep === 'add-atoms' ? 'lab-onboarding-highlight' : '';
  const sceneExploreHighlightClass = onboardingStep === 'explore' ? 'lab-onboarding-highlight' : '';
  const themeVars = getLabThemeVars(theme);
  const isDrawerLayout = shouldUseMobileChallengeDrawer(isNarrowViewport, isCoarsePointer, hasTouchInput);
  const mobileChallengeTimerArc = challengeStatus === 'playing'
    ? getChallengeTimerArc(challengeTimeLeft, challengeTotalTime, MOBILE_CHALLENGE_TRIGGER_RADIUS)
    : null;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const desktopMedia = window.matchMedia('(min-width: 768px)');
    const narrowMedia = window.matchMedia('(max-width: 1023px)');
    const coarseMedia = window.matchMedia('(hover: none), (pointer: coarse)');
    const updateViewport = () => {
      setIsDesktopViewport(desktopMedia.matches);
      setIsNarrowViewport(narrowMedia.matches);
      setIsCoarsePointer(coarseMedia.matches);
      setHasTouchInput(('ontouchstart' in window) || ((window.navigator?.maxTouchPoints ?? 0) > 0));
    };
    updateViewport();
    desktopMedia.addEventListener('change', updateViewport);
    narrowMedia.addEventListener('change', updateViewport);
    coarseMedia.addEventListener('change', updateViewport);
    return () => {
      desktopMedia.removeEventListener('change', updateViewport);
      narrowMedia.removeEventListener('change', updateViewport);
      coarseMedia.removeEventListener('change', updateViewport);
    };
  }, []);

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
    if (!onboardingStep || onboardingStep === 'welcome') return;
    setOnboardingStep((current) => {
      if (!current || current === 'welcome') return current;
      return advanceOnboardingStep(current, {
        atomCount: atoms.length,
        bondCount: bonds.length,
      });
    });
  }, [atoms.length, bonds.length, onboardingStep]);

  useEffect(() => {
    if (onboardingStep === 'add-atoms' && isDesktopViewport && !isElementsPanelOpen) {
      setIsElementsPanelOpen(true);
    }
  }, [isDesktopViewport, isElementsPanelOpen, onboardingStep]);

  const handleStartChallenge = () => {
    const challengePool = getChallengeCandidateMolecules(KNOWN_MOLECULES);
    const randomMol = pickChallengeMolecule(challengePool, Math.random()) ?? KNOWN_MOLECULES[0];
    if (!randomMol) return;
    const timeLimit = 30 + randomMol.atomCount * 5;
    startChallenge({ name: randomMol.name, formula: randomMol.formula }, timeLimit);
    if (isDrawerLayout) {
      setIsMobileChallengeOpen(true);
    }
  };

  const handleElementDragStart = (event: React.DragEvent<HTMLButtonElement>, element: keyof typeof ELEMENTS) => {
    setElementDragData(event.dataTransfer, element);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleDismissOnboarding = () => {
    persistOnboardingSeen();
    setOnboardingStep(null);
  };

  const handleStartOnboarding = () => {
    setOnboardingStep('add-atoms');
  };

  const handleReplayOnboarding = () => {
    setIsDrawerOpen(false);
    if (isDesktopViewport) {
      setIsElementsPanelOpen(true);
    }
    setOnboardingStep('welcome');
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
      {/* Top Section */}
      <div className="lab-reveal relative flex items-start w-full">
        {/* Top Left */}
        <div className="flex flex-col gap-4 w-full md:w-64">

          {/* Logo */}
          <div
            className={`flex items-center p-3 md:p-4 rounded-2xl pointer-events-auto w-full ${topBarPanelClass}`}
          >
            <div className="flex items-center gap-3">
              <img
                src="/BondLab-LogoSmall-128x128.svg"
                alt="BondLab logo"
                width={32}
                height={32}
                className="shrink-0"
              />
              <span className={`info-display font-black text-lg sm:text-xl tracking-tight ${primaryTextClass}`}>
                Bond<span className="text-indigo-400">Lab</span>
              </span>
            </div>
          </div>

          {!isDesktopViewport && (
            <div className="pointer-events-auto">
              <StabilityDisplay />
            </div>
          )}
        </div>
      </div>

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

      {/* Desktop Left Rail */}
      <div className="hidden md:flex fixed left-0 top-[calc(env(safe-area-inset-top)+5.75rem)] bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] z-40 pointer-events-none">
        <div className="relative flex h-full flex-col gap-4">
          <div className={`relative flex-1 min-h-0 w-80 ${elementPanelHighlightClass}`}>
            {!isElementsPanelOpen && (
              <button
                onClick={() => setIsElementsPanelOpen(true)}
                aria-label={messages.ui.elements}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-40 min-h-[56px] px-3 rounded-r-xl border border-l-0 items-center gap-2 pointer-events-auto transition-colors flex ${softPanelClass} ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}
              >
                <ChevronRight size={16} />
                <span className="info-display text-xs font-semibold uppercase tracking-wide">{messages.ui.elements}</span>
              </button>
            )}

            <div
              className={`lab-reveal flex h-full w-80 rounded-2xl p-4 pointer-events-auto transition-transform duration-300 ${isElementsPanelOpen
                  ? 'translate-x-0'
                  : '-translate-x-[calc(100%+2rem)] pointer-events-none'
                } ${panelClass}`}
              style={{ animationDelay: '70ms' }}
            >
              <div className="flex flex-col h-full w-full min-h-0">
                <div className="flex items-center justify-between mb-4">
                  <h1 className={`info-display font-bold text-sm tracking-wider uppercase ${headingTextClass}`}>{messages.ui.elements}</h1>
                  <button
                    onClick={() => setIsElementsPanelOpen(false)}
                    aria-label={messages.ui.collapse}
                    className={`min-h-[36px] min-w-[36px] rounded-lg transition-colors flex items-center justify-center ${ghostButtonClass}`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 min-h-0 stealth-scrollbar">
                  {ELEMENT_DISPLAY_ORDER.map(el => {
                    const data = ELEMENTS[el];
                    return (
                      <button
                        key={el}
                        data-testid={`element-button-${el}`}
                        draggable={isDesktopViewport}
                        onDragStart={(event) => handleElementDragStart(event, el)}
                        onClick={() => addAtom(el)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-colors border ${inactiveModeClass}`}
                      >
                        <div
                          className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ backgroundColor: data.color, color: el === 'H' ? 'black' : 'white' }}
                        >
                          {data.symbol}
                        </div>
                        <div className={`font-medium text-xs leading-tight ${primaryTextClass}`}>{messages.elements[el]}</div>
                        <div className={`text-[11px] ${secondaryTextClass}`}>{messages.ui.valence}: {data.valence}</div>
                      </button>
                    );
                  })}
                </div>

                <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                  <button
                    data-testid="clear-elements-desktop"
                    onClick={clear}
                    className={`w-full min-h-[44px] flex items-center justify-center gap-2 p-2 rounded-xl transition-colors text-sm font-medium ${dangerButtonClass}`}
                  >
                    <Trash2 size={16} /> {messages.ui.clear}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isDesktopViewport && (
            <div className={`pointer-events-auto w-80 ${sceneExploreHighlightClass}`}>
              <ChallengeMode
                isDrawerLayout={false}
                isMobileDrawerOpen={false}
                setIsMobileDrawerOpen={() => { }}
                onStart={handleStartChallenge}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Challenge */}
      {!isDesktopViewport && (
        <>
          <div className="pointer-events-auto md:hidden">
            <ChallengeMode
              isDrawerLayout={isDrawerLayout}
              isMobileDrawerOpen={isMobileChallengeOpen}
              setIsMobileDrawerOpen={setIsMobileChallengeOpen}
              onStart={handleStartChallenge}
            />
          </div>
        </>
      )}
      {/* Desktop Right Rail */}
      {isDesktopViewport && (atoms.length > 0 || molecule) && (
        <div
          className="hidden md:flex fixed right-6 top-[calc(env(safe-area-inset-top)+5.75rem)] bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] z-40 pointer-events-none"
        >
          <div className="flex h-full w-80 flex-col gap-4">
            {atoms.length > 0 && (
              <div className="pointer-events-auto shrink-0">
                <StabilityDisplay />
              </div>
            )}

            <MoleculeInspector
              isDesktopViewport={true}
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
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 w-full mt-auto">
        {!isDesktopViewport && (
          <MoleculeInspector
            isDesktopViewport={false}
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
        )}

        {/* Mobile FAB */}
        <div className="md:hidden w-full flex justify-center pointer-events-auto pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button
            data-testid="open-elements-drawer"
            onClick={() => setIsDrawerOpen(true)}
            className="lab-fab min-h-[48px] text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95 touch-manipulation"
          >
            <Plus size={20} /> {messages.ui.addElement}
          </button>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="lab-drawer-overlay md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Elements Drawer */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 border-t shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'} rounded-t-3xl z-50 ${softPanelClass}`}
      >
        <div className="lab-mobile-drawer p-5">
          <div className={`mx-auto mb-4 h-1.5 w-12 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'}`} />
          <div className="flex justify-between items-center mb-6">
            <h2 className={`info-display font-bold text-lg ${primaryTextClass}`}>{messages.ui.selectElement}</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              aria-label={messages.ui.close}
              className={`min-h-[44px] min-w-[44px] p-2 rounded-full transition-colors touch-manipulation ${ghostButtonClass}`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="lab-mobile-scroll grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[42dvh] overflow-y-auto pr-1 stealth-scrollbar">
            {ELEMENT_DISPLAY_ORDER.map(el => {
              const data = ELEMENTS[el];
              return (
                <button
                  key={el}
                  data-testid={`mobile-element-button-${el}`}
                  onClick={() => { addAtom(el); setIsDrawerOpen(false); }}
                  className={`lab-tile flex min-h-[96px] flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-colors border touch-manipulation ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}
                >
                  <div
                    className="w-11 h-11 rounded-full shadow-inner flex items-center justify-center text-base font-bold"
                    style={{ backgroundColor: data.color, color: el === 'H' ? 'black' : 'white' }}
                  >
                    {data.symbol}
                  </div>
                  <div className={`font-medium text-[11px] leading-tight ${primaryTextClass}`}>{messages.elements[el]}</div>
                </button>
              );
            })}
          </div>

          <div className={`mt-5 pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
            <button
              data-testid="clear-elements-mobile"
              onClick={() => { clear(); setIsDrawerOpen(false); }}
              className={`w-full min-h-[48px] flex items-center justify-center gap-2 p-3 rounded-xl transition-colors text-sm font-bold touch-manipulation ${dangerButtonClass}`}
            >
              <Trash2 size={18} /> {messages.ui.clearAll}
            </button>
          </div>
        </div>
      </div>

      {!isDesktopViewport && (
        <div className="md:hidden fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex items-end justify-between px-4 pointer-events-none">
          <div className="min-w-14 pointer-events-auto flex justify-start">
            {isDrawerLayout && (
              <div className={sceneExploreHighlightClass}>
                <MobileChallengeTrigger
                  messages={messages}
                  isDark={isDark}
                  isOpen={challengeActive && isMobileChallengeOpen}
                  onToggle={challengeActive
                    ? () => setIsMobileChallengeOpen((isOpen) => !isOpen)
                    : handleStartChallenge}
                  timerArc={mobileChallengeTimerArc}
                />
              </div>
            )}
          </div>

          <button
            data-testid="interaction-mode-toggle-mobile"
            onClick={() => setInteractionMode(toggleInteractionMode(interactionMode))}
            aria-label={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
            title={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
            className={`w-14 h-14 rounded-full shadow-xl pointer-events-auto transition-colors flex items-center justify-center touch-manipulation ${interactionBubbleClass} ${sceneExploreHighlightClass}`}
          >
            {interactionMode === 'build' ? <Atom size={22} /> : <Trash2 size={20} />}
          </button>
        </div>
      )}

      {isDesktopViewport && (
        <button
          data-testid="interaction-mode-toggle-desktop"
          onClick={() => setInteractionMode(toggleInteractionMode(interactionMode))}
          aria-label={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
          title={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
          className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-6 z-50 w-14 h-14 rounded-full shadow-xl pointer-events-auto transition-colors flex items-center justify-center touch-manipulation ${interactionBubbleClass} ${sceneExploreHighlightClass}`}
        >
          {interactionMode === 'build' ? <Atom size={22} /> : <Trash2 size={20} />}
        </button>
      )}
    </div>
  );
}
