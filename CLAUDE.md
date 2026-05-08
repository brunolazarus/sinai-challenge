# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

A full-stack personal carbon footprint calculator built as a TurboRepo monorepo.

| Workspace | Path | Purpose |
|-----------|------|---------|
| `@sinai/web` | `apps/web/` | Vite + React + TanStack React Query |
| `@sinai/api` | `apps/api/` | Express + GraphQL (graphql-http) |
| `@sinai/shared` | `packages/shared/` | Shared TypeScript types and constants |
| `@sinai/typescript-config` | `packages/typescript-config/` | Shared tsconfig bases |
| `@sinai/eslint-config` | `packages/eslint-config/` | Shared ESLint flat config |

## Commands

```bash
pnpm install          # install all workspaces
pnpm dev              # start web (port 3000) and api (port 4000) concurrently
pnpm build            # build all packages in dependency order
pnpm test             # run all tests
pnpm type-check       # type-check all packages
pnpm lint             # lint all packages
```

## Architecture Constraints

- **Emissions calculations belong in the backend** (`apps/api/`) — never compute CO2e values in the frontend.
- **Shared types live in `packages/shared/`** — update there first when changing data shapes used by both apps.
- **No data persistence required** — the API is stateless; no database.
- **GraphQL schema is the contract** — changes to the schema must be reflected in resolvers and frontend queries together.
- The frontend communicates exclusively via GraphQL using `graphql-request` + TanStack React Query.

## TypeScript

- Strict mode enabled everywhere; avoid `any` — use `unknown` when the type is uncertain.
- Use `type` imports (`import type { Foo }`) for type-only imports.
- Shared tsconfig bases in `packages/typescript-config/`: `base.json` (Node), `react.json` (Vite/React), `node.json` (Express).
- ESM throughout — all packages use `"type": "module"`.

## Testing

- Use Vitest for both frontend and backend tests.
- Co-locate tests with source: `foo.ts` → `foo.test.ts`.
- Every calculation function must have unit tests covering boundary values.
- No mocking of core calculation logic — test with real emission factor values.

## Domain

- Emissions are in **kg CO2e** (kilograms of CO2 equivalent) throughout.
- Emission factors sourced from the EPA GHG Emission Factors Hub (2023).
- Categories: `transportation`, `energy`, `diet`, `waste`.
