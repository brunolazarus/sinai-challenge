# 0002 — Hono + OpenAPI Refactor & Modular Emission Registry

**Date:** 2026-05-07

## Summary

Replaced the Express + GraphQL backend with Hono + REST + OpenAPI (`@hono/zod-openapi`).
Introduced a fully modular emission data model that separates categories, activities,
transformations, and factors into independent registries. Rewrote shared types to match.
Added a frontend plan document.

---

## Removed

### `apps/api`

- `src/graphql/schema.ts` — GraphQL schema stub
- `src/graphql/resolvers.ts` — GraphQL resolver stub
- `src/lib/emission-factors.ts` — flat monolithic factor list (replaced by registry)
- `src/routes/factors.ts` — old `/v1/factors` route (replaced by `registry.ts`)
- Dependencies: `express`, `cors`, `graphql`, `graphql-http`, `@types/express`, `@types/cors`

---

## Added

### `apps/api`

**Dependencies:** `hono`, `@hono/node-server`, `@hono/zod-openapi`, `@hono/swagger-ui`, `zod`

**Server:**

- `src/index.ts` — rewrote to use `@hono/node-server` `serve()` adapter
- `src/app.ts` — `OpenAPIHono` instance with CORS, route registration, Swagger UI at `/docs`, raw spec at `/openapi.json`

**Registry (`src/lib/registry/`):**

- `categories.ts` — 4 `Category` objects (transportation, energy, diet, waste); no formulas, no factors
- `transformations.ts` — `Transformation` registry starting with `simple_multiply`; slots commented for future `annualized`, `weekly_to_yearly`, `spend_based`
- `activities.ts` — 19 `Activity` objects each declaring `category`, `inputUnit`, and `transformation`; no hardcoded factor values
- `factors.ts` — 19 `EmissionFactor` objects keyed by `{activity}_{source}_{year}_{region}`; each carries `value`, `unit`, `region`, `year`, `source`, and `methodology` fields
- `index.ts` — barrel re-export of all four registries

**Calculation engine (`src/lib/`):**

- `calculator.ts` — implements the CATEGORY → ACTIVITY → TRANSFORMATION → EMISSION FACTOR → RESULT pipeline; resolves default factor by `activityId` or accepts an explicit `factorId` override
- `calculator.test.ts` — 11 unit tests covering all 4 categories, zero-quantity boundary, explicit `factorId` override, unknown activity/factor errors, and multi-input footprint

**Routes (`src/routes/`):**

- `health.ts` — `GET /health`
- `registry.ts` — `GET /v1/categories`, `GET /v1/activities?category=`, `GET /v1/transformations`, `GET /v1/factors?category=`
- `calculate.ts` — `POST /v1/calculate`; validates `activityId` and optional `factorId` before delegating to calculator

**Live docs:** `http://localhost:4000/docs` (Swagger UI), `http://localhost:4000/openapi.json`

### `docs/`

- `plan-frontend-calculator.md` — step-by-step implementation plan for the category-by-category frontend UI

---

## Changed

### `packages/shared` — `src/types.ts` (full rewrite)

Old flat types replaced with a five-entity modular model:

| Type | Purpose |
|------|---------|
| `Category` | Logical grouping only — no formulas or factors |
| `Activity` | What is measured + `inputUnit` + reference to `Transformation` |
| `Transformation` | Reusable formula (e.g. `input * factor`) |
| `EmissionFactor` | Independent factor object with `region`, `year`, `source`, `methodology` |
| `CalculationInput` | `activityId` + `quantity` + optional `factorId` override |
| `CalculationResult` | Full provenance: `activity`, `input`, `inputUnit`, `factor`, `result.kgCO2e` |
| `FootprintSummary` | `totalKgCO2e` + `CalculationResult[]` |

### `CLAUDE.md`

- Updated `@sinai/api` workspace entry: Express + GraphQL → Hono + REST + OpenAPI
- Replaced "GraphQL schema is the contract" constraint with "OpenAPI spec is the contract"
- Updated frontend communication note: GraphQL → REST fetch
- Added API structure section with directory tree
- Added Emission Factor Heuristics table summarising key factors per category
- Updated tsconfig note: `node.json` now covers Node/Hono (not Express)

---

## Tech Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| HTTP framework | Hono + `@hono/node-server` | Lightweight, TypeScript-native, first-class OpenAPI support via `@hono/zod-openapi` |
| API style | REST + OpenAPI 3.0 | Enables Swagger UI documentation and machine-readable spec; better suited for documenting calculation heuristics than GraphQL |
| Schema/validation | Zod (via `@hono/zod-openapi`) | Single source of truth for types, validation, and OpenAPI spec generation |
| Data model | Modular registry (5 entities) | Decouples logical grouping from calculation logic; factors are replaceable by region/year without touching activities |
| Factor ID convention | `{activity}_{source}_{year}_{region}` | Makes provenance explicit and enables future multi-region/year factor sets |
