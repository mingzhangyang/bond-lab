import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

test('preview Worker matches deployed name and uploads without any new DO lifecycle/binding', () => {
  const config = read('wrangler.toml');
  assert.match(config, /^name = "bond-lab"$/m);
  assert.doesNotMatch(config, /^\[\[migrations\]\]|^\[exports\./m);
  assert.doesNotMatch(config, /\[\[durable_objects\.bindings\]\]/);
  assert.match(config, /run_worker_first = \["\/api\/\*"\]/);
});

test('production Worker only references the private owner, never performs lifecycle migration', () => {
  const config = read('wrangler.production.toml');
  assert.match(config, /^name = "bond-lab"$/m);
  assert.doesNotMatch(config, /^\[\[migrations\]\]|^\[exports\./m);
  assert.match(config, /class_name = "PubChemQuota"\s+script_name = "bond-lab-pubchem-quota"/);
  assert.match(config, /run_worker_first = \["\/api\/\*"\]/);
});

test('the separate internal quota Worker exclusively owns the SQLite namespace lifecycle', () => {
  const owner = JSON.parse(read('worker/quota/wrangler.jsonc'));
  assert.equal(owner.name, 'bond-lab-pubchem-quota');
  assert.equal(owner.main, './index.mjs');
  assert.equal(owner.workers_dev, false);
  assert.equal(owner.preview_urls, false);
  assert.deepEqual(owner.exports, { PubChemQuota: { type: 'durable-object', storage: 'sqlite' } });
  assert.equal(owner.routes, undefined);
  assert.doesNotMatch(read('worker/index.mjs'), /export class PubChemQuota/);
});
