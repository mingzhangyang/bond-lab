import { Atom, Trash2 } from 'lucide-react';
import type { Messages } from '../../i18n';

interface InteractionModeFabProps {
  isDesktopViewport: boolean;
  interactionMode: 'build' | 'delete';
  onToggle: () => void;
  interactionBubbleClass: string;
  sceneExploreHighlightClass: string;
  messages: Messages;
}

export function InteractionModeFab({
  isDesktopViewport,
  interactionMode,
  onToggle,
  interactionBubbleClass,
  sceneExploreHighlightClass,
  messages,
}: InteractionModeFabProps) {
  if (!isDesktopViewport) return null;

  return (
    <button
      data-testid="interaction-mode-toggle-desktop"
      onClick={onToggle}
      aria-label={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
      title={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
      className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] md:right-6 md:bottom-6 z-50 w-14 h-14 rounded-full shadow-xl pointer-events-auto transition-colors flex items-center justify-center touch-manipulation ${interactionBubbleClass} ${sceneExploreHighlightClass}`}
    >
      {interactionMode === 'build' ? <Atom size={22} /> : <Trash2 size={20} />}
    </button>
  );
}
