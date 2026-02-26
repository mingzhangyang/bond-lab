/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { InstructionsPage } from './components/InstructionsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { useStore } from './store';
import { getMessages } from './i18n';
import { getSeo } from './seo';
import { getRouteFromPath } from './routes';
import type { AppRoute } from './routes';

export default function App() {
  const theme = useStore((state) => state.theme);
  const language = useStore((state) => state.language);
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return 'lab';
    return getRouteFromPath(window.location.pathname);
  });
  const messages = useMemo(() => getMessages(language), [language]);
  const seo = useMemo(() => getSeo(language), [language]);
  const isDark = theme === 'dark';
  const footerTextClass = isDark ? 'text-zinc-500' : 'text-zinc-600';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncRoute = () => {
      setRoute(getRouteFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', syncRoute);
    syncRoute();
    return () => {
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    const routeTitle = route === 'privacy'
      ? messages.ui.privacyTitle
      : route === 'instructions'
        ? messages.ui.instructionsTitle
        : seo.meta.titleSuffix;
    const routeDescription = route === 'privacy'
      ? `${messages.ui.privacyTitle} - ${messages.appTitle}`
      : route === 'instructions'
        ? `${messages.ui.instructionsTitle} - ${messages.appTitle}`
        : seo.meta.description;
    const pageTitle = `${messages.appTitle} | ${routeTitle}`;
    const setMetaContent = (selector: string, content: string) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    document.title = pageTitle;
    document.documentElement.lang = language;

    setMetaContent('meta[name="description"]', routeDescription);
    setMetaContent('meta[name="keywords"]', route === 'lab' ? seo.meta.keywords : 'bondlab');
    setMetaContent('meta[property="og:title"]', pageTitle);
    setMetaContent(
      'meta[property="og:description"]',
      route === 'lab' ? seo.meta.ogDescription : routeDescription,
    );
    setMetaContent('meta[name="twitter:title"]', pageTitle);
    setMetaContent(
      'meta[name="twitter:description"]',
      route === 'lab' ? seo.meta.twitterDescription : routeDescription,
    );

    const jsonLdScript = document.querySelector('#seo-json-ld');
    if (jsonLdScript) {
      jsonLdScript.textContent = route === 'lab' ? JSON.stringify(seo.jsonLd) : '';
    }
  }, [language, messages.appTitle, messages.ui.instructionsTitle, messages.ui.privacyTitle, route, seo]);

  if (route === 'privacy') {
    return <PrivacyPage />;
  }

  if (route === 'instructions') {
    return <InstructionsPage />;
  }

  return (
    <main className={`w-screen h-screen overflow-hidden relative font-sans ${isDark ? 'bg-black' : 'bg-slate-100'}`}>
      <Scene />
      <UI />
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
