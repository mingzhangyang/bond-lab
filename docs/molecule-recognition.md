# Molecule recognition contract

## Ownership

- `moleculeCatalog.ts` is the catalog consumed by recognition and display. It
  combines the 88 existing structure templates with eight hydroxides generated
  from charge-balanced recipes in `data/hydroxides.ts`.
- Each hydroxide recipe owns its identity, five localized names, formula and
  ion notation. One recipe generates the metal-O-H connections and the number
  of OH groups; formula and topology cannot drift independently.
- `moleculeRecognition.ts` owns graph validation, compilation and exact matching.
  `identifier.ts` is the application entry point, not a second implementation.
- `moleculeDisplay.ts` resolves catalog metadata and the existing translations
  and science facts for both the inspector and challenge UI.

Supported new formula units: NaOH, KOH, Mg(OH)2, Ca(OH)2, Al(OH)3, Fe(OH)2,
Fe(OH)3 and Cu(OH)2. Their metal-O lines are simplified associations, not claims
of discrete covalent molecules. Formula-unit models do not receive a molecular
polarity label. Aluminum chloride is explicitly a simplified compound model,
not classified as ionic merely because it contains a metal.

## Recognition pipeline

1. Validate supported elements, unique atom IDs, existing endpoints, distinct
   endpoints, integral bond orders 1-3, and unique undirected edges.
2. Build one sparse adjacency graph per edit and count connected components.
   Empty, isolated and disconnected inventories do not receive a molecular
   formula. A completed molecule plus a loose atom is still disconnected.
3. Find candidate templates using an ID-independent fingerprint of elements,
   neighboring elements and bond orders. Templates are compiled only once.
4. Run exact labeled graph isomorphism within that bucket. A fingerprint is
   only a filter; two non-isomorphic graphs can share a fingerprint.
5. Return an explicit status: `empty`, `incomplete`, `invalid`, `disconnected`,
   `unknown`, `ambiguous`, or `recognized`. Multiple matches do not silently
   choose the first catalog entry. The public match-or-null API remains usable
   by existing consumers.

Unrecognized connected structures receive an elemental composition, not an
inferred chemical name. The fallback uses Hill ordering (C, H, then alphabetic;
fully alphabetic without carbon). For example, an unrecognized Ca/H/O structure
is `CaH2O2`, not a claim that it is calcium hydroxide. Only the correct two OH
branches match `Calcium Hydroxide` and its curated formula `Ca(OH)2`.

## Editor and challenge consistency

Catalog compilation also checks whether each template can be assembled through
incremental single-bond creation and upgrades using the editor's bonding rules.
Only buildable templates within the challenge atom limit are eligible. An empty
eligible pool returns no challenge; it never falls back to an oversized or
unbuildable target.

CO and the two O=O-O resonance representations of ozone use narrowly scoped
connected-component rules. Oxygen's ordinary limit is still two. Unrelated
loose atoms do not revoke an exception, while extending the component can.
Add, upgrade and undo validate all affected graph constraints, not just the two
selected endpoints, so an attachment cannot leave a third atom overfilled.

## Validation

Run `npm run verify` and `npm run test:e2e` in a full checkout.

- `moleculeRecognition.test.ts`: malformed/disconnected input, wrong hydroxide
  topology, ID collisions, ordering invariance, fingerprint collisions,
  ambiguous templates and immutable compilation snapshots.
- `bondingRecognition.test.ts`: scoped CO/ozone exceptions and rejection of
  overfilled water, extended oxygen chains and double-double ozone.
- `storeRecognition.test.ts`: real editor actions, all 24 calcium-hydroxide
  bond insertion orders, removal/undo and third-atom constraint invalidation.
- `moleculeCatalog.test.ts`: every catalog entry must recognize under relabeling,
  assemble through the production editor in both bond orders. Adding a template
  adds its contract test automatically.
- `moleculeDisplay.test.ts`: catalog names/metadata in all languages and
  calcium-hydroxide identity, formula and non-applicable molecular polarity.
- `challengeTargets.test.ts`: buildability and size filtering, empty pools, and
  eligibility of calcium hydroxide and ozone.
- `e2e/molecule-recognition.spec.ts`: English/Chinese inspector and challenge
  integration at 390px and 1280px, including incomplete builds and removal/undo.

## Scientific boundaries

This is an offline, curated educational recognizer, not a universal chemical
naming service. It matches explicit atoms, connectivity and bond orders. It does
not infer missing hydrogen atoms, solve arbitrary charge/resonance systems,
identify crystal structures, or determine stereochemistry from 3D positions.
Existing labels such as D-Glucose and Fumaric Acid are template labels, not proof
of stereochemical identity. Stability/energy scores remain separate simplified
heuristics and are not used as evidence of chemical identity or feasibility.

References for the model boundary:
- IUPAC Gold Book, molecular graph: https://goldbook.iupac.org/terms/view/MT07069
- PubChem, calcium hydroxide: https://pubchem.ncbi.nlm.nih.gov/compound/Calcium-hydroxide
