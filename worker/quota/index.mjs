import { DurableObject } from 'cloudflare:workers';
import { initializeQuota, takePermit } from './policy.mjs';

export class PubChemQuota extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    initializeQuota(this.ctx.storage.sql);
  }

  async fetch(request) {
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/permit') {
      return new Response(null, { status: 404 });
    }
    const allowed = takePermit(this.ctx.storage.sql);
    return new Response(null, {
      status: allowed ? 204 : 429,
      headers: allowed ? { 'Cache-Control': 'no-store' }
        : { 'Cache-Control': 'no-store', 'Retry-After': '1' },
    });
  }
}

// Infrastructure-only Worker: no public API, routes or upstream network calls.
export default {
  async fetch() {
    return new Response(null, { status: 404 });
  },
};
