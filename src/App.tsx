/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo } from 'react';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { useStore } from './store';
import { getMessages } from './i18n';
import { getSeo } from './seo';

export default function App() {
  const theme = useStore((state) => state.theme);
  const language = useStore((state) => state.language);
  const messages = useMemo(() => getMessages(language), [language]);
  const seo = useMemo(() => getSeo(language), [language]);
  const isDark = theme === 'dark';

  useEffect(() => {
    const pageTitle = `${messages.appTitle} | ${seo.meta.titleSuffix}`;
    const setMetaContent = (selector: string, content: string) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    document.title = pageTitle;
    document.documentElement.lang = language;

    setMetaContent('meta[name="description"]', seo.meta.description);
    setMetaContent('meta[name="keywords"]', seo.meta.keywords);
    setMetaContent('meta[property="og:title"]', pageTitle);
    setMetaContent('meta[property="og:description"]', seo.meta.ogDescription);
    setMetaContent('meta[name="twitter:title"]', pageTitle);
    setMetaContent('meta[name="twitter:description"]', seo.meta.twitterDescription);

    const jsonLdScript = document.querySelector('#seo-json-ld');
    if (jsonLdScript) {
      jsonLdScript.textContent = JSON.stringify(seo.jsonLd);
    }
  }, [language, messages.appTitle, seo]);

  return (
    <main className={`w-screen h-screen overflow-hidden relative font-sans ${isDark ? 'bg-black' : 'bg-slate-100'}`}>
      <Scene />
      <UI />
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
