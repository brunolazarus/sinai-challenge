# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

A full-stack personal carbon footprint calculator built as a TurboRepo monorepo.

| Workspace | Path | Purpose |
|-----------|------|---------|
| `@sinai/web` | `apps/web/` | Vite + React + TanStack React Query |
| `@sinai/api` | `apps/api/` | Hono + REST + OpenAPI (`@hono/zod-openapi`) |
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
- **OpenAPI spec is the contract** — route schemas defined via Zod in `apps/api/src/routes/` are the source of truth. Changes there must be reflected in `packages/shared/` types and frontend fetch calls together.
- The frontend communicates with the API via REST using `fetch` + TanStack React Query.

## API Structure (`apps/api/`)

```
src/
  index.ts          # Node.js server entry (@hono/node-server)
  app.ts            # OpenAPIHono app, CORS, route registration, Swagger UI
  routes/
    health.ts       # GET /health
    factors.ts      # GET /v1/factors
    calculate.ts    # POST /v1/calculate
  lib/
    emission-factors.ts   # EPA-sourced factor data with methodology docs
    calculator.ts         # Pure calculation functions
    calculator.test.ts    # Unit tests for calculator
```

**Live docs** (when running): `http://localhost:4000/docs` (Swagger UI), `http://localhost:4000/openapi.json` (raw spec).

## Emission Factor Heuristics

All factors are sourced from the **EPA GHG Emission Factors Hub (2023)** and **EPA eGRID2023**. Results are in **kg CO2e** using IPCC AR5 GWP100 values (CH4=28, N2O=265).

| Category | Key heuristic |
|----------|--------------|
| `transportation` | Gasoline car ~0.404 kg/mile; EV ~0.115 kg/mile (grid-dependent); flights include RFI×1.9 for high-altitude effects |
| `energy` | US avg electricity 0.386 kg/kWh (eGRID2023); natural gas 5.306 kg/therm; fuel oil 10.16 kg/gallon |
| `diet` | Beef 27 kg/kg (enteric fermentation dominates); chicken 6.9 kg/kg; vegetables ~2 kg/kg |
| `waste` | Landfill 0.52 kg/kg (CH4 from anaerobic decomp); composting 0.03 kg/kg; recycling ~0.02 kg/kg |

## TypeScript

- Strict mode enabled everywhere; avoid `any` — use `unknown` when the type is uncertain.
- Use `type` imports (`import type { Foo }`) for type-only imports.
- Shared tsconfig bases in `packages/typescript-config/`: `base.json` (Node), `react.json` (Vite/React), `node.json` (Node/Hono).
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
