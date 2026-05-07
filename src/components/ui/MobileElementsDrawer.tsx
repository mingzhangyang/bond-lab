import { Trash2, X } from 'lucide-react';
import { ELEMENTS, ELEMENT_DISPLAY_ORDER, type ElementType } from '../../store';
import type { Messages } from '../../i18n';

interface MobileElementsDrawerProps {
  isOpen: boolean;
  isDark: boolean;
  softPanelClass: string;
  ghostButtonClass: string;
  dangerButtonClass: string;
  primaryTextClass: string;
  messages: Messages;
  onClose: () => void;
  onAddAtom: (element: ElementType) => void;
  onClear: () => void;
}

export function MobileElementsDrawer({
  isOpen,
  isDark,
  softPanelClass,
  ghostButtonClass,
  dangerButtonClass,
  primaryTextClass,
  messages,
  onClose,
  onAddAtom,
  onClear,
}: MobileElementsDrawerProps) {
  return (
    <>
      {isOpen && (
        <div
          className="lab-drawer-overlay md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto z-40"
          onClick={onClose}
        />
      )}

      <div
        data-testid="mobile-elements-drawer"
        className={`md:hidden fixed inset-x-0 bottom-0 border-t shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'} rounded-t-3xl z-50 ${softPanelClass}`}
      >
        <div className="lab-mobile-drawer p-5">
          <div className={`mx-auto mb-4 h-1.5 w-12 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'}`} />
          <div className="flex justify-between items-center mb-6">
            <h2 className={`info-display font-bold text-lg ${primaryTextClass}`}>{messages.ui.selectElement}</h2>
            <button
              data-testid="mobile-elements-drawer-close"
              onClick={onClose}
              aria-label={messages.ui.close}
              className={`min-h-[44px] min-w-[44px] p-2 rounded-full transition-colors touch-manipulation ${ghostButtonClass}`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="lab-mobile-scroll grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[42dvh] overflow-y-auto pr-1 stealth-scrollbar">
            {ELEMENT_DISPLAY_ORDER.map((el) => {
              const data = ELEMENTS[el];
              return (
                <button
                  key={el}
                  data-testid={`mobile-element-button-${el}`}
                  onClick={() => onAddAtom(el)}
                  className={`lab-tile flex min-h-[96px] flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-colors border touch-manipulation ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}
                >
                  <div
                    className="w-11 h-11 rounded-full shadow-inner flex items-center justify-center text-base font-bold"
                    style={{ backgroundColor: data.color, color: el === 'H' ? 'black' : 'white' }}
                  >
                    {data.symbol}
                  </div>
                  <div className={`font-medium text-[11px] leading-tight ${primaryTextClass}`}>{messages.elements[el]}</div>
                </button>
              );
            })}
          </div>

          <div className={`mt-5 pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
            <button
              data-testid="clear-elements-mobile"
              onClick={onClear}
              className={`w-full min-h-[48px] flex items-center justify-center gap-2 p-3 rounded-xl transition-colors text-sm font-bold touch-manipulation ${dangerButtonClass}`}
            >
              <Trash2 size={18} /> {messages.ui.clearAll}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
