# PRINCIPLES
- **Test Driven Development**: Write tests before implementing features to ensure code reliability and maintainability.
- **Modularity**: Design agents as modular components that can be easily integrated and reused.
- **Occam's Razor**: Prefer simpler solutions over complex ones, avoiding unnecessary complexity in agent design.


# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React + TypeScript app. Keep feature code inside `src/`.

- `src/main.tsx`: app bootstrap and global CSS import.
- `src/App.tsx`: top-level page container.
- `src/components/`: UI and 3D scene components (`Scene`, `UI`, `AtomNode`, `BondNode`, etc.).
- `src/store.ts`: central Zustand state and actions.
- `src/physics.ts`, `src/stability.ts`, `src/identifier.ts`: simulation and molecule logic.
- `src/index.css`: global styles.
- Root config: `vite.config.ts`, `tsconfig.json`, `package.json`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start local dev server on port `3000`.
- `npm run build`: create production bundle in `dist/`.
- `npm run preview`: preview production build locally.
- `npm run lint`: TypeScript type-check (`tsc --noEmit`).
- `npm run clean`: remove `dist/`.

Set `GEMINI_API_KEY` in `.env.local` before running locally.

## Coding Style & Naming Conventions
- Use TypeScript and React function components.
- Follow existing formatting: 2-space indentation, single-quote imports, and semicolon-terminated statements.
- Component files use `PascalCase` (for example, `ChallengeMode.tsx`).
- Logic/state modules use concise lowercase names (for example, `physics.ts`, `store.ts`).
- Use clear state/action names in Zustand (`addAtom`, `removeBond`, `startChallenge`).
- Prefer the configured alias `@` for root-relative imports when it improves readability.

## Testing Guidelines
There is no automated test suite configured yet. Minimum validation before a PR:

- Run `npm run lint`.
- Run `npm run build`.
- Manually verify core flows in the browser: add/remove atoms, create/upgrade/remove bonds, and challenge mode behavior.

If you add tests, colocate as `*.test.ts`/`*.test.tsx` near the related module.

## Commit & Pull Request Guidelines
Use Conventional Commit style, consistent with repo history:

- `feat: Add molecule identification and challenge mode`
- `feat(UI): Add settings and theme toggle buttons`

PRs should include:

- concise summary of behavior changes,
- linked issue/task (if applicable),
- verification steps run locally,
- screenshots or short GIFs for UI/interaction changes.

## Security & Configuration Tips
- Never commit real secrets; keep them in `.env.local`.
- Keep `.env.example` updated when adding new required environment variables.
