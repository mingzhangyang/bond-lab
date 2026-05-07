import type { Messages } from '../../i18n';
import type { Bond } from '../../store';

interface BondUndoToastProps {
  showBondUndoToast: boolean;
  lastRemovedBond: Bond | null;
  onUndo: () => void;
  softPanelClass: string;
  isDark: boolean;
  messages: Messages;
}

export function BondUndoToast({
  showBondUndoToast,
  lastRemovedBond,
  onUndo,
  softPanelClass,
  isDark,
  messages,
}: BondUndoToastProps) {
  if (!showBondUndoToast || !lastRemovedBond) return null;

  return (
    <div className="fixed left-1/2 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[70] -translate-x-1/2 pointer-events-none md:bottom-6">
      <div className={`pointer-events-auto flex items-center gap-3 rounded-full border px-4 py-2 text-xs font-semibold ${softPanelClass}`}>
        <span>{messages.ui.bondRemoved}</span>
        <button
          onClick={onUndo}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${isDark ? 'bg-white/15 hover:bg-white/25 text-zinc-100' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900'}`}
        >
          {messages.ui.undo}
        </button>
      </div>
    </div>
  );
}
