import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Trophy,
  AlertCircle,
  Timer,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '../store';
import { KNOWN_MOLECULES, identifyMolecule } from '../identifier';
import { getMessages, localizeMoleculeName, type Language } from '../i18n';
import { getProgressColorClass, shouldExpandMobileChallenge } from '../challengeLayout';

type Messages = ReturnType<typeof getMessages>;

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
}

function ActiveChallengePanel({ language, messages, onStart }: ActiveChallengePanelProps) {
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
  const [isMobileExpanded, setIsMobileExpanded] = useState(() => shouldExpandMobileChallenge(challengeStatus));

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

  useEffect(() => {
    setIsMobileExpanded(shouldExpandMobileChallenge(challengeStatus));
  }, [challengeStatus, challengeTarget?.name]);

  const progress = challengeTotalTime ? (challengeTimeLeft / challengeTotalTime) * 100 : 0;
  const progressColorClass = getProgressColorClass(progress);

  const panelClass = 'lab-panel lab-panel-glow';
  const primaryTextClass = isDark ? 'text-white' : 'text-zinc-900';
  const secondaryTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const iconButtonClass = isDark
    ? 'lab-tile text-zinc-300 hover:text-white border'
    : 'lab-tile text-zinc-600 hover:text-zinc-900 border';
  const localizedTargetName = challengeTarget
    ? localizeMoleculeName(language, challengeTarget.name)
    : null;
  const isCompactMobile = challengeStatus === 'playing' && !isMobileExpanded;
  const toggleLabel = isMobileExpanded ? 'Collapse challenge details' : 'Expand challenge details';

  return (
    <div
      className={`lab-reveal fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:static md:inset-auto md:bottom-auto w-auto md:w-full p-4 md:p-6 rounded-3xl border pointer-events-auto z-[45] overflow-hidden flex flex-col ${panelClass}`}
    >
      {challengeStatus === 'playing' && (
        <div className={`absolute top-0 left-0 w-full h-1.5 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
          <div
            className={`h-full ${progressColorClass} transition-all duration-1000 ease-linear motion-reduce:transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className={`flex justify-between items-start gap-2 ${isCompactMobile ? 'mb-3' : 'mb-6'}`}>
        <div className="info-display flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest min-w-0">
          <Target size={16} className="shrink-0" />
          <span>{messages.challenge.target}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {challengeStatus === 'playing' && isCompactMobile && (
            <div
              className={`lab-accent-pill font-mono text-sm px-3 py-1 rounded-full border border-indigo-500/20 ${
                challengeTimeLeft <= 10 ? 'text-red-500' : ''
              }`}
            >
              {challengeTimeLeft}
              {messages.challenge.secondsShort}
            </div>
          )}
          {challengeStatus === 'playing' && (
            <button
              onClick={() => setIsMobileExpanded((expanded) => !expanded)}
              aria-label={toggleLabel}
              title={toggleLabel}
              className={`md:hidden h-11 w-11 rounded-full transition-colors inline-flex items-center justify-center touch-manipulation ${iconButtonClass}`}
            >
              {isMobileExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          )}
          <button
            onClick={stopChallenge}
            aria-label={messages.challenge.close}
            className={`h-11 w-11 rounded-full transition-colors inline-flex items-center justify-center touch-manipulation ${iconButtonClass}`}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {isCompactMobile && challengeTarget && (
        <div className="md:hidden">
          <div className={`info-display font-black text-lg tracking-tight truncate ${primaryTextClass}`}>{localizedTargetName}</div>
          <div className="lab-accent-pill inline-flex font-mono text-base px-3 py-1 rounded-lg border border-indigo-500/20 mt-1 shadow-inner">
            {challengeTarget.formula}
          </div>
        </div>
      )}

      {challengeStatus === 'playing' && challengeTarget && !isCompactMobile && (
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
  const startChallenge = useStore((state) => state.startChallenge);
  const language = useStore((state) => state.language);
  const messages = useMemo(() => getMessages(language), [language]);

  const handleStart = () => {
    const randomMol = KNOWN_MOLECULES[Math.floor(Math.random() * KNOWN_MOLECULES.length)];
    const timeLimit = 30 + randomMol.atomCount * 5;
    startChallenge({ name: randomMol.name, formula: randomMol.formula }, timeLimit);
  };

  if (!challengeActive) {
    return <ChallengeStartButton messages={messages} onStart={handleStart} />;
  }

  return <ActiveChallengePanel language={language} messages={messages} onStart={handleStart} />;
}
