import React, { useEffect, useMemo, useState } from 'react';
import { useStore, ELEMENTS, ELEMENT_DISPLAY_ORDER } from '../store';
import { identifyMolecule, KNOWN_MOLECULES } from '../identifier';
import { calculateMolecularPolarity } from '../polarity';
import { atomPositions } from '../physics';
import { getMoleculeInfo } from '../moleculeInfo';
import {
  Atom,
  BookOpenText,
  Check,
  Trash2,
  X,
  Plus,
  Sun,
  Globe,
  Moon,
  Shield,
  Menu,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  Zap,
  Info,
} from 'lucide-react';
import { StabilityDisplay } from './StabilityDisplay';
import {
  ChallengeMode,
  MobileChallengeTrigger,
  MOBILE_CHALLENGE_TRIGGER_RADIUS,
} from './ChallengeMode';
import { getMessages, localizeMoleculeName, type Language } from '../i18n';
import { getPathForRoute } from '../routes';
import { toggleInteractionMode } from '../preferences';
import { getLabThemeVars } from '../theme';
import {
  getChallengeTimerArc,
  shouldUseMobileChallengeDrawer,
} from '../challengeLayout';

const LANGUAGE_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Espanol' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Francais' },
  { code: 'ja', label: '日本語' },
];

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
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isLanguageSubmenuOpen, setIsLanguageSubmenuOpen] = useState(false);
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

  const messages = useMemo(() => getMessages(language), [language]);
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
    [atoms, bonds],
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

  const handleStartChallenge = () => {
    const randomMol = KNOWN_MOLECULES[Math.floor(Math.random() * KNOWN_MOLECULES.length)];
    const timeLimit = 30 + randomMol.atomCount * 5;
    startChallenge({ name: randomMol.name, formula: randomMol.formula }, timeLimit);
    if (isDrawerLayout) {
      setIsMobileChallengeOpen(true);
    }
  };

  return (
    <div
      className={`lab-ui-root absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 overflow-hidden ${primaryTextClass}`}
      style={themeVars}
    >
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
                src="/bondlab-logo.svg"
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

          <div className="pointer-events-auto">
            <StabilityDisplay />
          </div>
        </div>
      </div>

      {/* Top Right Menu */}
      <div
        className="lab-reveal fixed right-4 top-4 md:right-6 md:top-6 z-[70] pointer-events-auto"
        style={{ animationDelay: '60ms' }}
      >
        <div className="relative">
          <button
            className={`min-h-[44px] min-w-[44px] p-2 rounded-xl transition-colors flex items-center justify-center ${softPanelClass} ${ghostButtonClass}`}
            aria-label={messages.ui.menu}
            aria-expanded={isSettingsMenuOpen}
            aria-haspopup="menu"
            onClick={() => {
              setIsSettingsMenuOpen((open) => {
                const nextOpen = !open;
                if (!nextOpen) {
                  setIsLanguageSubmenuOpen(false);
                }
                return nextOpen;
              });
            }}
          >
            <Menu size={18} />
          </button>
          {isSettingsMenuOpen && (
            <>
              <button
                className="fixed inset-0 z-50 cursor-default"
                aria-label={messages.ui.close}
                onClick={() => {
                  setIsSettingsMenuOpen(false);
                  setIsLanguageSubmenuOpen(false);
                }}
              />
              <div
                className={`absolute right-0 top-full mt-2 w-52 rounded-xl p-2 shadow-xl z-[60] sm:w-56 ${softPanelClass}`}
                role="menu"
              >
                <button
                  className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${settingsItemClass}`}
                  role="menuitem"
                  onClick={() => {
                    toggleTheme();
                    setIsSettingsMenuOpen(false);
                    setIsLanguageSubmenuOpen(false);
                  }}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{themeActionText}</span>
                </button>
                <button
                  className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${settingsItemClass}`}
                  role="menuitem"
                  onClick={() => {
                    setIsLanguageSubmenuOpen((open) => !open);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={isLanguageSubmenuOpen}
                >
                  <span className="flex items-center gap-2">
                    <Globe size={16} />
                    {messages.ui.languageToggle}
                  </span>
                  <span className="flex items-center text-xs font-bold">
                    <ChevronRight size={14} className={isLanguageSubmenuOpen ? 'rotate-90 transition-transform' : 'transition-transform'} />
                  </span>
                </button>
                {isLanguageSubmenuOpen && (
                  <div
                    className={`mt-1 mb-2 ml-2 rounded-lg border p-1 ${isDark ? 'border-white/10 bg-black/10' : 'border-zinc-200 bg-white/70'
                      }`}
                    role="menu"
                    aria-label={messages.ui.languageToggle}
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <button
                        key={option.code}
                        className={`w-full min-h-[36px] px-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${option.code === language
                            ? (isDark ? 'bg-indigo-500/25 text-indigo-100' : 'bg-indigo-100 text-indigo-700')
                            : settingsItemClass
                          }`}
                        role="menuitemradio"
                        aria-checked={option.code === language}
                        onClick={() => {
                          setLanguage(option.code);
                          setIsSettingsMenuOpen(false);
                          setIsLanguageSubmenuOpen(false);
                        }}
                      >
                        <span>{option.label}</span>
                        {option.code === language && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
                <a
                  href={getPathForRoute('instructions')}
                  className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${settingsItemClass}`}
                  role="menuitem"
                  onClick={() => {
                    setIsSettingsMenuOpen(false);
                    setIsLanguageSubmenuOpen(false);
                  }}
                >
                  <BookOpenText size={16} />
                  <span>{messages.ui.instructions}</span>
                </a>
                <a
                  href={getPathForRoute('privacy')}
                  className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${settingsItemClass}`}
                  role="menuitem"
                  onClick={() => {
                    setIsSettingsMenuOpen(false);
                    setIsLanguageSubmenuOpen(false);
                  }}
                >
                  <Shield size={16} />
                  <span>{messages.ui.privacy}</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Left Rail */}
      <div className="hidden md:flex fixed left-0 top-[calc(env(safe-area-inset-top)+5.75rem)] bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] z-40 pointer-events-none">
        <div className="relative flex h-full flex-col gap-4">
          <div className="relative flex-1 min-h-0 w-80">
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
            <div className="pointer-events-auto w-80">
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
      {isDesktopViewport && molecule && (
        <div
          className="hidden md:flex fixed right-6 top-[calc(env(safe-area-inset-top)+5.75rem)] max-h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-7.25rem)] z-40 pointer-events-none"
        >
          <div
            className={`lab-reveal w-80 rounded-2xl p-6 pointer-events-auto flex flex-col gap-6 overflow-y-auto stealth-scrollbar ${panelClass}`}
            style={{ animationDelay: '130ms' }}
          >
            <div>
              <div className={`info-display text-[10px] uppercase tracking-widest mb-2 font-bold ${headingTextClass}`}>
                {messages.ui.currentMolecule}
              </div>
              <h2 className={`info-display font-black text-3xl tracking-tight leading-tight mb-1 ${primaryTextClass}`}>
                {moleculeName}
              </h2>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xl">
                <FlaskConical size={18} />
                <span>{molecule.formula}</span>
              </div>
            </div>

            {moleculeInfo && (
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <div className={`info-display text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 ${headingTextClass}`}>
                    <Atom size={14} className="opacity-70" />
                    {structureTitle}
                  </div>
                  <div className={`font-mono text-sm p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} ${primaryTextClass}`}>
                    {moleculeInfo.structure}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className={`info-display text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 ${headingTextClass}`}>
                    <Info size={14} className="opacity-70" />
                    {factTitle}
                  </div>
                  <div className={`text-sm leading-relaxed ${secondaryTextClass}`}>
                    {moleculeInfo.fact}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
              <div className={`info-display text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 ${headingTextClass}`}>
                <Zap size={14} className="opacity-70" />
                {polarityTitle}
              </div>
              <div>
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide inline-block mb-1 ${polarityReport.classification === 'polar'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                    : (polarityReport.classification === 'nonpolar'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
                      : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/20')
                  }`}>
                  {polarityLabel}
                </span>
                <p className={`text-xs leading-normal mt-1 italic ${secondaryTextClass}`}>
                  {polarityReport.reason}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 w-full mt-auto">
        {!isDesktopViewport && molecule && (
          <div className={`lab-reveal px-6 py-4 rounded-3xl pointer-events-auto transform transition-all ${panelClass}`} style={{ animationDelay: '130ms' }}>
            <div className="text-center max-w-sm">
              <div className={`info-display text-[10px] uppercase tracking-widest mb-1 font-semibold ${headingTextClass}`}>
                {messages.ui.currentMolecule}
              </div>
              <div className={`info-display font-bold text-2xl tracking-tight ${primaryTextClass}`}>{moleculeName}</div>
              <div className="text-emerald-400 font-mono text-lg mt-0.5">{molecule.formula}</div>

              {moleculeInfo && (
                <div className="mt-3 text-left space-y-3">
                  <div className="flex flex-col">
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${headingTextClass}`}>{structureTitle}</span>
                    <span className={`font-mono text-xs ${primaryTextClass}`}>{moleculeInfo.structure}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${headingTextClass}`}>{factTitle}</span>
                    <p className={`text-xs leading-relaxed ${secondaryTextClass}`}>{moleculeInfo.fact}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col items-center">
                <span className={`text-[9px] uppercase tracking-[0.2em] font-bold mb-1 ${headingTextClass}`}>{polarityTitle}</span>
                <span className={`text-sm font-bold ${polarityReport.classification === 'polar' ? 'text-amber-400' : (polarityReport.classification === 'nonpolar' ? 'text-cyan-400' : secondaryTextClass)}`}>
                  {polarityLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile FAB */}
        <div className="md:hidden w-full flex justify-center pointer-events-auto pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button
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
              <MobileChallengeTrigger
                messages={messages}
                isDark={isDark}
                isOpen={challengeActive && isMobileChallengeOpen}
                onToggle={challengeActive
                  ? () => setIsMobileChallengeOpen((isOpen) => !isOpen)
                  : handleStartChallenge}
                timerArc={mobileChallengeTimerArc}
              />
            )}
          </div>

          <button
            onClick={() => setInteractionMode(toggleInteractionMode(interactionMode))}
            aria-label={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
            title={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
            className={`w-14 h-14 rounded-full shadow-xl pointer-events-auto transition-colors flex items-center justify-center touch-manipulation ${interactionBubbleClass}`}
          >
            {interactionMode === 'build' ? <Atom size={22} /> : <Trash2 size={20} />}
          </button>
        </div>
      )}

      {isDesktopViewport && (
        <button
          onClick={() => setInteractionMode(toggleInteractionMode(interactionMode))}
          aria-label={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
          title={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
          className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-6 z-50 w-14 h-14 rounded-full shadow-xl pointer-events-auto transition-colors flex items-center justify-center touch-manipulation ${interactionBubbleClass}`}
        >
          {interactionMode === 'build' ? <Atom size={22} /> : <Trash2 size={20} />}
        </button>
      )}
    </div>
  );
}
