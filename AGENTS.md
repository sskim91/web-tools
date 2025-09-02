# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages (e.g., `src/app/discount-calculator/page.tsx`).
- `src/components`: Reusable React components (PascalCase filenames).
- `src/hooks`: Custom hooks (prefix with `use`).
- `src/utils`: Pure utilities (mirrored tests in `test/utils`).
- `src/styles`: Global and page/component CSS (`globals.css`, `variables.css`, `styles/pages/*`).
- `public`: Static assets.
- `test`: Vitest + Testing Library setup (`test/setup.ts`) and specs under `test/pages` and `test/utils`.
- Path aliases: `@`, `@/src`, `@/components`, `@/styles`, `@/utils`, `@/hooks`.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js dev server with HMR.
- `npm run build`: Production build.
- `npm start`: Run built app.
- `npm run lint`: Lint with ESLint.
- `npm test`: Run Vitest in watch mode.
- `npm run test:run`: CI-friendly test run.
- `npm run test:ui`: Vitest UI runner.
- `npm run test:coverage`: Generate coverage report.

## Coding Style & Naming Conventions
- TypeScript, ESM, strict mode; 2-space indentation.
- React function components; filenames PascalCase (`Header.tsx`).
- Hooks: camelCase and `use` prefix (`useDebounce.ts`).
- Routes/folders: kebab-case under `src/app/*`.
- Utilities: camelCase functions in `src/utils/*` with unit tests.
- Imports: prefer aliases (e.g., `import { calc } from '@/utils/calculations'`).

## Testing Guidelines
- Frameworks: Vitest + React Testing Library (`jsdom`).
- File names: `*.test.ts` or `*.test.tsx` under `test/**` mirroring source domain.
- Run: `npm run test:run` locally; add `npm run test:coverage` before PRs.
- Style: test behavior and accessibility (queries by role/text), avoid implementation details.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits preferred (e.g., `feat: add discount calculator`, `fix: correct average formula`, `docs: update README`). Keep messages imperative and scoped.
- PRs: concise description, linked issues (`Closes #123`), screenshots/GIFs for UI, test plan, and coverage if relevant. Keep diffs focused; update tests when changing behavior.

## Security & Configuration
- Do not commit secrets; use `.env.local` (ignored). Configure app via `next.config.js` when needed.
- Large/static assets go in `public/`. Respect `.gitignore` entries (e.g., `.next`, `dist`, `coverage`).
