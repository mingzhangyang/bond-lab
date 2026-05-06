import { useEffect, useState } from 'react';
import {
  BookOpenText,
  Check,
  Globe,
  Menu,
  Moon,
  Shield,
  Sparkles,
  Sun,
  ChevronRight,
} from 'lucide-react';
import { getPathForRoute, navigateToRoute } from '../../routes';
import { subscribeToMediaQuery } from '../../mediaQuery';
import type { Language } from '../../i18n';
import { getMessages } from '../../i18n';

const LANGUAGE_OPTIONS: Array<{ code: Language; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Espanol' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Francais' },
  { code: 'ja', label: '日本語' },
];

type Messages = ReturnType<typeof getMessages>;

interface SettingsMenuProps {
  messages: Messages;
  isDark: boolean;
  language: Language;
  themeActionText: string;
  softPanelClass: string;
  ghostButtonClass: string;
  settingsItemClass: string;
  onToggleTheme: () => void;
  onSetLanguage: (language: Language) => void;
  onReplayOnboarding: () => void;
}

export function SettingsMenu({
  messages,
  isDark,
  language,
  themeActionText,
  softPanelClass,
  ghostButtonClass,
  settingsItemClass,
  onToggleTheme,
  onSetLanguage,
  onReplayOnboarding,
}: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageSubmenuOpen, setIsLanguageSubmenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(max-width: 767px)').matches
  ));

  const closeMenu = () => {
    setIsOpen(false);
    setIsLanguageSubmenuOpen(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mobileMedia = window.matchMedia('(max-width: 767px)');
    const syncViewport = () => setIsMobileViewport(mobileMedia.matches);
    syncViewport();
    const unsubscribe = subscribeToMediaQuery(mobileMedia, syncViewport);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className="absolute right-4 top-4 md:right-6 md:top-6 z-[70] pointer-events-auto"
    >
      <div className="relative">
        <button
          data-testid="settings-menu-button"
          className={`lab-reveal min-h-[44px] min-w-[44px] p-2 rounded-xl transition-colors flex items-center justify-center ${softPanelClass} ${ghostButtonClass}`}
          style={{ animationDelay: '60ms' }}
          aria-label={messages.ui.menu}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => {
            setIsOpen((open) => {
              const nextOpen = !open;
              if (!nextOpen) {
                setIsLanguageSubmenuOpen(false);
              }
              return nextOpen;
            });
          }}
        >
          <Menu size={18} />
        </button>

        {isOpen && (
          <>
            <button
              data-testid="settings-menu-backdrop"
              className="fixed inset-0 z-50 cursor-default"
              aria-label={messages.ui.close}
              onClick={closeMenu}
            />
            <div
              data-testid={isMobileViewport ? 'settings-menu-sheet' : 'settings-menu-dropdown'}
              className={isMobileViewport
                ? `fixed top-0 right-0 bottom-0 w-64 border-l p-4 pt-[max(env(safe-area-inset-top),4rem)] shadow-2xl z-[60] overflow-y-auto lab-slide-in-right ${softPanelClass}`
                : `absolute right-0 top-full mt-2 w-52 rounded-xl p-2 shadow-xl z-[60] sm:w-56 ${softPanelClass}`}
              role="menu"
            >
              <button
                className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${settingsItemClass}`}
                role="menuitem"
                onClick={() => {
                  onToggleTheme();
                  closeMenu();
                }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span>{themeActionText}</span>
              </button>

              <button
                className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${settingsItemClass}`}
                role="menuitem"
                onClick={() => setIsLanguageSubmenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isLanguageSubmenuOpen}
              >
                <span className="flex items-center gap-2">
                  <Globe size={16} />
                  {messages.ui.languageToggle}
                </span>
                <span className="flex items-center text-xs font-bold">
                  <ChevronRight
                    size={14}
                    className={isLanguageSubmenuOpen ? 'rotate-90 transition-transform' : 'transition-transform'}
                  />
                </span>
              </button>

              {isLanguageSubmenuOpen && (
                <div
                  className={`mt-1 mb-2 ml-2 rounded-lg border p-1 ${isDark ? 'border-white/10 bg-black/10' : 'border-zinc-200 bg-white/70'}`}
                  role="menu"
                  aria-label={messages.ui.languageToggle}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      className={`w-full min-h-[36px] px-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                        option.code === language
                          ? (isDark ? 'bg-indigo-500/25 text-indigo-100' : 'bg-indigo-100 text-indigo-700')
                          : settingsItemClass
                      }`}
                      role="menuitemradio"
                      aria-checked={option.code === language}
                      onClick={() => {
                        onSetLanguage(option.code);
                        closeMenu();
                      }}
                    >
                      <span>{option.label}</span>
                      {option.code === language && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}

              <button
                className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${settingsItemClass}`}
                role="menuitem"
                onClick={() => {
                  onReplayOnboarding();
                  closeMenu();
                }}
              >
                <Sparkles size={16} />
                <span>{messages.onboarding.replay}</span>
              </button>

              <a
                data-testid="menu-link-instructions"
                href={getPathForRoute('instructions')}
                className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${settingsItemClass}`}
                role="menuitem"
                onClick={(event) => {
                  event.preventDefault();
                  closeMenu();
                  navigateToRoute('instructions');
                }}
              >
                <BookOpenText size={16} />
                <span>{messages.ui.instructions}</span>
              </a>

              <a
                data-testid="menu-link-privacy"
                href={getPathForRoute('privacy')}
                className={`w-full min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${settingsItemClass}`}
                role="menuitem"
                onClick={(event) => {
                  event.preventDefault();
                  closeMenu();
                  navigateToRoute('privacy');
                }}
              >
                <Shield size={16} />
                <span>{messages.ui.privacy}</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
