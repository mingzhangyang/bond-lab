import React, { useMemo, useState } from 'react';
import { useStore, ELEMENTS, ElementType } from '../store';
import { identifyMolecule } from '../identifier';
import { calculateMolecularPolarity } from '../polarity';
import { atomPositions } from '../physics';
import { getMoleculeInfo } from '../moleculeInfo';
import {
  Trash2,
  X,
  Plus,
  Sun,
  Globe,
  Moon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { StabilityDisplay } from './StabilityDisplay';
import { ChallengeMode } from './ChallengeMode';
import { getMessages, localizeMoleculeName } from '../i18n';

export function UI() {
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const addAtom = useStore((state) => state.addAtom);
  const clear = useStore((state) => state.clear);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const language = useStore((state) => state.language);
  const cycleLanguage = useStore((state) => state.cycleLanguage);
  const interactionMode = useStore((state) => state.interactionMode);
  const setInteractionMode = useStore((state) => state.setInteractionMode);
  const controlsCollapsed = useStore((state) => state.controlsCollapsed);
  const toggleControlsCollapsed = useStore((state) => state.toggleControlsCollapsed);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const panelClass = isDark
    ? 'bg-zinc-900/80 border-white/10 shadow-2xl'
    : 'bg-white/90 border-zinc-200 shadow-xl shadow-zinc-300/50';
  const primaryTextClass = isDark ? 'text-white' : 'text-zinc-900';
  const secondaryTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const headingTextClass = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const ghostButtonClass = isDark
    ? 'text-zinc-400 hover:text-white hover:bg-white/10'
    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100';
  const activeModeClass = isDark
    ? 'bg-indigo-500 text-white'
    : 'bg-indigo-100 text-indigo-700';
  const inactiveModeClass = isDark
    ? 'bg-white/5 text-zinc-300 hover:bg-white/10'
    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200';
  const dangerButtonClass = isDark
    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
    : 'bg-red-100 hover:bg-red-200 text-red-700';

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 overflow-hidden ${primaryTextClass}`}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start w-full gap-4">
        {/* Top Left */}
        <div className="flex flex-col gap-4 w-full md:w-64">
          
          {/* Logo & Settings */}
          <div
            className={`flex items-center justify-between backdrop-blur-md p-3 md:p-4 rounded-2xl border pointer-events-auto w-full ${panelClass}`}
          >
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="10" cy="22" r="6" fill="#6366f1" />
                <circle cx="22" cy="10" r="8" fill="#a855f7" />
                <path d="M12 18L18 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16 22L22 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className={`font-black text-xl tracking-tight hidden sm:inline ${primaryTextClass}`}>
                Bond<span className="text-indigo-400">Lab</span>
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                className={`min-h-[44px] min-w-[44px] p-2 rounded-xl transition-colors flex items-center justify-center ${ghostButtonClass}`}
                aria-label={messages.ui.themeToggle}
                onClick={toggleTheme}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button 
                className={`min-h-[44px] px-2 rounded-xl transition-colors flex items-center gap-1 ${ghostButtonClass}`}
                aria-label={messages.ui.languageToggle}
                onClick={cycleLanguage}
              >
                <Globe size={18} />
                <span className="text-xs font-bold hidden sm:inline">{language.toUpperCase()}</span>
                <span className="text-xs font-bold sm:hidden">{language.toUpperCase()}</span>
              </button>
            </div>
          </div>

          <div
            className={`backdrop-blur-md p-3 rounded-2xl border pointer-events-auto ${panelClass}`}
          >
            <h2 className={`font-bold text-xs mb-3 tracking-wider uppercase ${headingTextClass}`}>
              {messages.ui.interactionMode}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInteractionMode('build')}
                aria-pressed={interactionMode === 'build'}
                className={`min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                  interactionMode === 'build' ? activeModeClass : inactiveModeClass
                }`}
              >
                {messages.ui.buildMode}
              </button>
              <button
                onClick={() => setInteractionMode('delete')}
                aria-pressed={interactionMode === 'delete'}
                className={`min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                  interactionMode === 'delete' ? activeModeClass : inactiveModeClass
                }`}
              >
                {messages.ui.deleteMode}
              </button>
            </div>
            <p className={`mt-3 text-xs ${secondaryTextClass}`}>{messages.ui.removeHint}</p>
          </div>

          {/* Desktop Elements Panel */}
          <div className={`hidden md:flex flex-col backdrop-blur-md p-4 rounded-2xl border pointer-events-auto ${panelClass}`}>
            <h1 className={`font-bold text-sm mb-4 tracking-wider uppercase ${headingTextClass}`}>{messages.ui.elements}</h1>
            <div className="flex flex-col gap-3">
              {(Object.keys(ELEMENTS) as ElementType[]).map(el => {
                const data = ELEMENTS[el];
                return (
                  <button
                    key={el}
                    onClick={() => addAtom(el)}
                    className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${inactiveModeClass}`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: data.color, color: el === 'H' ? 'black' : 'white' }}
                    >
                      {data.symbol}
                    </div>
                    <div className="text-left">
                      <div className={`font-medium text-sm ${primaryTextClass}`}>{messages.elements[el]}</div>
                      <div className={`text-xs ${secondaryTextClass}`}>{messages.ui.valence}: {data.valence}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className={`mt-6 pt-4 border-t flex gap-2 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
              <button 
                onClick={clear}
                className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 p-2 rounded-xl transition-colors text-sm font-medium ${dangerButtonClass}`}
              >
                <Trash2 size={16} /> {messages.ui.clear}
              </button>
            </div>
          </div>

          <div className="pointer-events-auto">
            <StabilityDisplay />
          </div>
        </div>

        {/* Top Right */}
        <div className="flex flex-col gap-4 items-end">
          <div className={`hidden md:block backdrop-blur-md p-4 rounded-2xl border w-64 pointer-events-auto ${panelClass}`}>
            <div className="flex items-center justify-between mb-2">
              <h2 className={`font-bold text-sm uppercase tracking-wider ${headingTextClass}`}>{messages.ui.controls}</h2>
              <button
                onClick={toggleControlsCollapsed}
                aria-label={controlsCollapsed ? messages.ui.expand : messages.ui.collapse}
                className={`min-h-[36px] min-w-[36px] rounded-lg transition-colors flex items-center justify-center ${ghostButtonClass}`}
              >
                {controlsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
            {!controlsCollapsed && (
              <ul className={`text-sm space-y-2 ${secondaryTextClass}`}>
                {messages.ui.controlsList.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            )}
          </div>
          <ChallengeMode />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 w-full mt-auto">
        {molecule && (
          <div className={`backdrop-blur-xl px-6 py-3 md:px-8 md:py-4 rounded-3xl border pointer-events-auto transform transition-all ${panelClass}`}>
            <div className="text-center">
              <div className={`text-[10px] md:text-xs uppercase tracking-widest mb-1 font-semibold ${headingTextClass}`}>
                {messages.ui.currentMolecule}
              </div>
              <div className={`font-bold text-xl md:text-3xl tracking-tight ${primaryTextClass}`}>{moleculeName}</div>
              <div className="text-emerald-400 font-mono text-lg md:text-xl mt-1">{molecule.formula}</div>
              {moleculeInfo && (
                <>
                  <div className={`mt-2 text-[10px] md:text-xs uppercase tracking-widest font-semibold ${headingTextClass}`}>
                    {structureTitle}
                  </div>
                  <div className={`font-mono text-sm md:text-base ${primaryTextClass}`}>{moleculeInfo.structure}</div>
                  <div className={`mt-2 text-[10px] md:text-xs uppercase tracking-widest font-semibold ${headingTextClass}`}>
                    {factTitle}
                  </div>
                  <div className={`text-xs md:text-sm max-w-xl ${secondaryTextClass}`}>{moleculeInfo.fact}</div>
                </>
              )}
              <div className={`mt-3 text-[10px] md:text-xs uppercase tracking-widest font-semibold ${headingTextClass}`}>
                {polarityTitle}
              </div>
              <div className={`font-semibold ${polarityReport.classification === 'polar' ? 'text-amber-400' : (polarityReport.classification === 'nonpolar' ? 'text-cyan-400' : secondaryTextClass)}`}>
                {polarityLabel}
              </div>
              <div className={`text-[11px] md:text-xs max-w-xl mt-1 ${secondaryTextClass}`}>{polarityReport.reason}</div>
            </div>
          </div>
        )}

        <div className={`md:hidden w-full max-w-md backdrop-blur-md p-3 rounded-2xl border pointer-events-auto ${panelClass}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`font-bold text-xs tracking-wider uppercase ${headingTextClass}`}>{messages.ui.mobileTipsTitle}</h2>
            <button
              onClick={toggleControlsCollapsed}
              aria-label={controlsCollapsed ? messages.ui.expand : messages.ui.collapse}
              className={`min-h-[36px] min-w-[36px] rounded-lg transition-colors flex items-center justify-center ${ghostButtonClass}`}
            >
              {controlsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>
          {!controlsCollapsed && (
            <ul className={`text-xs space-y-1 ${secondaryTextClass}`}>
              {messages.ui.controlsList.slice(0, 6).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile FAB */}
        <div className="md:hidden w-full flex justify-center pointer-events-auto pb-4">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="min-h-[44px] bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus size={20} /> {messages.ui.addElement}
          </button>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Elements Drawer */}
      <div 
        className={`md:hidden fixed inset-x-0 bottom-0 backdrop-blur-xl border-t shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'} rounded-t-3xl z-50 ${
          isDark ? 'bg-zinc-900/95 border-white/10' : 'bg-white/95 border-zinc-200'
        }`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`font-bold text-lg ${primaryTextClass}`}>{messages.ui.selectElement}</h2>
            <button 
              onClick={() => setIsDrawerOpen(false)} 
              aria-label={messages.ui.close}
              className={`min-h-[44px] min-w-[44px] p-2 rounded-full transition-colors ${ghostButtonClass}`}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {(Object.keys(ELEMENTS) as ElementType[]).map(el => {
              const data = ELEMENTS[el];
              return (
                <button
                  key={el}
                  onClick={() => { addAtom(el); setIsDrawerOpen(false); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors ${
                    isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-zinc-100 hover:bg-zinc-200'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-full shadow-inner flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: data.color, color: el === 'H' ? 'black' : 'white' }}
                  >
                    {data.symbol}
                  </div>
                  <div className={`font-medium text-xs ${primaryTextClass}`}>{messages.elements[el]}</div>
                </button>
              );
            })}
          </div>
          
          <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
            <button 
              onClick={() => { clear(); setIsDrawerOpen(false); }}
              className={`w-full min-h-[44px] flex items-center justify-center gap-2 p-3 rounded-xl transition-colors text-sm font-bold ${dangerButtonClass}`}
            >
              <Trash2 size={18} /> {messages.ui.clearAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
