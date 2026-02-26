import assert from 'node:assert/strict';
import test from 'node:test';
import { getMessages, localizeMoleculeName, translateStabilityIssue } from './i18n.ts';

test('getMessages returns English defaults', () => {
  const en = getMessages('en');
  assert.equal(en.ui.addElement, 'Add Element');
  assert.equal(en.challenge.title, 'Challenge');
});

test('getMessages returns Spanish copy', () => {
  const es = getMessages('es');
  assert.equal(es.ui.addElement, 'Agregar elemento');
  assert.equal(es.challenge.title, 'Desafio');
});

test('localizeMoleculeName translates known names and falls back for unknown ones', () => {
  assert.equal(localizeMoleculeName('es', 'Water'), 'Agua');
  assert.equal(localizeMoleculeName('es', 'Unknown Molecule'), 'Molecula desconocida');
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
