import assert from 'node:assert/strict';
import test from 'node:test';
import app, { handleIdentity, PubChemQuota } from './index.mjs';

const request = (data = { smiles: '[O]([H])[H]' }, options = {}) => new Request(
  'https://example.com/api/pubchem/identity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://example.com', ...options.headers },
    body: JSON.stringify(data),
  },
);
const env = {
  PUBCHEM_QUOTA: { idFromName: () => 'global', get: () => ({ fetch: async () => new Response(null, { status: 204 }) }) },
};
const good = (value) => new Response(JSON.stringify(value), { status: 200, headers: { 'Content-Type': 'application/json' } });

test('valid structure performs fixed identity POST then property GET and never returns upstream URLs', async () => {
  const urls = [];
  const fetcher = async (url, options) => {
    urls.push([url, options]);
    if (urls.length === 1) return good({ IdentifierList: { CID: [962] } });
    return good({ PropertyTable: { Properties: [{
      CID: 962, IUPACName: 'oxidane', MolecularFormula: 'H2O',
    }] } });
  };
  const response = await handleIdentity(request(), env, { fetcher, cache: null });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'matched', cid: 962, iupacName: 'oxidane', molecularFormula: 'H2O' });
  assert.equal(urls.length, 2);
  assert.match(urls[0][0], /^https:\/\/pubchem\.ncbi\.nlm\.nih\.gov\/rest\/pug\/compound\/fastidentity/);
  assert.match(urls[0][1].body, /smiles=/);
  assert.equal(urls[0][1].method, 'POST');
  assert.match(urls[1][0], /\/cid\/962\/property\//);
});

test('not-found remains distinguishable from service failures', async () => {
  const missing = await handleIdentity(request(), env, { fetcher: async () => new Response(null, { status: 404 }), cache: null });
  assert.deepEqual(await missing.json(), { status: 'not_found' });
  const offline = await handleIdentity(request(), env, { fetcher: async () => new Response(null, { status: 503 }), cache: null });
  assert.equal(offline.status, 503);
  assert.deepEqual(await offline.json(), { status: 'unavailable' });
});

test('ambiguous PubChem identities never silently select the first candidate', async () => {
  const res = await handleIdentity(request(), env, { fetcher: async () => good({ IdentifierList: { CID: [1, 2] } }), cache: null });
  assert.deepEqual(await res.json(), { status: 'ambiguous' });
});

test('validation blocks cross-origin use, oversized payloads and arbitrary fields', async () => {
  const wrongOrigin = await handleIdentity(request(undefined, { headers: { Origin: 'https://attacker.test' } }), env, { cache: null });
  assert.equal(wrongOrigin.status, 403);
  const wrongSmiles = await handleIdentity(request({ smiles: 'https://evil.com' }), env, { cache: null });
  assert.equal(wrongSmiles.status, 400);
  const large = await handleIdentity(request({ smiles: 'C'.repeat(1400) }), env, { cache: null });
  assert.equal(large.status, 400);
});

test('fails closed without a global rate-limit binding; quota allows at most two lookups per second', async () => {
  const missing = await handleIdentity(request(), {}, { cache: null });
  assert.equal(missing.status, 503);
  const quota = new PubChemQuota();
  assert.equal((await quota.fetch()).status, 204);
  assert.equal((await quota.fetch()).status, 204);
  assert.equal((await quota.fetch()).status, 429);
});

test('route does not return SPA for unknown API paths', async () => {
  const res = await app.fetch(new Request('https://example.com/api/missing'), env);
  assert.equal(res.status, 404);
});
