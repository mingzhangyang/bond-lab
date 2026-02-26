import assert from 'node:assert/strict';
import test from 'node:test';
import { getSeo, SEO_CONTENT, SEO_META } from './seo.ts';
import type { Language } from './i18n.ts';

test('seo metadata mentions chemistry and molecules', () => {
  assert.match(SEO_META.description, /chemistry/i);
  assert.match(SEO_META.description, /molecule|molecular/i);
  assert.match(SEO_META.keywords, /chemistry/i);
});

test('seo content provides substantial crawlable sections', () => {
  assert.ok(SEO_CONTENT.features.length >= 4);
  assert.ok(SEO_CONTENT.faqs.length >= 3);
});

test('getSeo returns localized bundles for supported languages', () => {
  const languages: Language[] = ['en', 'es', 'zh', 'fr', 'ja'];

  for (const language of languages) {
    const seo = getSeo(language);
    assert.ok(seo.meta.description.length > 30);
    assert.ok(seo.meta.keywords.length > 20);
    assert.ok(seo.content.features.length >= 4);
    assert.ok(seo.content.faqs.length >= 3);
    assert.equal(seo.jsonLd.inLanguage, language);
    assert.equal(seo.jsonLd.image, '/og-image.svg');
  }
});

test('localized descriptions differ across languages', () => {
  assert.notEqual(getSeo('en').meta.description, getSeo('es').meta.description);
  assert.notEqual(getSeo('en').meta.description, getSeo('zh').meta.description);
  assert.notEqual(getSeo('en').content.heading, getSeo('ja').content.heading);
});
