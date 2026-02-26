/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useStore } from './store';
import { getMessages } from './i18n';
import { getSeo } from './seo';
import { getRouteFromPath } from './routes';
import type { AppRoute } from './routes';
import { getAppShellTheme } from './appShell';

const LabPage = lazy(async () => {
  const module = await import('./components/LabPage');
  return { default: module.LabPage };
});

const InstructionsPage = lazy(async () => {
  const module = await import('./components/InstructionsPage');
  return { default: module.InstructionsPage };
});

const PrivacyPage = lazy(async () => {
  const module = await import('./components/PrivacyPage');
  return { default: module.PrivacyPage };
});

function RouteFallback() {
  const theme = useStore((state) => state.theme);
  const shellTheme = getAppShellTheme(theme);

  return (
    <main
      className="app-shell app-route-fallback h-screen w-screen"
      style={{
        backgroundColor: shellTheme.background,
        color: shellTheme.text,
      }}
    >
      <div className="app-route-loader" aria-hidden="true" />
    </main>
  );
}

export default function App() {
  const theme = useStore((state) => state.theme);
  const language = useStore((state) => state.language);
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return 'lab';
    return getRouteFromPath(window.location.pathname);
  });
  const messages = useMemo(() => getMessages(language), [language]);
  const seo = useMemo(() => getSeo(language), [language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

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
    return (
      <Suspense fallback={<RouteFallback />}>
        <PrivacyPage />
      </Suspense>
    );
  }

  if (route === 'instructions') {
    return (
      <Suspense fallback={<RouteFallback />}>
        <InstructionsPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      <LabPage />
    </Suspense>
  );
}
