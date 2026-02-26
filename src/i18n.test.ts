import assert from 'node:assert/strict';
import test from 'node:test';
import { getMessages, localizeMoleculeName, translateStabilityIssue } from './i18n.ts';

test('getMessages returns English defaults', () => {
  const en = getMessages('en');
  assert.equal(en.ui.addElement, 'Add Element');
  assert.equal(en.ui.showAtomLabels, 'Show atom labels');
  assert.equal(en.challenge.title, 'Challenge');
});

test('getMessages returns Spanish copy', () => {
  const es = getMessages('es');
  assert.equal(es.ui.addElement, 'Agregar elemento');
  assert.equal(es.ui.showAtomLabels, 'Mostrar simbolos de atomos');
  assert.equal(es.challenge.title, 'Desafio');
});

test('getMessages returns Chinese, French, and Japanese copy', () => {
  const zh = getMessages('zh');
  assert.equal(zh.ui.addElement, '添加元素');
  assert.equal(zh.challenge.title, '挑战');

  const fr = getMessages('fr');
  assert.equal(fr.ui.addElement, 'Ajouter un element');
  assert.equal(fr.challenge.title, 'Defi');

  const ja = getMessages('ja');
  assert.equal(ja.ui.addElement, '元素を追加');
  assert.equal(ja.challenge.title, 'チャレンジ');
});

test('localizeMoleculeName translates known names and falls back for unknown ones', () => {
  assert.equal(localizeMoleculeName('es', 'Water'), 'Agua');
  assert.equal(localizeMoleculeName('es', 'Unknown Molecule'), 'Molecula desconocida');
  assert.equal(localizeMoleculeName('zh', 'Water'), '水');
  assert.equal(localizeMoleculeName('fr', 'Water'), 'Eau');
  assert.equal(localizeMoleculeName('ja', 'Water'), '水');
  assert.equal(localizeMoleculeName('es', 'Custom Name'), 'Custom Name');
});

test('translateStabilityIssue localizes valency issue strings', () => {
  const exceeded = 'O has exceeded its maximum valency (3/2 bonds).';
  const unsatisfied = 'C has unsatisfied valency (2/4 bonds).';

  assert.equal(
    translateStabilityIssue('es', exceeded),
    'O excedio su valencia maxima (3/2 enlaces).',
  );
  assert.equal(
    translateStabilityIssue('es', unsatisfied),
    'C tiene valencia insatisfecha (2/4 enlaces).',
  );
});
