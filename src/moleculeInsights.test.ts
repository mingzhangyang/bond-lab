import assert from 'node:assert/strict';
import test from 'node:test';
import { localizeMoleculeName } from './i18n.ts';
import { deriveMoleculeInsights } from './moleculeInsights.ts';

test('deriveMoleculeInsights returns localized labels and empty molecule payload for no atoms', () => {
  const insights = deriveMoleculeInsights({
    atoms: [],
    bonds: [],
    language: 'ja',
  });

  assert.equal(insights.molecule, null);
  assert.equal(insights.moleculeName, null);
  assert.equal(insights.moleculeInfo, null);
  assert.equal(insights.polarityReport.classification, 'unknown');
  assert.equal(insights.polarityLabel, '不明');
  assert.equal(insights.polarityTitle, '極性');
  assert.equal(insights.structureTitle, '構造式');
  assert.equal(insights.factTitle, '豆知識');
});

test('deriveMoleculeInsights identifies known molecules and formats localized metadata', () => {
  const insights = deriveMoleculeInsights({
    atoms: [
      { id: 'c', element: 'C' },
      { id: 'o1', element: 'O' },
      { id: 'o2', element: 'O' },
    ],
    bonds: [
      { id: 'b1', source: 'c', target: 'o1', order: 2 },
      { id: 'b2', source: 'c', target: 'o2', order: 2 },
    ],
    language: 'fr',
    positions: {
      c: { x: 0, y: 0, z: 0 },
      o1: { x: -1.1, y: 0, z: 0 },
      o2: { x: 1.1, y: 0, z: 0 },
    },
  });

  assert.equal(insights.molecule?.name, 'Carbon Dioxide');
  assert.equal(insights.moleculeName, localizeMoleculeName('fr', 'Carbon Dioxide'));
  assert.equal(insights.moleculeInfo?.structure, 'O=C=O');
  assert.match(insights.moleculeInfo?.fact ?? '', /nonpolar/i);
  assert.equal(insights.polarityReport.classification, 'nonpolar');
  assert.equal(insights.polarityLabel, 'Apolaire');
  assert.equal(insights.polarityTitle, 'Polarité');
  assert.equal(insights.structureTitle, 'Structure');
  assert.equal(insights.factTitle, 'Info');
});
