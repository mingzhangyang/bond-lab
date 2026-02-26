import React, { useMemo } from 'react';
import { ArrowLeft, Globe, Moon, Sun } from 'lucide-react';
import { getMessages } from '../i18n';
import { getPathForRoute } from '../routes';
import { useStore } from '../store';
import { getInfoThemeVars } from '../theme';

interface InfoPageLayoutProps {
  route: 'privacy' | 'instructions';
  title: string;
  description?: string;
  metadata?: React.ReactNode;
  children: React.ReactNode;
}

export function InfoPageLayout({ route, title, description, metadata, children }: InfoPageLayoutProps) {
  const theme = useStore((state) => state.theme);
  const language = useStore((state) => state.language);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const cycleLanguage = useStore((state) => state.cycleLanguage);
  const messages = useMemo(() => getMessages(language), [language]);
  const isDark = theme === 'dark';

  const pageClass = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const panelClass = 'info-panel';
  const ghostButtonClass = isDark
    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
    : 'text-zinc-700 hover:text-zinc-900 hover:bg-black/5';
  const headingTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const leadTextClass = isDark ? 'text-zinc-300' : 'text-zinc-700';
  const tabBaseClass = 'min-h-[44px] rounded-xl px-4 text-sm font-semibold transition-colors inline-flex items-center';
  const activeTabClass = 'info-accent-pill ring-1 ring-indigo-300/35';
  const inactiveTabClass = isDark
    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
    : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/5';
  const themeVars = getInfoThemeVars(theme);

  return (
    <main className={`info-page-root relative min-h-screen overflow-x-hidden ${pageClass}`} style={themeVars}>
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
      >
        <div className={`info-orb absolute -top-16 -left-24 h-80 w-80 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/25' : 'bg-indigo-200/60'}`} />
        <div className={`info-orb absolute bottom-0 right-0 h-96 w-96 rounded-full blur-3xl ${isDark ? 'bg-cyan-500/15' : 'bg-cyan-100/70'}`} style={{ animationDelay: '1.8s' }} />
      </div>
      <div className="relative mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <header className={`info-reveal mb-5 flex items-center justify-between gap-3 rounded-2xl border p-3 backdrop-blur-md ${panelClass}`}>
          <a
            href={getPathForRoute('lab')}
            className={`min-h-[44px] rounded-xl px-3 text-sm font-semibold transition-colors inline-flex items-center gap-2 ${ghostButtonClass}`}
          >
            <ArrowLeft size={16} />
            <span>{messages.ui.backToLab}</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              className={`min-h-[44px] min-w-[44px] rounded-xl p-2 transition-colors inline-flex items-center justify-center ${ghostButtonClass}`}
              aria-label={messages.ui.themeToggle}
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className={`min-h-[44px] rounded-xl px-3 text-sm font-semibold transition-colors inline-flex items-center gap-2 ${ghostButtonClass}`}
              aria-label={messages.ui.languageToggle}
              onClick={cycleLanguage}
            >
              <Globe size={16} />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>
        </header>

        <nav
          className={`info-reveal mb-5 rounded-2xl border p-2 backdrop-blur-md ${panelClass}`}
          style={{ animationDelay: '90ms' }}
          aria-label="Info pages"
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <a
              href={getPathForRoute('instructions')}
              className={`${tabBaseClass} ${route === 'instructions' ? activeTabClass : inactiveTabClass}`}
              aria-current={route === 'instructions' ? 'page' : undefined}
            >
              {messages.ui.instructionsTitle}
            </a>
            <a
              href={getPathForRoute('privacy')}
              className={`${tabBaseClass} ${route === 'privacy' ? activeTabClass : inactiveTabClass}`}
              aria-current={route === 'privacy' ? 'page' : undefined}
            >
              {messages.ui.privacyTitle}
            </a>
          </div>
        </nav>

        <article className={`info-reveal rounded-3xl border p-5 md:p-7 backdrop-blur-md ${panelClass}`} style={{ animationDelay: '170ms' }}>
          <div className={`pb-5 md:pb-6 border-b ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
            <p className={`info-display text-[11px] uppercase tracking-[0.2em] font-semibold ${headingTextClass}`}>{messages.appTitle}</p>
            <h1 className="info-display mt-2 text-3xl md:text-4xl font-black tracking-tight">{title}</h1>
            {description ? <p className={`mt-3 max-w-3xl text-sm md:text-base leading-relaxed ${leadTextClass}`}>{description}</p> : null}
            {metadata ? <div className={`mt-4 text-xs md:text-sm ${headingTextClass}`}>{metadata}</div> : null}
          </div>
          <div className={`mt-6 space-y-6 ${headingTextClass}`}>{children}</div>
        </article>
      </div>
    </main>
  );
}
