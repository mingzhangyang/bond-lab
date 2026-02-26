import React, { useMemo } from 'react';
import { useStore } from '../store';
import { calculateStability } from '../stability';
import { getMessages, translateStabilityIssue } from '../i18n';
import { atomPositions } from '../physics';

export function StabilityDisplay() {
  const atoms = useStore((state) => state.atoms);
  const bonds = useStore((state) => state.bonds);
  const theme = useStore((state) => state.theme);
  const language = useStore((state) => state.language);
  const messages = useMemo(() => getMessages(language), [language]);
  const isDark = theme === 'dark';
  const report = useMemo(
    () => calculateStability(atoms, bonds, { positions: atomPositions }),
    [atoms, bonds],
  );

  if (atoms.length === 0) return null;

  let color = 'text-emerald-400';
  if (report.score < 80) color = 'text-yellow-400';
  if (report.score < 50) color = 'text-red-400';
  const panelClass = isDark
    ? 'bg-zinc-900/80 border-white/10 shadow-2xl'
    : 'bg-white/90 border-zinc-200 shadow-xl shadow-zinc-300/50';
  const headingTextClass = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const secondaryTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const translatedIssues = report.issues.map((issue) => translateStabilityIssue(language, issue));

  return (
    <div className={`backdrop-blur-md p-4 rounded-2xl border pointer-events-auto w-full ${panelClass}`}>
      <div className="flex justify-between items-end mb-2">
        <h2 className={`font-bold text-sm uppercase tracking-wider ${headingTextClass}`}>{messages.stability.title}</h2>
        <div className={`text-xs font-mono font-bold ${report.energy > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {report.energy > 0 ? '+' : ''}{report.energy} kJ/mol
        </div>
      </div>
      <div className={`text-3xl font-bold ${color}`}>{report.score}/100</div>
      {translatedIssues.length > 0 && (
        <ul className={`mt-3 text-xs space-y-1 ${secondaryTextClass}`}>
          {translatedIssues.map((issue, i) => (
            <li key={i}>• {issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
