import React, { useEffect } from 'react';
import { useStore } from '../store';
import { KNOWN_MOLECULES, identifyMolecule } from '../identifier';
import { X, Trophy, AlertCircle, Timer, Target, Zap } from 'lucide-react';

export function ChallengeMode() {
  const { 
    challengeActive, challengeTarget, challengeTimeLeft, challengeTotalTime, challengeStatus,
    startChallenge, tickChallenge, stopChallenge, winChallenge,
    atoms, bonds
  } = useStore();

  // Timer
  useEffect(() => {
    if (!challengeActive || challengeStatus !== 'playing') return;
    const interval = setInterval(() => {
      tickChallenge();
    }, 1000);
    return () => clearInterval(interval);
  }, [challengeActive, challengeStatus, tickChallenge]);

  // Check win condition
  useEffect(() => {
    if (!challengeActive || challengeStatus !== 'playing' || !challengeTarget) return;
    
    const currentMolecule = identifyMolecule(atoms, bonds);
    if (currentMolecule && currentMolecule.name === challengeTarget.name) {
      winChallenge();
    }
  }, [atoms, bonds, challengeActive, challengeStatus, challengeTarget, winChallenge]);

  const handleStart = () => {
    const randomMol = KNOWN_MOLECULES[Math.floor(Math.random() * KNOWN_MOLECULES.length)];
    // Give more time for complex molecules
    const timeLimit = 30 + (randomMol.c + randomMol.h + randomMol.n + randomMol.o) * 5;
    startChallenge({ name: randomMol.name, formula: randomMol.formula }, timeLimit);
  };

  if (!challengeActive) {
    return (
      <button 
        onClick={handleStart}
        className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 w-full md:w-auto pointer-events-auto overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <Zap size={18} className="group-hover:scale-110 transition-transform" />
        <span className="font-bold text-sm relative z-10">Challenge</span>
      </button>
    );
  }

  const progress = challengeTotalTime ? (challengeTimeLeft / challengeTotalTime) * 100 : 0;
  let progressColor = 'bg-emerald-500';
  if (progress < 50) progressColor = 'bg-yellow-500';
  if (progress < 20) progressColor = 'bg-red-500';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:static md:translate-x-0 w-[calc(100%-2rem)] md:w-72 bg-zinc-900/95 backdrop-blur-xl p-6 rounded-3xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 pointer-events-auto z-40 overflow-hidden flex flex-col">
      
      {/* Progress bar background */}
      {challengeStatus === 'playing' && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-800">
          <div 
            className={`h-full ${progressColor} transition-all duration-1000 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
          <Target size={16} />
          <span>Target</span>
        </div>
        <button onClick={stopChallenge} className="text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full">
          <X size={16} />
        </button>
      </div>

      {challengeStatus === 'playing' && challengeTarget && (
        <div className="flex flex-col items-center text-center">
          <div className="text-white font-black text-3xl tracking-tight mb-1">{challengeTarget.name}</div>
          <div className="text-indigo-300 font-mono text-xl bg-indigo-500/10 px-4 py-1 rounded-lg border border-indigo-500/20 mb-6 shadow-inner">
            {challengeTarget.formula}
          </div>
          
          <div className={`flex items-center gap-2 text-4xl font-black ${challengeTimeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            <Timer size={32} className={challengeTimeLeft <= 10 ? 'animate-bounce' : ''} />
            <span className="tabular-nums">{challengeTimeLeft}s</span>
          </div>
        </div>
      )}

      {challengeStatus === 'won' && (
        <div className="flex flex-col items-center text-center py-2">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
            <Trophy className="w-16 h-16 text-yellow-400 relative z-10 mb-4" />
          </div>
          <div className="text-white font-black text-2xl mb-1">Brilliant!</div>
          <div className="text-zinc-400 text-sm mb-6">You successfully built <span className="text-white font-bold">{challengeTarget?.name}</span>.</div>
          <button 
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            Next Challenge
          </button>
        </div>
      )}

      {challengeStatus === 'lost' && (
        <div className="flex flex-col items-center text-center py-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
            <AlertCircle className="w-16 h-16 text-red-500 relative z-10 mb-4" />
          </div>
          <div className="text-white font-black text-2xl mb-1">Time's Up!</div>
          <div className="text-zinc-400 text-sm mb-6">The molecule was <span className="text-white font-bold">{challengeTarget?.name}</span>.</div>
          <button 
            onClick={handleStart}
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
