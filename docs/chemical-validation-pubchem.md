# Chemistry checking and PubChem lookup

This extends PR #8's *offline exact graph recognizer*, not replaces it.

## Boundaries and flow

- The editor is always local. It still requires a single connected, correctly
  linked atom inventory before displaying a molecule or compound formula.
- For an unrecognized, connected inventory the player can explicitly press
  **Check structure / PubChem**; no PubChem request happens on initial load, on
  each bond mutation, in challenge mode, or for built-in recognized molecules.
- `chemical/structure.ts` exports explicit bracketed atoms with **no inferred H**.
  Rings are preserved; the export is bounded by size and bond count. Optional
  `formalCharge`/`isotope` metadata is distinct from editor element identity.
- A known, exact-match ionic formula unit is converted to its ions: for example
  H-O-Ca-O-H becomes `[Ca+2].[O-][H].[O-][H]`. Connectors are illustrative,
  **not covalent Ca-O bonds**. Any unknown metal bonding, or simplified AlCl3,
  is refused unless the necessary representation is explicit. No arbitrary
  ionic identity is inferred from element counts.
- Browser-local RDKit.js `2026.9.1` is loaded in a separate worker **on demand**;
  the WASM asset is built with Vite and served from the same origin, not a CDN.
  Sanitization must succeed, the original explicit atom count must survive
  parsing, and every WASM molecule is disposed. A parsed structure is not
  proof of stability, existence, unique naming or stereochemical identity.
- After successful local parsing, the browser POSTs sanitized SMILES to the
  same-origin `/api/pubchem/identity`. It never sends a name or formula.
  The Worker makes a fixed **fastidentity** request using
  `identity_type=same_stereo_isotope`, not similarity or formula search.
  Ambiguous responses are not force-picked. PubChem normalization can change
  charge/protonation representation, so returned names remain **supplemental**
  and never overwrite BondLab's local identity or challenge state.

## Operational safeguards

- A fixed same-origin gateway accepts only bounded JSON with SMILES (never an
  arbitrary URL). It validates Origin, enforces deadlines, and reads at most
  32 KiB from each PubChem response.
- A single, independently deployed, private Durable Object enforces a **global
  rolling limit of four actual PubChem HTTP requests per second**, including
  the follow-up CID properties request. It persists permits using SQLite
  storage and survives process restarts.
- Every upstream HTTP request requires a fresh permit. Quota denial returns
  HTTP 429; missing/unavailable quota returns 503. Neither gets cached or
  converted to a false 'invalid molecule' conclusion.
- Successful identities, explicit misses and ambiguous outcomes use separate
  cache lifetimes. Real upstream errors are never cached as misses.
- Only the chemical structure string is sent upstream. No browser cookies,
  credentials, app state or personal data is attached to that request.
- Network failures never stop normal game editing. Edits invalidate any
  in-flight response, so obsolete results cannot overwrite the next structure.

## Cloudflare deployment and check failure (2026-10-22)

The original pull request failed its *Cloudflare Workers Builds* check, although
unit, type, build and targeted browser tests passed. The non-production
Cloudflare trigger executes `npm run build` and `wrangler versions upload`.
The old application config incorrectly owned a **new** Durable Object migration
and called itself `bondlab` while the connected deployment is named
`bond-lab`. Cloudflare refuses to apply object migrations during versions
upload and warned about the Worker-name mismatch.

The migration is now isolated from the application:

- `wrangler.toml` is the preview/branch-build config. It uses the correct
  `bond-lab` name and carries **no Durable Object binding or migration**.
  A preview may browse/edit molecules but its optional PubChem query returns
  503 instead of bypassing global quota enforcement.
- `worker/quota/wrangler.jsonc` declares the *separate* private Worker
  `bond-lab-pubchem-quota`, which alone owns and provisions the persistent
  `PubChemQuota` SQLite class. The policy and implementation live under
  `worker/quota/`. No external route or workers.dev URL is exposed.
- `wrangler.production.toml` references that external class by
  `script_name` and performs **no lifecycle migration** in the main app.

### Required one-time setup and release order

The connected Cloudflare authorization currently cannot write Worker Scripts
(the API returns 403 and requests Workers Scripts Write or Editor scope).
The private quota Worker therefore has **not** been provisioned, and neither
the production app nor its PubChem endpoint should be considered deployed.

1. With a properly scoped Cloudflare credential, **deploy the private quota
   Worker first**:

   ```sh
   npm ci
   npx wrangler deploy --config worker/quota/wrangler.jsonc
   ```

   Confirm that `PubChemQuota` exists in that Worker and that neither a
   public route nor a workers.dev subdomain is enabled.

2. Verify the main application's **production** deployment configuration,
   separate from non-production's `wrangler versions upload`:

   ```sh
   npx wrangler deploy --dry-run --config wrangler.production.toml
   ```

   After checking against live Cloudflare bindings, arrange for production
   deployment to use `wrangler.production.toml`. The separate quota owner
   should remain independently managed. Do **not** make every preview use
   `wrangler deploy` or silently remove the fail-closed quota requirement.

3. Verify real PubChem identity requests and the actual production route
   after deployment. A green static check proves only the preview build is
   compatible with `versions upload`, not that the private quota Worker exists.

## Testing

```sh
npm ci
npm run verify
node --test worker/*.test.mjs
npm run test:e2e
```

Tests cover exact identity, ionic exports, origin filtering, ambiguous results,
timeouts, rate-limit failures, cache-hit behavior, rolling-window persistence,
restarts, Cloudflare preview/production config separation and browser opt-in.
The production path intentionally stays blocked until provisioning is complete.

Neither RDKit sanitization nor PubChem identity search is a thermodynamic
stability estimator. We intentionally do not classify a failed lookup as
an invalid molecule.
