import { Atom, Plus, Trash2, Trophy } from 'lucide-react';
import type { Messages } from '../../i18n';
import type { OnboardingStep } from '../../onboarding';

interface MobileActionDockProps {
  isDesktopViewport: boolean;
  mobileStatusChip: string | null;
  softPanelClass: string;
  isDark: boolean;
  challengeActive: boolean;
  mobileChallengeProgress: number | null;
  isDrawerLayout: boolean;
  sceneExploreHighlightClass: string;
  onboardingStep: OnboardingStep | null;
  interactionMode: 'build' | 'delete';
  messages: Messages;
  onChallengeClick: () => void;
  onAddClick: () => void;
  onToggleInteractionMode: () => void;
}

export function MobileActionDock({
  isDesktopViewport,
  mobileStatusChip,
  softPanelClass,
  isDark,
  challengeActive,
  mobileChallengeProgress,
  isDrawerLayout,
  sceneExploreHighlightClass,
  onboardingStep,
  interactionMode,
  messages,
  onChallengeClick,
  onAddClick,
  onToggleInteractionMode,
}: MobileActionDockProps) {
  if (isDesktopViewport) return null;

  return (
    <div className="md:hidden fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[60] pointer-events-none">
      {mobileStatusChip && (
        <div className="mb-2 flex justify-center">
          <div className={`lab-reveal rounded-full border px-3 py-1 text-xs font-semibold ${softPanelClass}`}>
            {mobileStatusChip}
          </div>
        </div>
      )}
      <div
        data-testid="mobile-action-dock"
        className={`pointer-events-auto grid grid-cols-3 gap-2 rounded-2xl border p-2 shadow-2xl ${softPanelClass}`}
      >
        <button
          data-testid="mobile-dock-challenge-button"
          onClick={onChallengeClick}
          aria-label={messages.challenge.title}
          className={`relative min-h-[52px] rounded-xl border transition-colors touch-manipulation flex flex-col items-center justify-center gap-0.5 ${
            isDark ? 'border-white/12 text-zinc-100' : 'border-zinc-300 text-zinc-800'
          } ${sceneExploreHighlightClass}`}
        >
          <Trophy size={16} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">{messages.challenge.title}</span>
          {challengeActive && isDrawerLayout && mobileChallengeProgress !== null && (
            <span className={`absolute inset-x-2 bottom-1 h-1 overflow-hidden rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`}>
              <span
                className={`block h-full rounded-full ${mobileChallengeProgress <= 0.2 ? 'bg-red-500' : 'bg-indigo-500'}`}
                style={{ width: `${mobileChallengeProgress * 100}%` }}
              />
            </span>
          )}
        </button>
        <button
          data-testid="mobile-dock-add-button"
          onClick={onAddClick}
          aria-label={messages.ui.addElement}
          className={`lab-fab min-h-[52px] rounded-xl text-white transition-transform active:scale-95 touch-manipulation flex flex-col items-center justify-center gap-0.5 ${
            onboardingStep === 'add-atoms' ? 'lab-onboarding-highlight' : ''
          }`}
        >
          <Plus size={16} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">{messages.ui.addElement}</span>
        </button>
        <button
          data-testid="interaction-mode-toggle-mobile"
          onClick={onToggleInteractionMode}
          aria-label={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
          title={`${messages.ui.interactionMode}: ${interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}`}
          className={`min-h-[52px] rounded-xl border transition-colors touch-manipulation flex flex-col items-center justify-center gap-0.5 ${interactionMode === 'delete'
            ? 'border-red-400/50 bg-red-500/85 text-white'
            : (isDark ? 'border-white/12 text-zinc-100' : 'border-zinc-300 text-zinc-800')
          } ${sceneExploreHighlightClass}`}
        >
          {interactionMode === 'build' ? <Atom size={16} /> : <Trash2 size={16} />}
          <span className="text-[10px] font-semibold uppercase tracking-wide">
            {interactionMode === 'build' ? messages.ui.buildMode : messages.ui.deleteMode}
          </span>
        </button>
      </div>
    </div>
  );
}
