import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Trophy,
  AlertCircle,
  Timer,
  Target,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../store';
import { KNOWN_MOLECULES, identifyMolecule } from '../identifier';
import { getMessages, localizeMoleculeName, type Language } from '../i18n';
import {
  getChallengeTimerArc,
  getProgressColorClass,
  shouldUseMobileChallengeDrawer,
} from '../challengeLayout';

type Messages = ReturnType<typeof getMessages>;

const TIMER_RING_RADIUS = 22;
const TIMER_RING_VIEWBOX = 56;

interface MobileChallengeTriggerProps {
  messages: Messages;
  isDark: boolean;
  isOpen: boolean;
  onToggle: () => void;
  timerArc: ReturnType<typeof getChallengeTimerArc> | null;
}

function MobileChallengeTrigger({
  messages,
  isDark,
  isOpen,
  onToggle,
  timerArc,
}: MobileChallengeTriggerProps) {
  const buttonToneClass = isDark
    ? 'text-zinc-100 border-white/20 bg-zinc-900/80'
    : 'text-zinc-800 border-zinc-300/90 bg-white/88';
  const ringTrackClass = isDark ? 'text-white/25' : 'text-zinc-500/35';
  const ringActiveClass = timerArc
    ? (timerArc.remainingRatio <= 0.2 ? 'text-red-500' : 'text-indigo-400')
    : (isDark ? 'text-indigo-300' : 'text-indigo-600');

  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? messages.ui.close : messages.challenge.title}
      aria-expanded={isOpen}
      className={`md:hidden fixed left-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[56] relative h-14 w-14 rounded-full border shadow-xl backdrop-blur-md pointer-events-auto transition-transform active:scale-95 touch-manipulation ${buttonToneClass}`}
    >
      <svg
        viewBox={`0 0 ${TIMER_RING_VIEWBOX} ${TIMER_RING_VIEWBOX}`}
        className={`pointer-events-none absolute inset-0 h-full w-full -rotate-90 ${ringActiveClass}`}
        aria-hidden="true"
      >
        <circle
          cx={TIMER_RING_VIEWBOX / 2}
          cy={TIMER_RING_VIEWBOX / 2}
          r={TIMER_RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={ringTrackClass}
        />
        {timerArc && (
          <circle
            cx={TIMER_RING_VIEWBOX / 2}
            cy={TIMER_RING_VIEWBOX / 2}
            r={TIMER_RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              strokeDasharray: timerArc.strokeDasharray,
              strokeDashoffset: timerArc.strokeDashoffset,
            }}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
          />
        )}
      </svg>
      <span className="relative z-10 flex h-full w-full items-center justify-center">
        {timerArc ? <Target size={18} /> : <Trophy size={18} />}
      </span>
    </button>
  );
}

interface ChallengeStartButtonProps {
  messages: Messages;
  onStart: () => void;
}

function ChallengeStartButton({ messages, onStart }: ChallengeStartButtonProps) {
  return (
    <button
      onClick={onStart}
      className="lab-fab lab-reveal group relative min-h-[44px] flex items-center justify-center gap-2 text-white px-5 py-3 rounded-2xl transition-all active:scale-95 w-full pointer-events-auto overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 motion-reduce:translate-y-0 transition-transform duration-300 ease-out" />
      <Zap size={18} className="group-hover:scale-110 transition-transform" />
      <span className="font-bold text-sm relative z-10">{messages.challenge.start}</span>
    </button>
  );
}

interface ActiveChallengePanelProps {
  language: Language;
  messages: Messages;
  onStart: () => void;
  isDrawerLayout: boolean;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (isOpen: boolean) => void;
}

