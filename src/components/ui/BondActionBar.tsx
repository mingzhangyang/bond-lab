import type { Messages } from '../../i18n';
import type { Bond } from '../../store';

interface BondActionBarProps {
  interactionMode: 'build' | 'delete';
  selectedBond: Bond | null;
  onUpgrade: () => void;
  onDelete: () => void;
  softPanelClass: string;
  secondaryTextClass: string;
  isDark: boolean;
  messages: Messages;
}

export function BondActionBar({
  interactionMode,
  selectedBond,
  onUpgrade,
  onDelete,
  softPanelClass,
  secondaryTextClass,
  isDark,
  messages,
}: BondActionBarProps) {
  if (interactionMode !== 'build' || !selectedBond) return null;

  return (
    <div className="fixed left-1/2 bottom-[calc(8.25rem+env(safe-area-inset-bottom))] z-[70] -translate-x-1/2 pointer-events-none md:bottom-24">
      <div className={`pointer-events-auto flex items-center gap-2 rounded-2xl border p-2 shadow-xl ${softPanelClass}`}>
        <span className={`px-2 text-xs font-semibold ${secondaryTextClass}`}>
          {messages.ui.bondActions}: {messages.ui.bondOrderLabel} {selectedBond.order}
        </span>
        <button
          data-testid="selected-bond-upgrade"
          onClick={onUpgrade}
          disabled={selectedBond.order >= 3}
          className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
            selectedBond.order >= 3
              ? (isDark ? 'bg-white/10 text-zinc-500' : 'bg-zinc-200 text-zinc-400')
              : 'bg-indigo-500 text-white hover:bg-indigo-400'
          }`}
        >
          {messages.ui.upgradeBond}
        </button>
        <button
          data-testid="selected-bond-delete"
          onClick={onDelete}
          className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${isDark ? 'bg-red-500/85 text-white hover:bg-red-500' : 'bg-red-500 text-white hover:bg-red-600'}`}
        >
          {messages.ui.deleteBond}
        </button>
      </div>
    </div>
  );
}
