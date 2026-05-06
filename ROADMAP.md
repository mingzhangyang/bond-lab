# BondLab Roadmap

This roadmap tracks current, not historical, priorities.

## 1. Stabilize Runtime Architecture

### Goal
Keep gameplay behavior stable while reducing coupling across state, simulation, and UI modules.

### Planned Scope
- Continue splitting large components into focused modules (`settings`, `element controls`, `molecule inspector`).
- Keep store logic in dedicated slices (`molecule`, `preferences`, `challenge`) with clear ownership.
- Maintain compatibility with existing actions used by scene and interaction components.

### Definition of Done
- No behavior regressions in build/delete/challenge flows.
- Unit tests pass and cover touched logic.
- Component/module boundaries are documented in code comments or file naming.

## 2. Expand Browser-Level Coverage

### Goal
Catch UI and navigation regressions that unit tests cannot detect.

### Planned Scope
- Keep core Playwright flows for route navigation and gameplay state changes.
- Add tests for add/remove atoms, bond upgrade/removal, challenge start/complete/fail, and mobile drawer behaviors.
- Run Playwright in CI using Chromium.

### Definition of Done
- `npm run test:e2e` is green locally and in CI.
- Critical user paths have deterministic coverage.
- Failing tests provide actionable diagnostics.

## 3. Improve Bundle Discipline

### Goal
Reduce risk of bundle-size regressions while keeping startup performance predictable.

### Planned Scope
- Track bundle output with `npm run bundle:report`.
- Keep vendor chunking explicit in `vite.config.ts`.
- Investigate additional code-splitting for heavy chemistry/template data paths.

### Definition of Done
- Bundle reports are produced for release candidates.
- Any chunk growth is reviewed before merge.
- Large dependency additions include impact notes.

## 4. Refine Mobile UX

### Goal
Keep core molecule and challenge interactions comfortable on small touch screens.

### Planned Scope
- Tune layout spacing and control density on narrow viewports.
- Ensure tap targets remain accessible under safe-area constraints.
- Improve challenge drawer discoverability and completion flow.

### Definition of Done
- Core interactions remain reachable without overlap/clipping.
- Manual mobile QA checklist is run for portrait and landscape.
- E2E tests cover at least one mobile viewport scenario.

## 5. Chemistry and Learning Fidelity

### Goal
Increase educational value while keeping rules understandable and deterministic.

### Planned Scope
- Expand known molecule coverage and challenge target balance.
- Improve explanatory text for polarity and stability outcomes.
- Keep chemical constraints and special cases fully test-backed.

### Definition of Done
- New chemistry behavior has tests first (TDD).
- Existing molecule identification and challenge logic remain stable.
- User-facing copy stays consistent across languages.

## Release Checklist

Before release:

1. `npm run verify`
2. `npm run test:e2e`
3. Manual gameplay and mobile sanity check