function ActiveChallengePanel({
  language,
  messages,
  onStart,
  isDrawerLayout,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
}: ActiveChallengePanelProps) {
  const challengeTarget = useStore((state) => state.challengeTarget);
  const challengeTimeLeft = useStore((state) => state.challengeTimeLeft);
  const challengeTotalTime = useStore((state) => state.challengeTotalTime);
  const challengeStatus = useStore((state) => state.challengeStatus);
  const tickChallenge = useStore((state) => state.tickChallenge);
  const stopChallenge = useStore((state) => state.stopChallenge);
  const winChallenge = useStore((state) => state.winChallenge);
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const theme = useStore((state) => state.theme);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (challengeStatus !== 'playing') return;
    const interval = setInterval(() => {
      tickChallenge();
    }, 1000);
    return () => clearInterval(interval);
  }, [challengeStatus, tickChallenge]);

  useEffect(() => {
    if (challengeStatus !== 'playing' || !challengeTarget) return;

    const currentMolecule = identifyMolecule(atoms, bonds);
    if (currentMolecule && currentMolecule.name === challengeTarget.name) {
      winChallenge();
    }
  }, [atoms, bonds, challengeStatus, challengeTarget, winChallenge]);

  const progress = challengeTotalTime ? (challengeTimeLeft / challengeTotalTime) * 100 : 0;
  const progressColorClass = getProgressColorClass(progress);
  const timerArc = challengeStatus === 'playing'
    ? getChallengeTimerArc(challengeTimeLeft, challengeTotalTime, TIMER_RING_RADIUS)
    : null;

  const panelClass = 'lab-panel lab-panel-glow';
  const primaryTextClass = isDark ? 'text-white' : 'text-zinc-900';
  const secondaryTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const iconButtonClass = isDark
    ? 'lab-tile text-zinc-300 hover:text-white border'
    : 'lab-tile text-zinc-600 hover:text-zinc-900 border';

  const localizedTargetName = challengeTarget
    ? localizeMoleculeName(language, challengeTarget.name)
    : null;

  if (isDrawerLayout) {
    return (
      <>
        <MobileChallengeTrigger
          messages={messages}
          isDark={isDark}
          isOpen={isMobileDrawerOpen}
          onToggle={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          timerArc={timerArc}
        />

        {isMobileDrawerOpen && (
          <button
            className="md:hidden fixed inset-0 bg-black/45 backdrop-blur-sm pointer-events-auto z-[53]"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label={messages.ui.close}
          />
        )}

        <div
          className={`md:hidden fixed inset-x-0 bottom-0 z-[55] pointer-events-auto transform transition-transform duration-300 ease-in-out ${
            isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className={`rounded-t-3xl border px-5 pt-4 pb-[calc(1.2rem+env(safe-area-inset-bottom))] backdrop-blur-xl ${panelClass}`}>
            {challengeStatus === 'playing' && (
              <div className={`mb-4 h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                <div
                  className={`h-full rounded-full ${progressColorClass} transition-all duration-1000 ease-linear motion-reduce:transition-none`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className={`mx-auto mb-4 h-1.5 w-12 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'}`} />
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="info-display flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest min-w-0">
                <Target size={16} className="shrink-0" />
                <span>{messages.challenge.target}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label={messages.ui.close}
                  className={`h-11 w-11 rounded-full transition-colors inline-flex items-center justify-center touch-manipulation ${iconButtonClass}`}
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={stopChallenge}
                  aria-label={messages.challenge.close}
                  className={`h-11 w-11 rounded-full transition-colors inline-flex items-center justify-center touch-manipulation ${iconButtonClass}`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {challengeStatus === 'playing' && challengeTarget && (
              <div className="flex flex-col items-center text-center">
                <div className={`info-display font-black text-2xl tracking-tight mb-1 ${primaryTextClass}`}>{localizedTargetName}</div>
                <div className="lab-accent-pill font-mono text-lg px-4 py-1 rounded-lg border border-indigo-500/20 mb-5 shadow-inner">
                  {challengeTarget.formula}
                </div>

                <div
                  className={`flex items-center gap-2 text-4xl font-black ${
                    challengeTimeLeft <= 10 ? 'text-red-500 motion-safe:animate-pulse' : primaryTextClass
                  }`}
                >
                  <Timer size={30} className={challengeTimeLeft <= 10 ? 'motion-safe:animate-bounce' : ''} />
                  <span className="tabular-nums">
                    {challengeTimeLeft}
                    {messages.challenge.secondsShort}
                  </span>
                </div>
              </div>
            )}

            {challengeStatus === 'won' && (
              <div className="flex flex-col items-center text-center py-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
                  <Trophy className="w-16 h-16 text-yellow-400 relative z-10 mb-4" />
                </div>
                <div className={`info-display font-black text-2xl mb-1 ${primaryTextClass}`}>{messages.challenge.wonHeadline}</div>
                <div className={`text-sm mb-6 ${secondaryTextClass}`}>
                  {messages.challenge.wonMessagePrefix} <span className={primaryTextClass}>{localizedTargetName}</span>.
                </div>
                {challengeTarget && (
                  <div className="lab-accent-pill inline-flex font-mono text-base px-3 py-1 rounded-lg border border-indigo-500/20 mb-6 shadow-inner">
                    {challengeTarget.formula}
                  </div>
                )}
                <button
                  onClick={onStart}
                  className="lab-fab w-full min-h-[48px] text-white py-3 rounded-xl font-bold transition-all active:scale-95 touch-manipulation"
                >
                  {messages.challenge.next}
                </button>
              </div>
            )}

            {challengeStatus === 'lost' && (
              <div className="flex flex-col items-center text-center py-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                  <AlertCircle className="w-16 h-16 text-red-500 relative z-10 mb-4" />
                </div>
                <div className={`info-display font-black text-2xl mb-1 ${primaryTextClass}`}>{messages.challenge.lostHeadline}</div>
                <div className={`text-sm mb-6 ${secondaryTextClass}`}>
                  {messages.challenge.lostMessagePrefix} <span className={primaryTextClass}>{localizedTargetName}</span>.
                </div>
                {challengeTarget && (
                  <div className="lab-accent-pill inline-flex font-mono text-base px-3 py-1 rounded-lg border border-indigo-500/20 mb-6 shadow-inner">
                    {challengeTarget.formula}
                  </div>
                )}
                <button
                  onClick={onStart}
                  className={`lab-tile w-full min-h-[48px] py-3 rounded-xl font-bold transition-all border active:scale-95 touch-manipulation ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {messages.challenge.retry}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`lab-reveal rounded-3xl border pointer-events-auto z-[45] overflow-hidden flex flex-col w-full p-6 ${panelClass}`}>
      {challengeStatus === 'playing' && (
        <div className={`absolute top-0 left-0 w-full h-1.5 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
          <div
            className={`h-full ${progressColorClass} transition-all duration-1000 ease-linear motion-reduce:transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex justify-between items-start gap-2 mb-6">
        <div className="info-display flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest min-w-0">
          <Target size={16} className="shrink-0" />
          <span>{messages.challenge.target}</span>
        </div>
        <button
          onClick={stopChallenge}
          aria-label={messages.challenge.close}
          className={`h-11 w-11 rounded-full transition-colors inline-flex items-center justify-center touch-manipulation ${iconButtonClass}`}
        >
          <X size={16} />
        </button>
      </div>

      {challengeStatus === 'playing' && challengeTarget && (
        <div className="flex flex-col items-center text-center">
          <div className={`info-display font-black text-2xl md:text-3xl tracking-tight mb-1 ${primaryTextClass}`}>{localizedTargetName}</div>
          <div className="lab-accent-pill font-mono text-lg md:text-xl px-4 py-1 rounded-lg border border-indigo-500/20 mb-6 shadow-inner">
            {challengeTarget.formula}
          </div>

          <div
            className={`flex items-center gap-2 text-3xl md:text-4xl font-black ${
              challengeTimeLeft <= 10 ? 'text-red-500 motion-safe:animate-pulse' : primaryTextClass
            }`}
          >
            <Timer size={28} className={challengeTimeLeft <= 10 ? 'motion-safe:animate-bounce' : ''} />
            <span className="tabular-nums">
              {challengeTimeLeft}
              {messages.challenge.secondsShort}
            </span>
          </div>
        </div>
      )}

      {challengeStatus === 'won' && (
        <div className="flex flex-col items-center text-center py-2">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
            <Trophy className="w-16 h-16 text-yellow-400 relative z-10 mb-4" />
          </div>
          <div className={`info-display font-black text-2xl mb-1 ${primaryTextClass}`}>{messages.challenge.wonHeadline}</div>
          <div className={`text-sm mb-6 ${secondaryTextClass}`}>
            {messages.challenge.wonMessagePrefix} <span className={primaryTextClass}>{localizedTargetName}</span>.
          </div>
          {challengeTarget && (
            <div className="lab-accent-pill inline-flex font-mono text-base px-3 py-1 rounded-lg border border-indigo-500/20 mb-6 shadow-inner">
              {challengeTarget.formula}
            </div>
          )}
          <button
            onClick={onStart}
            className="lab-fab w-full min-h-[48px] text-white py-3 rounded-xl font-bold transition-all active:scale-95 touch-manipulation"
          >
            {messages.challenge.next}
          </button>
        </div>
      )}

      {challengeStatus === 'lost' && (
        <div className="flex flex-col items-center text-center py-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
            <AlertCircle className="w-16 h-16 text-red-500 relative z-10 mb-4" />
          </div>
          <div className={`info-display font-black text-2xl mb-1 ${primaryTextClass}`}>{messages.challenge.lostHeadline}</div>
          <div className={`text-sm mb-6 ${secondaryTextClass}`}>
            {messages.challenge.lostMessagePrefix} <span className={primaryTextClass}>{localizedTargetName}</span>.
          </div>
          {challengeTarget && (
            <div className="lab-accent-pill inline-flex font-mono text-base px-3 py-1 rounded-lg border border-indigo-500/20 mb-6 shadow-inner">
              {challengeTarget.formula}
            </div>
          )}
          <button
            onClick={onStart}
            className={`lab-tile w-full min-h-[48px] py-3 rounded-xl font-bold transition-all border active:scale-95 touch-manipulation ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {messages.challenge.retry}
          </button>
        </div>
      )}
    </div>
  );
}

export function ChallengeMode() {
  const challengeActive = useStore((state) => state.challengeActive);
  const challengeStatus = useStore((state) => state.challengeStatus);
  const startChallenge = useStore((state) => state.startChallenge);
  const language = useStore((state) => state.language);
  const theme = useStore((state) => state.theme);

  const messages = useMemo(() => getMessages(language), [language]);
  const isDark = theme === 'dark';
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const narrowMedia = window.matchMedia('(max-width: 1023px)');
    const coarseMedia = window.matchMedia('(hover: none), (pointer: coarse)');
    const updateLayout = () => {
      setIsNarrowViewport(narrowMedia.matches);
      setIsCoarsePointer(coarseMedia.matches);
      setHasTouchInput(('ontouchstart' in window) || ((window.navigator?.maxTouchPoints ?? 0) > 0));
    };
    updateLayout();
    narrowMedia.addEventListener('change', updateLayout);
    coarseMedia.addEventListener('change', updateLayout);
    return () => {
      narrowMedia.removeEventListener('change', updateLayout);
      coarseMedia.removeEventListener('change', updateLayout);
    };
  }, []);

  const isDrawerLayout = shouldUseMobileChallengeDrawer(isNarrowViewport, isCoarsePointer, hasTouchInput);

  useEffect(() => {
    if (!isDrawerLayout) {
      setIsMobileDrawerOpen(false);
      return;
    }
    if (challengeActive) {
      setIsMobileDrawerOpen(true);
    }
  }, [isDrawerLayout, challengeActive]);

  useEffect(() => {
    if (!isDrawerLayout || !challengeActive) return;
    if (challengeStatus !== 'playing') {
      setIsMobileDrawerOpen(true);
    }
  }, [isDrawerLayout, challengeActive, challengeStatus]);

  const handleStart = () => {
    const randomMol = KNOWN_MOLECULES[Math.floor(Math.random() * KNOWN_MOLECULES.length)];
    const timeLimit = 30 + randomMol.atomCount * 5;
    startChallenge({ name: randomMol.name, formula: randomMol.formula }, timeLimit);
    if (isDrawerLayout) {
      setIsMobileDrawerOpen(true);
    }
  };

  if (!challengeActive) {
    if (isDrawerLayout) {
      return (
        <MobileChallengeTrigger
          messages={messages}
          isDark={isDark}
          isOpen={false}
          onToggle={handleStart}
          timerArc={null}
        />
      );
    }

    return <ChallengeStartButton messages={messages} onStart={handleStart} />;
  }

  return (
    <ActiveChallengePanel
      language={language}
      messages={messages}
      onStart={handleStart}
      isDrawerLayout={isDrawerLayout}
      isMobileDrawerOpen={isMobileDrawerOpen}
      setIsMobileDrawerOpen={setIsMobileDrawerOpen}
    />
  );
}
