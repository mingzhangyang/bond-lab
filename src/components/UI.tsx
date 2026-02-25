import React, { useState } from 'react';
import { useStore, ELEMENTS, ElementType } from '../store';
import { identifyMolecule } from '../identifier';
import { Trash2, RefreshCw, X, Plus, Sun, Globe } from 'lucide-react';
import { StabilityDisplay } from './StabilityDisplay';
import { ChallengeMode } from './ChallengeMode';

export function UI() {
  const atoms = useStore(state => state.atoms);
  const bonds = useStore(state => state.bonds);
  const addAtom = useStore(state => state.addAtom);
  const clear = useStore(state => state.clear);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const molecule = identifyMolecule(atoms, bonds);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* Top Section */}
      <div className="flex justify-between items-start w-full gap-4">
        {/* Top Left */}
        <div className="flex flex-col gap-4 w-full md:w-64">
          
          {/* Logo & Settings */}
          <div className="flex items-center justify-between bg-zinc-900/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto w-full">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="10" cy="22" r="6" fill="#6366f1" />
                <circle cx="22" cy="10" r="8" fill="#a855f7" />
                <path d="M12 18L18 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16 22L22 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-white font-black text-xl tracking-tight hidden sm:inline">Bond<span className="text-indigo-400">Lab</span></span>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Toggle Light Mode (Coming Soon)"
                onClick={() => alert("Light mode coming soon!")}
              >
                <Sun size={18} />
              </button>
              <button 
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1"
                title="Change Language (Coming Soon)"
                onClick={() => alert("Multi-language support coming soon!")}
              >
                <Globe size={18} />
                <span className="text-xs font-bold hidden sm:inline">EN</span>
              </button>
            </div>
          </div>

          {/* Desktop Elements Panel */}
          <div className="hidden md:flex flex-col bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
            <h1 className="text-white font-bold text-sm mb-4 tracking-wider uppercase opacity-70">Elements</h1>
            <div className="flex flex-col gap-3">
              {(Object.keys(ELEMENTS) as ElementType[]).map(el => {
                const data = ELEMENTS[el];
                return (
                  <button
                    key={el}
                    onClick={() => addAtom(el)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: data.color, color: el === 'H' ? 'black' : 'white' }}
                    >
                      {data.symbol}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium text-sm">{data.name}</div>
                      <div className="text-zinc-400 text-xs">Valence: {data.valence}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
              <button 
                onClick={clear}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-xl transition-colors text-sm font-medium"
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
          </div>

          <div className="pointer-events-auto">
            <StabilityDisplay />
          </div>
        </div>

        {/* Top Right */}
        <div className="flex flex-col gap-4 items-end">
          <div className="hidden md:block bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl w-64 pointer-events-auto">
            <h2 className="text-white font-bold text-sm mb-2 opacity-70 uppercase tracking-wider">Controls</h2>
            <ul className="text-zinc-300 text-sm space-y-2">
              <li>• Click an element to add it</li>
              <li>• Click two atoms to link them</li>
              <li>• Drag atoms to move them</li>
              <li>• Drag atoms close to form bonds</li>
              <li>• Click a bond to upgrade it</li>
              <li>• Right-click to remove</li>
              <li>• Drag background to rotate camera</li>
              <li>• Scroll to zoom</li>
            </ul>
          </div>
          <ChallengeMode />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-4 w-full mt-auto">
        {molecule && (
          <div className="bg-zinc-900/90 backdrop-blur-xl px-6 py-3 md:px-8 md:py-4 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto transform transition-all">
            <div className="text-center">
              <div className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest mb-1 font-semibold">Current Molecule</div>
              <div className="text-white font-bold text-xl md:text-3xl tracking-tight">{molecule.name}</div>
              <div className="text-emerald-400 font-mono text-lg md:text-xl mt-1">{molecule.formula}</div>
            </div>
          </div>
        )}

        {/* Mobile FAB */}
        <div className="md:hidden w-full flex justify-center pointer-events-auto pb-4">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus size={20} /> Add Element
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
        className={`md:hidden fixed inset-x-0 bottom-0 bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'} rounded-t-3xl z-50`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-bold text-lg">Select Element</h2>
            <button 
              onClick={() => setIsDrawerOpen(false)} 
              className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
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
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-full shadow-inner flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: data.color, color: el === 'H' ? 'black' : 'white' }}
                  >
                    {data.symbol}
                  </div>
                  <div className="text-white font-medium text-xs">{data.name}</div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <button 
              onClick={() => { clear(); setIsDrawerOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 p-3 rounded-xl transition-colors text-sm font-bold"
            >
              <Trash2 size={18} /> Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
