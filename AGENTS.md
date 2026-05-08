# AGENTS.md

Guidelines for AI coding agents (Claude Code, GitHub Copilot, Cursor, Windsurf, etc.) working in this repository.

## Repository Layout

```
apps/
  web/    # Vite + React frontend (port 3000)
  api/    # Express + GraphQL backend (port 4000)
packages/
  shared/              # Shared TypeScript types & constants
  typescript-config/   # Shared tsconfig bases (base, react, node)
  eslint-config/       # Shared ESLint flat config (base, react)
```

All inter-package imports use the `@sinai/*` namespace. Workspace references use `"workspace:*"`.

## Hard Rules

1. **Calculations go in the backend.** CO2e values must be computed in `apps/api/` and exposed via GraphQL — never in `apps/web/`.
2. **Shared data shapes go in `packages/shared/src/types.ts`.** If a type is needed by both apps, define it there and import it from `@sinai/shared`.
3. **The API is stateless.** No database setup — return calculation results directly from resolvers.
4. **Keep the GraphQL schema and resolvers in sync.** Changing the schema without updating resolvers (or vice versa) breaks the build.

## Code Style

- TypeScript strict mode — no `any`, prefer `unknown` for uncertain types.
- Named exports everywhere except React components (which use default exports).
- `import type` for type-only imports.
- No explanatory comments — names should be self-documenting. Only add a comment when a non-obvious constraint or workaround exists.
- ESM throughout (`"type": "module"` in all `package.json` files).

## Testing

- Framework: Vitest.
- Test files live next to their source: `calculator.ts` → `calculator.test.ts`.
- Every calculation function needs unit tests. Use real emission factor values, not mocks.
- Run with `pnpm test` from the repo root.

## Running the Project

```bash
pnpm install   # install all workspaces
pnpm dev       # start all apps concurrently
pnpm test      # run all tests
pnpm type-check
pnpm lint
```

## Domain Reference

- Unit: **kg CO2e** (kilograms of CO2 equivalent).
- Emission factor sources:
  - EPA GHG Emission Factors Hub (2023)
  - Shrink That Footprint
- Categories: `transportation` | `energy` | `diet` | `waste`
