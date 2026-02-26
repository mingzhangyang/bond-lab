# BondLab

BondLab is an interactive 3D molecule builder built with React, TypeScript, and React Three Fiber.  
It is designed for chemistry learning: build molecules, inspect bond behavior, and get instant feedback on identity, stability, and polarity.

## Features

- 3D molecule sandbox with draggable atoms.
- Core elements: Hydrogen (`H`), Carbon (`C`), Nitrogen (`N`), Oxygen (`O`).
- Bond building with chemistry constraints (single/double/triple bond order and valency limits).
- Bond rotation interaction for rotatable single bonds (`Shift + drag`).
- Molecule identification from known structure templates plus fallback formula display.
- Stability scoring with bond energy and valency/geometry checks.
- Polarity classification (`polar`, `nonpolar`, or `unknown`) from geometry and electronegativity.
- Timed Challenge Mode with randomized target molecules.
- Theme toggle (light/dark), multilingual UI (`en`, `es`, `zh`, `fr`, `ja`), and persisted preferences.

## Quick Start

### Prerequisites

- Node.js
- npm

### Install and Run

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000`.

## Environment Variables

An `.env.example` file exists with:

- `GEMINI_API_KEY`
- `APP_URL`

Current frontend code does not read these values directly at runtime, but they may be required by your hosting/runtime integration workflow.

## Scripts

- `npm run dev`: Start Vite dev server on port `3000`.
- `npm run build`: Build production assets into `dist/`.
- `npm run preview`: Preview the production build.
- `npm run lint`: Type-check with `tsc --noEmit`.
- `npm run test`: Run unit tests in `src/*.test.ts`.
- `npm run clean`: Remove `dist/`.

## Controls

- Add atoms from the element panel.
- Build mode: click one atom, then another atom to create or upgrade a bond.
- Build mode: drag an atom to reposition it.
- Build mode: release a dragged atom near another atom to auto-create a bond.
- Build mode: `Shift + drag` on a single bond to rotate connected geometry.
- Delete mode: click atoms or bonds to remove them.
- Delete mode: right-click on an atom or bond to remove it.
- Camera: drag background to orbit.
- Camera: scroll or pinch to zoom.

## Known Molecules

The identifier currently includes:

- Water (`H2O`)
- Methane (`CH4`)
- Carbon Dioxide (`CO2`)
- Ammonia (`NH3`)
- Ethane (`C2H6`)
- Ethene (`C2H4`)
- Ethyne (`C2H2`)
- Oxygen (`O2`)
- Nitrogen (`N2`)
- Hydrogen (`H2`)
- Methanol (`CH3OH`)
- Ethanol (`C2H5OH`)
- Formaldehyde (`CH2O`)
- Hydrogen Cyanide (`HCN`)

## Project Structure

- `src/components/`: UI and 3D scene components (`Scene`, `UI`, `AtomNode`, `BondNode`, `ChallengeMode`).
- `src/store.ts`: Zustand state and actions for atoms, bonds, and game/challenge state.
- `src/physics.ts`: Position simulation and transform synchronization.
- `src/identifier.ts`: Molecule template matching and formula fallback.
- `src/stability.ts`: Stability score and issue reporting.
- `src/polarity.ts`: Polarity calculation.
- `src/i18n.ts`: Localization strings and molecule name localization.

## Validation

Before submitting changes, run:

```bash
npm run test
npm run lint
npm run build
```

Then manually verify:

- Add/remove atoms
- Create/upgrade/remove bonds
- Bond rotation
- Challenge mode flow
