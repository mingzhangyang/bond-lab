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

- The endpoint accepts a bounded JSON body and a restricted SMILES character
  alphabet, checks Origin, never accepts caller-supplied URLs and has request
  timeouts / bounded upstream response sizes.
- A **single global Durable Object** enforces at most two lookups per second;
  each lookup uses at most two PubChem REST requests (4 requests/s). The
  gateway **fails closed** if that quota binding is unavailable.
- Positive, negative and ambiguous results have separate bounded cache TTLs.
  Real PubChem outages, 429 responses and invalid payloads are never cached
  as a negative structural result.
- Only the chemical string is submitted. The gateway sends no cookies,
  API keys, user identifiers, personal data or application state upstream.
- A declined/failed lookup does not disable the editor. Edits made while a
  query is running invalidate its result and abort any in-flight HTTP request.
- Deploying requires Wrangler static assets plus the `PUBCHEM_QUOTA`
  Durable Object binding/migration defined in `wrangler.toml`. This is an
  infrastructure change, **not** just a Vite static upload.

## Testing

```sh
npm ci
npm run verify
npm run test:e2e
npm run cf:dev    # local Worker with /api routing (if Wrangler is installed)
```

Tests cover all hydroxide export charges/partitions, explicit hydrogen counts,
ring closures, unsupported metal graphs, invalid inventories, origin validation,
bounded/failed upstream requests, ambiguous responses and quota behavior.
Browser coverage asserts that lookup remains opt-in and is not shown for water.

Neither RDKit sanitization nor PubChem identity search is a thermodynamic
stability estimator. We intentionally do not classify a failed lookup as
an invalid molecule.
