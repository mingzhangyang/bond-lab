import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import type { DragEvent } from 'react';
import { ELEMENTS, ELEMENT_DISPLAY_ORDER, type ElementType } from '../../store';
import { ChallengeMode } from '../ChallengeMode';
import type { Messages } from '../../i18n';

interface DesktopElementsRailProps {
  isDesktopViewport: boolean;
  isElementsPanelOpen: boolean;
  elementPanelHighlightClass: string;
  softPanelClass: string;
  panelClass: string;
  headingTextClass: string;
  ghostButtonClass: string;
  inactiveModeClass: string;
  primaryTextClass: string;
  secondaryTextClass: string;
  dangerButtonClass: string;
  isDark: boolean;
  sceneExploreHighlightClass: string;
  messages: Messages;
  onOpenPanel: () => void;
  onClosePanel: () => void;
  onElementDragStart: (event: DragEvent<HTMLButtonElement>, element: ElementType) => void;
  onAddAtom: (element: ElementType) => void;
  onClear: () => void;
  onStartChallenge: () => void;
}

export function DesktopElementsRail({
  isDesktopViewport,
  isElementsPanelOpen,
  elementPanelHighlightClass,
  softPanelClass,
  panelClass,
  headingTextClass,
  ghostButtonClass,
  inactiveModeClass,
  primaryTextClass,
  secondaryTextClass,
  dangerButtonClass,
  isDark,
  sceneExploreHighlightClass,
  messages,
  onOpenPanel,
  onClosePanel,
  onElementDragStart,
  onAddAtom,
  onClear,
  onStartChallenge,
}: DesktopElementsRailProps) {
  return (
    <div className="hidden md:flex fixed left-0 top-[calc(env(safe-area-inset-top)+5.75rem)] bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] z-40 pointer-events-none">
      <div className="relative flex h-full flex-col gap-4">
        <div className={`relative flex-1 min-h-0 w-80 ${elementPanelHighlightClass}`}>
          {!isElementsPanelOpen && (
            <button
              onClick={onOpenPanel}
              aria-label={messages.ui.elements}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-40 min-h-[56px] px-3 rounded-r-xl border border-l-0 items-center gap-2 pointer-events-auto transition-colors flex ${softPanelClass} ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}
            >
              <ChevronRight size={16} />
              <span className="info-display text-xs font-semibold uppercase tracking-wide">{messages.ui.elements}</span>
            </button>
          )}

          <div
            className={`lab-reveal flex h-full w-80 rounded-2xl p-4 pointer-events-auto transition-transform duration-300 ${isElementsPanelOpen
                ? 'translate-x-0'
                : '-translate-x-[calc(100%+2rem)] pointer-events-none'
              } ${panelClass}`}
            style={{ animationDelay: '70ms' }}
          >
            <div className="flex flex-col h-full w-full min-h-0">
              <div className="flex items-center justify-between mb-4">
                <h1 className={`info-display font-bold text-sm tracking-wider uppercase ${headingTextClass}`}>{messages.ui.elements}</h1>
                <button
                  onClick={onClosePanel}
                  aria-label={messages.ui.collapse}
                  className={`min-h-[36px] min-w-[36px] rounded-lg transition-colors flex items-center justify-center ${ghostButtonClass}`}
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 min-h-0 stealth-scrollbar">
                {ELEMENT_DISPLAY_ORDER.map((el) => {
                  const data = ELEMENTS[el];
                  return (
                    <button
                      key={el}
                      data-testid={`element-button-${el}`}
                      draggable={isDesktopViewport}
                      onDragStart={(event) => onElementDragStart(event, el)}
                      onClick={() => onAddAtom(el)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-colors border ${inactiveModeClass}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ backgroundColor: data.color, color: el === 'H' ? 'black' : 'white' }}
                      >
                        {data.symbol}
                      </div>
                      <div className={`font-medium text-xs leading-tight ${primaryTextClass}`}>{messages.elements[el]}</div>
                      <div className={`text-[11px] ${secondaryTextClass}`}>{messages.ui.valence}: {data.valence}</div>
                    </button>
                  );
                })}
              </div>

              <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                <button
                  data-testid="clear-elements-desktop"
                  onClick={onClear}
                  className={`w-full min-h-[44px] flex items-center justify-center gap-2 p-2 rounded-xl transition-colors text-sm font-medium ${dangerButtonClass}`}
                >
                  <Trash2 size={16} /> {messages.ui.clear}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isDesktopViewport && (
          <div className={`pointer-events-auto w-80 ${sceneExploreHighlightClass}`}>
            <ChallengeMode
              isDrawerLayout={false}
              isMobileDrawerOpen={false}
              setIsMobileDrawerOpen={() => {}}
              onStart={onStartChallenge}
            />
          </div>
        )}
      </div>
    </div>
  );
}
