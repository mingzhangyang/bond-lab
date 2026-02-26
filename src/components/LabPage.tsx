import React, { Suspense, lazy } from 'react';
import { useStore } from '../store';
import { getMessages } from '../i18n';
import { getSeo } from '../seo';
import { getAppShellTheme } from '../appShell';

const Scene = lazy(async () => {
  const module = await import('./Scene');
  return { default: module.Scene };
});

function SceneFallback() {
  const theme = useStore((state) => state.theme);
  const shellTheme = getAppShellTheme(theme);

  return (
    <div
      className="lab-scene-fallback"
      style={{ '--lab-shell-bg': shellTheme.canvasBackground } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="lab-scene-grid" />
      <div className="lab-scene-glow lab-scene-glow-primary" />
      <div className="lab-scene-glow lab-scene-glow-secondary" />
    </div>
  );
}

const UI = lazy(async () => {
  const module = await import('./UI');
  return { default: module.UI };
});

function UIFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6">
      <div className="lab-ui-skeleton lab-ui-skeleton-header" />
      <div className="flex justify-between gap-4">
        <div className="lab-ui-skeleton lab-ui-skeleton-panel" />
        <div className="lab-ui-skeleton lab-ui-skeleton-menu" />
      </div>
      <div className="flex justify-end">
        <div className="lab-ui-skeleton lab-ui-skeleton-toolbar" />
      </div>
    </div>
  );
}

export function LabPage() {
  const theme = useStore((state) => state.theme);
  const language = useStore((state) => state.language);
  const shellTheme = getAppShellTheme(theme);
  const messages = getMessages(language);
  const seo = getSeo(language);
  const footerTextClass = theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600';

  return (
    <main
      className="app-shell relative h-screen w-screen overflow-hidden font-sans"
      style={{
        backgroundColor: shellTheme.background,
        color: shellTheme.text,
      }}
    >
      <Suspense fallback={<SceneFallback />}>
        <Scene />
      </Suspense>
      <Suspense fallback={<UIFallback />}>
        <UI />
      </Suspense>
      <footer
        className={`pointer-events-none fixed inset-x-0 bottom-3 z-30 text-center text-[11px] uppercase tracking-[0.16em] ${footerTextClass}`}
      >
        © {new Date().getFullYear()} {messages.appTitle}
      </footer>
      <section className="sr-only" aria-label="BondLab SEO content">
        <h1>{seo.content.heading}</h1>
        <p>{seo.content.intro}</p>
        <h2>{seo.content.featureHeading}</h2>
        <ul>
          {seo.content.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <h2>{seo.content.faqHeading}</h2>
        {seo.content.faqs.map((faq) => (
          <article key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
