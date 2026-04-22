import assert from 'node:assert/strict';
import test from 'node:test';
import { getRouteSeo, getSeo, SEO_BASE_URL, SEO_CONTENT, SEO_IMAGE_URL, SEO_META } from './seo.ts';
import type { Language } from './i18n.ts';

test('seo metadata mentions chemistry and molecules', () => {
  assert.match(SEO_META.description, /chemistry/i);
  assert.match(SEO_META.description, /molecule|molecular/i);
  assert.match(SEO_META.keywords, /chemistry/i);
});

test('seo image uses the updated PNG social preview asset', () => {
  assert.equal(SEO_IMAGE_URL, `${SEO_BASE_URL}/BondLab-OG-Image-1200x630.png`);
  assert.match(SEO_IMAGE_URL, /\.png$/);
});

test('seo content provides substantial crawlable sections', () => {
  assert.ok(SEO_CONTENT.features.length >= 4);
  assert.ok(SEO_CONTENT.useCases.length >= 3);
  assert.ok(SEO_CONTENT.audiences.length >= 3);
  assert.match(SEO_CONTENT.disclaimer, /educ|simpl|analysis/i);
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
    assert.equal(seo.jsonLd.image, SEO_IMAGE_URL);
    assert.ok(seo.faqJsonLd);
    assert.equal(seo.faqJsonLd['@type'], 'FAQPage');
    assert.ok(seo.faqJsonLd.mainEntity && seo.faqJsonLd.mainEntity.length >= 3);
  }
});

test('getRouteSeo returns canonical route metadata and structured data', () => {
  const labSeo = getRouteSeo('en', 'lab');
  assert.equal(labSeo.canonicalUrl, `${SEO_BASE_URL}/`);
  assert.equal(labSeo.robots, 'index, follow, max-image-preview:large');
  assert.equal(labSeo.ogType, 'website');
  assert.ok(labSeo.jsonLd.length >= 3);
  assert.ok(labSeo.jsonLd.some((entry) => entry['@type'] === 'WebSite'));
  assert.ok(labSeo.jsonLd.some((entry) => entry['@type'] === 'SoftwareApplication'));
  assert.ok(labSeo.jsonLd.some((entry) => entry['@type'] === 'FAQPage'));

  const instructionsSeo = getRouteSeo('zh', 'instructions');
  assert.equal(instructionsSeo.canonicalUrl, `${SEO_BASE_URL}/instructions`);
  assert.equal(instructionsSeo.ogType, 'article');
  assert.match(instructionsSeo.description, /使用说明|BondLab/);
  assert.match(instructionsSeo.keywords, /使用说明|教程/);
  assert.ok(instructionsSeo.jsonLd.some((entry) => entry['@type'] === 'HowTo'));
  assert.ok(instructionsSeo.jsonLd.some((entry) => entry['@type'] === 'BreadcrumbList'));

  const privacySeo = getRouteSeo('en', 'privacy');
  assert.equal(privacySeo.canonicalUrl, `${SEO_BASE_URL}/privacy`);
  assert.equal(privacySeo.robots, 'noindex, follow');
  assert.equal(privacySeo.ogType, 'article');
  assert.ok(privacySeo.jsonLd.some((entry) => entry['@type'] === 'WebPage'));
  assert.ok(privacySeo.jsonLd.some((entry) => entry['@type'] === 'BreadcrumbList'));
});

test('localized descriptions differ across languages', () => {
  assert.notEqual(getSeo('en').meta.description, getSeo('es').meta.description);
  assert.notEqual(getSeo('en').meta.description, getSeo('zh').meta.description);
  assert.notEqual(getSeo('en').content.heading, getSeo('ja').content.heading);
});
