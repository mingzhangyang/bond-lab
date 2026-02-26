import assert from 'node:assert/strict';
import test from 'node:test';
import { getMessages, localizeMoleculeName, translateStabilityIssue } from './i18n.ts';

test('getMessages returns English defaults', () => {
  const en = getMessages('en');
  assert.equal(en.ui.addElement, 'Add Element');
  assert.equal(en.challenge.title, 'Challenge');
  assert.ok(en.ui.controlsList.includes('Hold Shift + drag a single bond to rotate'));
});

test('getMessages returns Spanish copy', () => {
  const es = getMessages('es');
  assert.equal(es.ui.addElement, 'Agregar elemento');
  assert.equal(es.challenge.title, 'Desafio');
});

test('getMessages returns Chinese, French, and Japanese copy', () => {
  const zh = getMessages('zh');
  assert.equal(zh.ui.addElement, '添加元素');
  assert.equal(zh.challenge.title, '挑战');
  assert.ok(zh.ui.controlsList.includes('按住 Shift 并拖动单键可旋转'));

  const fr = getMessages('fr');
  assert.equal(fr.ui.addElement, 'Ajouter un element');
  assert.equal(fr.challenge.title, 'Defi');

  const ja = getMessages('ja');
  assert.equal(ja.ui.addElement, '元素を追加');
  assert.equal(ja.challenge.title, 'チャレンジ');
  assert.ok(ja.ui.controlsList.includes('Shiftを押しながら単結合をドラッグして回転'));
});

test('localizeMoleculeName translates known names and falls back for unknown ones', () => {
  assert.equal(localizeMoleculeName('es', 'Water'), 'Agua');
  assert.equal(localizeMoleculeName('es', 'Unknown Molecule'), 'Molecula desconocida');
  assert.equal(localizeMoleculeName('es', 'Sulfur Dioxide'), 'Dioxido de azufre');
  assert.equal(localizeMoleculeName('zh', 'Water'), '水');
  assert.equal(localizeMoleculeName('zh', 'Phosphorus Trichloride'), '三氯化磷');
  assert.equal(localizeMoleculeName('fr', 'Water'), 'Eau');
  assert.equal(localizeMoleculeName('fr', 'Hydrogen Chloride'), 'Chlorure d hydrogene');
  assert.equal(localizeMoleculeName('ja', 'Water'), '水');
  assert.equal(localizeMoleculeName('ja', 'Hydrogen Sulfide'), '硫化水素');
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
