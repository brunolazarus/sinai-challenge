# AGENTS.md

Guidelines for AI coding agents (Claude Code, GitHub Copilot, Cursor, Windsurf, etc.) working in this repository.

## Repository Layout

```
apps/
  web/    # Vite + React frontend (port 3000)
  api/    # Hono REST API with OpenAPI docs (port 4000)
packages/
  shared/              # Shared TypeScript types & constants
  typescript-config/   # Shared tsconfig bases (base, react, node)
  eslint-config/       # Shared ESLint flat config (base, react)
```

All inter-package imports use the `@sinai/*` namespace. Workspace references use `"workspace:*"`.

## Hard Rules

1. **Calculations go in the backend.** CO2e values must be computed in `apps/api/` — never in `apps/web/`.
2. **Shared data shapes go in `packages/shared/src/types.ts`.** If a type is needed by both apps, define it there and import it from `@sinai/shared`.
3. **The API is stateless.** No database setup — return calculation results directly from route handlers.
4. **The OpenAPI spec is the contract.** Route schemas are defined via Zod in `apps/api/src/routes/`. Changing a route schema must be reflected in `packages/shared/` types and frontend fetch calls together.

## API Structure

Routes live in `apps/api/src/routes/` and are registered on an `OpenAPIHono` app instance.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/v1/categories` | List emission categories |
| `GET` | `/v1/activities` | List activities (`?category=` filter supported) |
| `GET` | `/v1/transformations` | List calculation formulas |
| `GET` | `/v1/factors` | List emission factors (`?category=` filter supported) |
| `POST` | `/v1/calculate` | Calculate footprint from `CalculationInput[]` |

Live docs when running: `http://localhost:4000/docs` (Swagger UI), `http://localhost:4000/openapi.json`.

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
- API route tests use `app.request()` directly — no test server or mocking needed.
- Frontend component tests use `@testing-library/react` with jsdom.
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
- Emission factor sources: EPA GHG Emission Factors Hub (2023), EPA eGRID2023.
- Categories: `transportation` | `energy` | `diet` | `waste`
