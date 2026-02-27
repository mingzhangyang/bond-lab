import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { calculateStability } from '../stability';
import { getMessages, translateStabilityIssue } from '../i18n';
import { atomPositions } from '../physics';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [collapsed, setCollapsed] = useState(false);

  if (atoms.length === 0) return null;

  let color = 'text-emerald-400';
  if (report.score < 80) color = 'text-yellow-400';
  if (report.score < 50) color = 'text-red-400';
  const panelClass = 'lab-panel lab-panel-glow';
  const headingTextClass = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const secondaryTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const translatedIssues = report.issues.map((issue) => translateStabilityIssue(language, issue));

  if (collapsed) {
    return (
      <button
        className={`lab-reveal px-4 py-3 rounded-2xl border pointer-events-auto w-full flex items-center justify-between gap-2 touch-manipulation ${panelClass}`}
        style={{ animationDelay: '120ms' }}
        onClick={() => setCollapsed(false)}
        aria-expanded={false}
        aria-label={messages.stability.title}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <h2 className={`info-display font-bold text-sm uppercase tracking-wider shrink-0 ${headingTextClass}`}>
            {messages.stability.title}
          </h2>
          <span className={`font-bold text-xl ${color}`}>{report.score}/100</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-mono font-bold ${report.energy > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {report.energy > 0 ? '+' : ''}{report.energy} kJ/mol
          </span>
          <ChevronDown size={14} className={headingTextClass} />
        </div>
      </button>
    );
  }

  return (
    <div className={`lab-reveal p-4 rounded-2xl border pointer-events-auto w-full ${panelClass}`} style={{ animationDelay: '120ms' }}>
      <div className="flex justify-between items-end mb-2">
        <h2 className={`info-display font-bold text-sm uppercase tracking-wider ${headingTextClass}`}>{messages.stability.title}</h2>
        <div className="flex items-center gap-2">
          <div className={`text-xs font-mono font-bold ${report.energy > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {report.energy > 0 ? '+' : ''}{report.energy} kJ/mol
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className={`p-1 rounded-lg transition-colors touch-manipulation hover:opacity-70 ${headingTextClass}`}
            aria-expanded={true}
            aria-label={messages.ui.collapse}
          >
            <ChevronUp size={14} />
          </button>
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
