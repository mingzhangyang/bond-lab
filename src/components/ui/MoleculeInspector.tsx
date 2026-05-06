import {
  Atom,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Info,
  Zap,
} from 'lucide-react';
import type { MoleculeInfo } from '../../moleculeInfo';
import { getMessages } from '../../i18n';

interface MoleculeMatch {
  name: string;
  formula: string;
}

type Messages = ReturnType<typeof getMessages>;

interface MoleculeInspectorProps {
  isDesktopViewport: boolean;
  molecule: MoleculeMatch | null;
  moleculeName: string | null;
  moleculeInfo: MoleculeInfo | null;
  isMobileInfoCollapsed: boolean;
  setIsMobileInfoCollapsed: (isCollapsed: boolean) => void;
  panelClass: string;
  headingTextClass: string;
  primaryTextClass: string;
  secondaryTextClass: string;
  ghostButtonClass: string;
  isDark: boolean;
  structureTitle: string;
  factTitle: string;
  polarityTitle: string;
  polarityLabel: string;
  polarityClassification: 'polar' | 'nonpolar' | 'unknown';
  polarityReason: string;
  messages: Messages;
}

export function MoleculeInspector({
  isDesktopViewport,
  molecule,
  moleculeName,
  moleculeInfo,
  isMobileInfoCollapsed,
  setIsMobileInfoCollapsed,
  panelClass,
  headingTextClass,
  primaryTextClass,
  secondaryTextClass,
  ghostButtonClass,
  isDark,
  structureTitle,
  factTitle,
  polarityTitle,
  polarityLabel,
  polarityClassification,
  polarityReason,
  messages,
}: MoleculeInspectorProps) {
  if (!molecule) return null;

  if (isDesktopViewport) {
    return (
      <div
        className={`lab-reveal min-h-0 flex-1 rounded-2xl p-6 pointer-events-auto flex flex-col gap-6 overflow-y-auto stealth-scrollbar ${panelClass}`}
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
            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide inline-block mb-1 ${
              polarityClassification === 'polar'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                : (polarityClassification === 'nonpolar'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
                  : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/20')
            }`}>
              {polarityLabel}
            </span>
            <p className={`text-xs leading-normal mt-1 italic ${secondaryTextClass}`}>
              {polarityReason}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isMobileInfoCollapsed) {
    return (
      <button
        className={`lab-reveal px-5 py-2.5 rounded-3xl pointer-events-auto flex items-center gap-2.5 touch-manipulation ${panelClass}`}
        style={{ animationDelay: '130ms' }}
        onClick={() => setIsMobileInfoCollapsed(false)}
        aria-expanded={false}
        aria-label={messages.ui.expand}
      >
        <FlaskConical size={14} className="text-emerald-400 shrink-0" />
        <span className={`info-display font-bold text-base tracking-tight ${primaryTextClass}`}>{moleculeName}</span>
        <span className="text-emerald-400 font-mono text-sm">{molecule.formula}</span>
        <ChevronUp size={14} className={`${headingTextClass} shrink-0`} />
      </button>
    );
  }

  return (
    <div className={`lab-reveal px-6 py-4 rounded-3xl pointer-events-auto transform transition-all ${panelClass}`} style={{ animationDelay: '130ms' }}>
      <div className="text-center max-w-sm relative">
        <button
          onClick={() => setIsMobileInfoCollapsed(true)}
          className={`absolute -top-1 right-0 p-1 rounded-lg touch-manipulation ${ghostButtonClass}`}
          aria-expanded={true}
          aria-label={messages.ui.collapse}
        >
          <ChevronDown size={14} />
        </button>

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
          <span className={`text-sm font-bold ${polarityClassification === 'polar' ? 'text-amber-400' : (polarityClassification === 'nonpolar' ? 'text-cyan-400' : secondaryTextClass)}`}>
            {polarityLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
