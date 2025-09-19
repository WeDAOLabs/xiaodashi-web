# Repository Guidelines

## Project Structure & Module Organization
Monorepo managed by pnpm workspaces in the repository root:
- `frontend/`: customer-facing Next.js 15 app using the App Router; components live in `app/components`, shared styling in `app/globals.css`.
- `frontend-app/`: operator console that mirrors the frontend layout and runs on port 3001 by default.
- `backend/`: NestJS service with feature modules under `src/**`, Jest fixtures in `test/`, and automation scripts in `scripts/`.
- `shared/`: TypeScript contracts inside `types/` compiled to `dist/` via `pnpm run build:shared`; import from this package instead of duplicating types.

## Build, Test, and Development Commands
Execute scripts from the repository root:
- `pnpm run dev:frontend` — start the marketing site on http://localhost:3000.
- `pnpm run dev:frontend-app` — launch the console UI, defaulting to http://localhost:3001.
- `pnpm run dev:backend` — run the NestJS API with file watching.
- `pnpm run build:all` — compile shared contracts and production bundles for both Next.js apps.
- `pnpm run lint` — run ESLint across the two frontend workspaces; fix all warnings before committing.
- `pnpm --filter backend test` — execute the backend Jest suite; add `:cov` when validating coverage locally.

## Coding Style & Naming Conventions
Prefer TypeScript in every workspace. Frontend linting extends `next/core-web-vitals`; backend linting uses the flat config plus Prettier enforcing single quotes and trailing commas (`backend/.prettierrc`). Name React components and Nest providers in PascalCase (`PricingTable.tsx`, `HealthService.ts`), keep hooks and utilities camelCase, and group files by feature (`app/components/pricing/**`, `backend/src/health/**`).

## Testing Guidelines
Backend unit specs follow the `*.spec.ts` pattern colocated with source files (see `backend/src/health`). Run `pnpm --filter backend test` before any push, and prefer `pnpm --filter backend test:cov` when refining coverage. Frontend automation is not yet scaffolded; place future component specs near their implementation and document manual QA steps in pull requests until tooling lands.

## Commit & Pull Request Guidelines
Commits typically use concise, imperative Chinese subjects (e.g. `重构布局`, `修复侧边栏bug`). Keep the subject under 50 characters, add optional body context, and mention follow-up tasks if work is partial. Open PRs only after linting and backend tests succeed; link related issues, attach UI screenshots when layouts change, and list any scripts reviewers must rerun.

## Environment & Configuration Tips
Copy `frontend/env.example` to `.env.local` before launching the Next.js apps. Regenerate the backend OpenAPI schema with `pnpm --filter backend openapi:gen` whenever DTOs change. Ignore generated directories like `.next/`, `dist/`, and `coverage/`.
