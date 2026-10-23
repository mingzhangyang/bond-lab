import assert from 'node:assert/strict';
import test from 'node:test';
import app, { handleIdentity } from './index.mjs';

const request = (data = { smiles: '[O]([H])[H]' }, options = {}) => new Request(
  'https://example.com/api/pubchem/identity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://example.com', ...options.headers },
    body: JSON.stringify(data),
  },
);
const quotaEnv = (permit) => ({
  PUBCHEM_QUOTA: { idFromName: () => 'global', get: () => ({ fetch: permit }) },
});
const env = quotaEnv(async () => new Response(null, { status: 204 }));
const good = (value) => new Response(JSON.stringify(value), { status: 200, headers: { 'Content-Type': 'application/json' } });

test('valid structure performs fixed identity POST then property GET and charges both requests', async () => {
  const urls = [];
  let permits = 0;
  const fetcher = async (url, options) => {
    urls.push([url, options]);
    assert.equal(permits, urls.length, 'each outgoing request must have its own permit');
    if (urls.length === 1) return good({ IdentifierList: { CID: [962] } });
    return good({ PropertyTable: { Properties: [{
      CID: 962, IUPACName: 'oxidane', MolecularFormula: 'H2O',
    }] } });
  };
  const counted = quotaEnv(async (_, init) => {
    assert.equal(init.method, 'POST');
    permits++;
    return new Response(null, { status: 204 });
  });
  const response = await handleIdentity(request(), counted, { fetcher, cache: null });
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

test('missing or unavailable quota fails closed without contacting PubChem', async () => {
  let calls = 0;
  const dependencies = { cache: null, fetcher: async () => { calls++; return good({}); } };
  for (const binding of [{}, quotaEnv(async () => { throw new Error('offline'); }),
    quotaEnv(async () => new Response(null, { status: 503 }))]) {
    const response = await handleIdentity(request(), binding, dependencies);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { status: 'unavailable' });
  }
  assert.equal(calls, 0);
});

test('quota denial on the second request is never cached as a molecular miss', async () => {
  let permits = 0;
  let calls = 0;
  let writes = 0;
  const binding = quotaEnv(async () => new Response(null, { status: ++permits === 1 ? 204 : 429 }));
  const response = await handleIdentity(request(), binding, {
    fetcher: async () => { calls++; return good({ IdentifierList: { CID: [962] } }); },
    cache: { match: async () => undefined, put: async () => { writes++; } },
  });
  assert.equal(response.status, 429);
  assert.deepEqual(await response.json(), { status: 'unavailable', reason: 'rate_limited' });
  assert.equal(calls, 1);
  assert.equal(writes, 0);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('cached identities do not consume quota or upstream requests', async () => {
  let calls = 0;
  const result = { status: 'not_found' };
  const response = await handleIdentity(request(), {}, {
    cache: { match: async () => good(result) },
    fetcher: async () => { calls++; return good({}); },
  });
  assert.deepEqual(await response.json(), result);
  assert.equal(calls, 0);
});

test('route does not return SPA for unknown API paths', async () => {
  const res = await app.fetch(new Request('https://example.com/api/missing'), env);
  assert.equal(res.status, 404);
});
