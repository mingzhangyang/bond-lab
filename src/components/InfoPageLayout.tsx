import React, { useMemo } from 'react';
import { ArrowLeft, Globe, Moon, Sun } from 'lucide-react';
import { getMessages } from '../i18n';
import { getPathForRoute } from '../routes';
import { useStore } from '../store';

interface InfoPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function InfoPageLayout({ title, children }: InfoPageLayoutProps) {
  const theme = useStore((state) => state.theme);
  const language = useStore((state) => state.language);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const cycleLanguage = useStore((state) => state.cycleLanguage);
  const messages = useMemo(() => getMessages(language), [language]);
  const isDark = theme === 'dark';

  const pageClass = isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-100 text-zinc-900';
  const panelClass = isDark
    ? 'bg-zinc-900/90 border-white/10 shadow-black/50'
    : 'bg-white/90 border-zinc-200 shadow-zinc-300/50';
  const ghostButtonClass = isDark
    ? 'text-zinc-300 hover:text-white hover:bg-white/10'
    : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100';
  const headingTextClass = isDark ? 'text-zinc-400' : 'text-zinc-600';

  return (
    <main className={`min-h-screen ${pageClass}`}>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-8">
        <header className={`mb-5 flex items-center justify-between gap-3 rounded-2xl border p-3 backdrop-blur-md ${panelClass}`}>
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

        <article className={`rounded-3xl border p-5 md:p-6 backdrop-blur-md ${panelClass}`}>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h1>
          <div className={`mt-2 h-px w-full ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`} />
          <div className={`mt-5 space-y-5 ${headingTextClass}`}>{children}</div>
        </article>
      </div>
    </main>
  );
}
