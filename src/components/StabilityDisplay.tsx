import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { calculateStability, StabilityReport } from '../stability';

export function StabilityDisplay() {
  const atoms = useStore(state => state.atoms);
  const bonds = useStore(state => state.bonds);
  const [report, setReport] = useState<StabilityReport | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setReport(calculateStability(atoms, bonds));
    }, 500);
    return () => clearInterval(interval);
  }, [atoms, bonds]);

  if (!report || atoms.length === 0) return null;

  let color = 'text-emerald-400';
  if (report.score < 80) color = 'text-yellow-400';
  if (report.score < 50) color = 'text-red-400';

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto mt-4 max-w-xs">
      <h2 className="text-white font-bold text-sm mb-2 opacity-70 uppercase tracking-wider">Stability Score</h2>
      <div className={`text-3xl font-bold ${color}`}>{report.score}/100</div>
      {report.issues.length > 0 && (
        <ul className="mt-3 text-xs text-zinc-400 space-y-1">
          {report.issues.map((issue, i) => (
            <li key={i}>• {issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
