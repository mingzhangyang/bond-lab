import type { Messages } from '../../i18n';

interface DeleteModeHintProps {
  interactionMode: 'build' | 'delete';
  messages: Messages;
  softPanelClass: string;
}

export function DeleteModeHint({ interactionMode, messages, softPanelClass }: DeleteModeHintProps) {
  if (interactionMode !== 'delete') return null;

  return (
    <div className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+1rem)] z-[70] -translate-x-1/2 pointer-events-none">
      <div className={`rounded-full border px-4 py-2 text-xs font-semibold ${softPanelClass}`}>
        {messages.ui.removeHint} {messages.ui.pressEscToExit}
      </div>
    </div>
  );
}
