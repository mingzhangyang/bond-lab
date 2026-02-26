# BondLab Roadmap

This roadmap defines the next implementation priorities for BondLab.

## 1. Add More Types of Atom

### Goal
Expand beyond `H`, `C`, `N`, and `O` with additional chemistry-relevant atoms.

### Planned Scope
- Add `S` (Sulfur), `P` (Phosphorus), and common halogens (`F`, `Cl`) first.
- Extend element metadata in `src/chemistry.ts` for color, valence/max bonds, van der Waals radius, covalent radius, and electronegativity.
- Update UI atom picker in `src/components/UI.tsx`.
- Update i18n labels in `src/i18n.ts`.

### Definition of Done
- New atoms can be added in the UI.
- Bonding rules work with valency constraints.
- Related tests are added/updated before implementation (TDD).

## 2. Add More Molecules to Challenge Mode

### Goal
Increase challenge variety and improve replay value.

### Planned Scope
- Extend known molecule templates in `src/identifier.ts`.
- Add molecule info cards in `src/moleculeInfo.ts`.
- Ensure challenge target selection includes new molecules.
- Tune challenge timer formula for larger molecules.

### Definition of Done
- Challenge mode can target all newly added molecules.
- Win/loss detection remains accurate for complex topologies.
- Identification tests cover each newly added challenge molecule.

## 3. Add a Privacy Page

### Goal
Provide a clear, user-facing privacy policy page.

### Planned Scope
- Create a `Privacy` page component.
- Add a visible entry point from the UI (or footer/menu).
- Include sections for data collected/stored, localStorage usage (theme/language/preferences), external service usage (if/when enabled), and contact/update policy.

### Definition of Done
- Privacy page is reachable in both desktop and mobile layouts.
- Content is readable and versioned in the repo.
- Page is included in build and verified manually.

## 4. Enhance the Chemistry

### Goal
Improve realism and educational value of simulation and feedback.

### Planned Scope
- Improve molecule recognition coverage and topology handling.
- Refine stability scoring with angle strain weighting plus valency penalties and messaging.
- Improve polarity model and explanations.
- Continue bond behavior improvements (rotation limits, constraints).
- Expand chemistry tests for identifier, stability, polarity, and rotation/bond rules.

### Definition of Done
- Existing chemistry features remain stable.
- New chemistry behavior is covered by tests first (TDD).
- Manual validation confirms no regression in build/delete/challenge flows.

## 5. More Rounds of Review

### Goal
Raise quality through repeated structured reviews.

### Planned Review Cycle
- Round 1: feature correctness and regressions.
- Round 2: code quality and modularity.
- Round 3: UX/content consistency (including i18n and accessibility).
- Round 4: final release readiness (`test`, `lint`, `build`, manual QA).

### Definition of Done
- Each round has tracked findings and fixes.
- High-severity issues are resolved before release.
- Final checklist is complete: `npm run test`, `npm run lint`, `npm run build`, plus manual verification of core interactions.

## 6. Fine Tune Mobile Browser UI/UX

### Goal
Improve usability, clarity, and touch interaction quality on mobile browsers.

### Planned Scope
- Refine layout spacing and hierarchy for small screens in `src/components/UI.tsx` and related CSS.
- Improve tap target sizes and interaction affordances for core controls (atom add/remove, bond actions, challenge controls).
- Tune typography and panel behavior to reduce overlap/clipping in portrait mode.
- Verify interaction flow and readability across common mobile viewport sizes.

### Definition of Done
- Core flows are comfortable to use on mobile: add/remove atoms, create/upgrade/remove bonds, and challenge mode.
- No major overlap, clipping, or off-screen control issues on tested mobile breakpoints.
- Manual QA checklist includes mobile browser validation for both portrait and landscape.

## Execution Order

1. Add more atom types.
2. Extend molecule library and challenge mode.
3. Deliver privacy page.
4. Ship chemistry enhancements in iterative slices.
5. Fine tune mobile browser UI/UX.
6. Run multiple review rounds before release.
