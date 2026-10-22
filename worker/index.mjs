// Fixed-endpoint, same-origin PubChem gateway. Never accepts an upstream URL,
// credentials, a chemical name, or a loose molecular formula from callers.
const PUBCHEM = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const MAX_INPUT = 2200;
const MAX_UPSTREAM = 32_768;
const VALID_SMILES = /^[a-zA-Z0-9+\-\[\]()=#$%\\/.@:*,]+$/;

function json(body, status = 200, ttl = 0) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': ttl ? `public, max-age=${ttl}` : 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function limitedText(body, maxBytes) {
  if (!body) return '';
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let length = 0;
  let text = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) throw new Error('body_too_large');
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

async function responseJson(response) {
  if (Number(response.headers.get('Content-Length')) > MAX_UPSTREAM) throw new Error('too_large');
  return JSON.parse(await limitedText(response.body, MAX_UPSTREAM));
}

async function upstream(url, init, fetcher) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 8000);
  try {
    return await fetcher(url, { ...init, signal: abort.signal, redirect: 'error' });
  } finally {
    clearTimeout(timer);
  }
}

export class PubChemQuota {
  constructor() {
    this.second = -1;
    this.count = 0;
  }

  async fetch() {
    const second = Math.floor(Date.now() / 1000);
    if (second !== this.second) {
      this.second = second;
      this.count = 0;
    }
    // Each successful identity search makes at most two upstream requests.
    if (this.count >= 2) return new Response(null, { status: 429 });
    this.count++;
    return new Response(null, { status: 204 });
  }
}

export async function handleIdentity(request, env, dependencies = {}) {
  if (request.method !== 'POST') return json({ status: 'error', reason: 'method_not_allowed' }, 405);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json({ status: 'error', reason: 'forbidden_origin' }, 403);
  }
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    return json({ status: 'error', reason: 'unsupported_type' }, 415);
  }
  if (Number(request.headers.get('Content-Length')) > MAX_INPUT) {
    return json({ status: 'error', reason: 'payload_too_large' }, 413);
  }
  let body;
  try {
    const raw = await limitedText(request.body, MAX_INPUT);
    body = JSON.parse(raw);
  } catch {
    return json({ status: 'error', reason: 'invalid_payload' }, 400);
  }
  const smiles = body?.smiles;
  if (typeof smiles !== 'string' || smiles.length < 3 || smiles.length > 1200
    || !VALID_SMILES.test(smiles)) {
    return json({ status: 'error', reason: 'invalid_structure_encoding' }, 400);
  }

  const keyData = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(smiles));
  const hash = Array.from(new Uint8Array(keyData), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const cacheKey = new Request(`https://bondlab-cache.invalid/pubchem/v1/${hash}`);
  const cache = dependencies.cache === undefined ? globalThis.caches?.default : dependencies.cache;
  const cached = await cache?.match(cacheKey);
  if (cached) return cached;

  // A single named DO enforces an account-wide budget, not a per-isolate guess.
  // If it is unavailable, fail closed rather than risking PubChem abuse.
  if (!env.PUBCHEM_QUOTA) return json({ status: 'unavailable' }, 503);
  const stub = env.PUBCHEM_QUOTA.get(env.PUBCHEM_QUOTA.idFromName('global'));
  let permit;
  try {
    permit = await stub.fetch('https://quota.invalid/permit');
  } catch {
    return json({ status: 'unavailable' }, 503);
  }
  if (!permit.ok) return json({ status: 'unavailable', reason: 'rate_limited' }, 429);

  const fetcher = dependencies.fetcher ?? fetch;
  try {
    const identityUrl = `${PUBCHEM}/compound/fastidentity/smiles/cids/JSON?identity_type=same_stereo_isotope&MaxRecords=3`;
    const response = await upstream(identityUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({ smiles }).toString(),
    }, fetcher);
    let output;
    if (response.status === 404) {
      output = json({ status: 'not_found' }, 200, 1800);
    } else {
      if (!response.ok) return json({ status: 'unavailable' }, 503);
      const identity = await responseJson(response);
      const cids = identity?.IdentifierList?.CID;
      if (!Array.isArray(cids)) return json({ status: 'unavailable' }, 503);
      if (cids.length === 0) output = json({ status: 'not_found' }, 200, 1800);
      else if (cids.length > 1) output = json({ status: 'ambiguous' }, 200, 900);
      else {
        const cid = cids[0];
        if (!Number.isSafeInteger(cid) || cid <= 0) return json({ status: 'unavailable' }, 503);
        const propertyUrl = `${PUBCHEM}/compound/cid/${cid}/property/MolecularFormula,IUPACName/JSON`;
        const details = await upstream(propertyUrl, { headers: { Accept: 'application/json' } }, fetcher);
        if (!details.ok) return json({ status: 'unavailable' }, 503);
        const property = (await responseJson(details))?.PropertyTable?.Properties?.[0];
        if (typeof property?.IUPACName !== 'string' || typeof property?.MolecularFormula !== 'string') {
          return json({ status: 'unavailable' }, 503);
        }
        output = json({
          status: 'matched', cid,
          iupacName: property.IUPACName.slice(0, 200),
          molecularFormula: property.MolecularFormula.slice(0, 100),
        }, 200, 86400);
      }
    }
    if (cache && output.ok) {
      await cache.put(cacheKey, output.clone()).catch(() => {});
    }
    return output;
  } catch {
    return json({ status: 'unavailable' }, 503);
  }
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === '/api/pubchem/identity') {
      return handleIdentity(request, env);
    }
    return json({ status: 'error', reason: 'not_found' }, 404);
  },
};
