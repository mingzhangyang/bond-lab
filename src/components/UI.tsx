import React from 'react';
import { useStore, ELEMENTS, ElementType } from '../store';
import { identifyMolecule } from '../identifier';
import { Trash2, RefreshCw } from 'lucide-react';
import { StabilityDisplay } from './StabilityDisplay';

export function UI() {
  const atoms = useStore(state => state.atoms);
  const bonds = useStore(state => state.bonds);
  const addAtom = useStore(state => state.addAtom);
  const clear = useStore(state => state.clear);

  const molecule = identifyMolecule(atoms, bonds);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
            <h1 className="text-white font-bold text-xl mb-4 tracking-tight">Elements</h1>
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
                      className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-xs font-bold"
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
          <StabilityDisplay />
        </div>
        
        <div className="bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl max-w-xs pointer-events-auto">
          <h2 className="text-white font-bold text-sm mb-2 opacity-70 uppercase tracking-wider">Controls</h2>
          <ul className="text-zinc-300 text-sm space-y-2">
            <li>• Click an element to add it</li>
            <li>• Drag atoms to move them</li>
            <li>• Drag atoms close to form bonds</li>
            <li>• Click a bond to upgrade it</li>
            <li>• Right-click to remove</li>
            <li>• Drag background to rotate camera</li>
            <li>• Scroll to zoom</li>
          </ul>
        </div>
      </div>

      {molecule && (
        <div className="self-center bg-zinc-900/90 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto transform transition-all">
          <div className="text-center">
            <div className="text-zinc-400 text-xs uppercase tracking-widest mb-1 font-semibold">Current Molecule</div>
            <div className="text-white font-bold text-3xl tracking-tight">{molecule.name}</div>
            <div className="text-emerald-400 font-mono text-xl mt-1">{molecule.formula}</div>
          </div>
        </div>
      )}
    </div>
  );
}
