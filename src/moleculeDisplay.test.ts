import assert from 'node:assert/strict';
import test from 'node:test';
import { MOLECULE_CATALOG, getMoleculeDefinition } from './moleculeCatalog.ts';
import { getMoleculeInfo, localizeMoleculeName } from './moleculeDisplay.ts';
import { deriveMoleculeInsights } from './moleculeInsights.ts';
import { templateToMoleculeGraph } from './moleculeRecognition.ts';

for (const definition of MOLECULE_CATALOG) {
  test(`catalog display: ${definition.name} has names and explanatory metadata`, () => {
    assert.ok(getMoleculeInfo(definition.name));
    for (const language of ['en', 'zh', 'es', 'fr', 'ja'] as const) {
      assert.ok(localizeMoleculeName(language, definition.name).length > 0);
    }
  });
}

test('calcium hydroxide has localized identity and formula-unit metadata, not molecular polarity', () => {
  const { atoms, bonds } = templateToMoleculeGraph(getMoleculeDefinition('Calcium Hydroxide')!);
  const insights = deriveMoleculeInsights({ atoms, bonds, language: 'zh' });
  assert.equal(insights.moleculeName, '\u6c22\u6c27\u5316\u9499');
  assert.equal(insights.molecule?.formula, 'Ca(OH)\u2082');
  assert.match(insights.moleculeInfo?.structure ?? '', /Ca2\+.*2 OH-/);
  assert.match(insights.moleculeInfo?.fact ?? '', /\u7b80\u5316/);
  assert.equal(insights.polarityReport.classification, 'unknown');
  assert.equal(insights.polarityLabel, '\u4e0d\u9002\u7528');
  assert.equal(localizeMoleculeName('zh', 'Carbon Monoxide'), '\u4e00\u6c27\u5316\u78b3');
});

