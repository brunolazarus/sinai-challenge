# Technical Requirements Document — Carbon Footprint Calculator

## 1. Overview

A full-stack personal carbon footprint calculator. Users enter quantities for activities they perform (miles driven, kg of beef consumed, kWh of electricity used) and receive an annual CO₂e estimate broken down by activity, with full calculation provenance.

**Constraints driving the design:**
- Emissions calculations must run exclusively in the backend — the frontend never computes CO₂e values.
- The API is stateless — no database, all data is in-memory registries.
- The OpenAPI spec is the contract — Zod schemas in route definitions are the single source of truth for types, validation, and documentation.

---

## 2. System Architecture

```
┌─────────────────────────────────────────┐
│  apps/web  (Vite + React, port 3000)    │
│  ┌──────────────────────────────────┐   │
│  │  TanStack React Query hooks      │   │
│  │  MUI components                  │   │
│  └────────────┬─────────────────────┘   │
│               │ REST (fetch)             │
└───────────────┼─────────────────────────┘
                │
┌───────────────┼─────────────────────────┐
│  apps/api  (Hono, port 4000)            │
│  ┌────────────▼─────────────────────┐   │
│  │  OpenAPIHono routes              │   │
│  │  ┌───────────────────────────┐   │   │
│  │  │  Calculator               │   │   │
│  │  │  Activity → Factor → CO₂e │   │   │
│  │  └───────────────────────────┘   │   │
│  │  ┌───────────────────────────┐   │   │
│  │  │  Registry (in-memory)     │   │   │
│  │  │  categories / activities  │   │   │
│  │  │  transformations / factors│   │   │
│  │  └───────────────────────────┘   │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                │
┌───────────────┴──────────────────────────┐
│  packages/shared                         │
│  TypeScript types + constants            │
│  (consumed by both apps)                 │
└──────────────────────────────────────────┘
```

### Monorepo layout

| Workspace | Path | Purpose |
|-----------|------|---------|
| `@sinai/web` | `apps/web/` | Vite + React frontend |
| `@sinai/api` | `apps/api/` | Hono REST API |
| `@sinai/shared` | `packages/shared/` | Types and constants |
| `@sinai/typescript-config` | `packages/typescript-config/` | Shared tsconfig bases |
| `@sinai/eslint-config` | `packages/eslint-config/` | Shared ESLint flat config |

TurboRepo orchestrates tasks with `^build` dependency ordering — `shared` always builds before the apps.

---

## 3. Data Model

Five independent entities, defined in `packages/shared/src/types.ts` and `constants.ts`.

### EmissionCategory
A logical grouping (`transportation`, `energy`, `diet`, `waste`). Defined as a `const` object in `constants.ts`; the `EmissionCategory` union type is derived from it at the type level — no runtime overhead, full autocomplete.

```ts
export const EMISSION_CATEGORIES = {
  TRANSPORTATION: "transportation",
  ENERGY: "energy",
  DIET: "diet",
  WASTE: "waste",
} as const;

export type EmissionCategory = (typeof EMISSION_CATEGORIES)[keyof typeof EMISSION_CATEGORIES];
```

### Activity
What is being measured. Declares its category, input unit, and which transformation formula to apply. Activities do not hold factor values.

```ts
interface Activity {
  id: string;
  label: string;
  category: EmissionCategory;
  inputUnit: InputUnit;
  transformation: TransformationId;
}
```

### Transformation
A named reusable formula. The backend's `TransformationDef` extends the shared type with an `apply(input, factor): number` function — the `apply` field is stripped by JSON serialisation before the API response leaves the server.

| ID | Formula | Use case |
|----|---------|----------|
| `simple_multiply` | `input × factor` | Standard annual totals |
| `annualized` | `input × 365 × factor` | Daily inputs (e.g. miles/day) |
| `weekly_to_yearly` | `input × 52 × factor` | Weekly inputs (e.g. kg/week) |
| `input_km` | `(input / 1.60934) × factor` | Kilometre inputs, factor per mile |
| `input_lbs` | `(input / 2.20462) × factor` | Pound inputs, factor per kg |

### EmissionFactor
An independent data record keyed by `{activity}_{source}_{year}_{region}`. Multiple factors can exist for the same activity (e.g. regional electricity grids). The caller can override the default factor by passing an explicit `factorId` in `CalculationInput`.

```ts
interface EmissionFactor {
  id: string;
  activity: string;
  value: number;
  unit: string;
  region: string;
  year: number;
  source: string;
  methodology: string;
}
```

### CalculationInput / CalculationResult / FootprintSummary

```ts
interface CalculationInput {
  activityId: string;
  quantity: number;
  factorId?: string; // optional override
}

interface CalculationResult {
  activity: string;
  input: number;
  inputUnit: InputUnit;
  factor: string;      // factor ID used — full provenance
  result: { kgCO2e: number; unit: string };
}

interface FootprintSummary {
  totalKgCO2e: number;
  results: CalculationResult[];
}
```

---

## 4. Calculation Engine

Located in `apps/api/src/lib/calculator.ts`. Pure function — no side effects, fully unit-tested.

**Pipeline per input:**
1. Resolve `Activity` by `activityId` → error if unknown
2. Resolve `Transformation` by `activity.transformation`
3. Resolve `EmissionFactor` — use `factorId` if provided, otherwise find the first factor where `factor.activity === activityId` → error if none
4. Call `transformation.apply(input.quantity, factor.value)` → `kgCO2e`
5. Return `CalculationResult` with full provenance

Adding a new transformation does not require touching the calculator — only `transformations.ts`.

---

## 5. API Design

Framework: **Hono** + **`@hono/zod-openapi`**. Every route defines its request/response shapes as Zod schemas, which simultaneously power runtime validation, TypeScript inference, and the generated OpenAPI spec.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/v1/categories` | List all emission categories |
| `GET` | `/v1/activities` | List activities (`?category=` filter) |
| `GET` | `/v1/transformations` | List transformation formulas |
| `GET` | `/v1/factors` | List emission factors (`?category=` filter) |
| `POST` | `/v1/calculate` | Calculate footprint from `CalculationInput[]` |

**Live documentation:** `http://localhost:4000/docs` (Swagger UI), `http://localhost:4000/openapi.json`

The `?category=` filter is validated against `z.enum(Object.values(EMISSION_CATEGORIES))` — adding a new category to `constants.ts` automatically extends the valid enum at both the type and runtime level.

---

## 6. Frontend Design

Framework: **Vite + React 18 + MUI v9 + TanStack React Query v5**.

### Hook architecture

| Hook | Location | Responsibility |
|------|----------|----------------|
| `useActivities` | `hooks/useActivities.ts` | Raw fetch, cached at `staleTime: Infinity` |
| `useActivitiesForCategory` | `hooks/useActivities.ts` | Filters cached data for one category |
| `useActivitiesByCategory` | `hooks/useActivities.ts` | Accordion open/close state + loading flag |
| `useFactors` | `hooks/useFactors.ts` | Fetches all factors, groups by activity ID |
| `useCalculate` | `hooks/useCalculate.ts` | `useMutation` wrapper for POST /v1/calculate |

Registry data is fetched once and cached indefinitely (`staleTime: Infinity`) — activities and factors are static at runtime.

### Component tree

```
App
└── ErrorBoundary              (top-level catch)
    └── FootprintCalculator    (orchestrator — quantities state, calculate mutation)
        ├── ErrorBoundary      (per category)
        │   └── CategorySection (fetches own activities + factors via hooks)
        │       └── ActivityInput (label + number input + methodology tooltip)
        └── ErrorBoundary      (results)
            └── ResultsPanel   (total + per-activity breakdown)
```

**Key design decisions:**
- `CategorySection` owns its own data fetching (`useActivitiesForCategory`, `useFactors`) — no prop drilling of data arrays from the parent.
- `FootprintCalculator` only owns UI interaction state (`quantities`, `selectedCategory`) and the calculate mutation.
- Error boundaries are placed per major section so a render failure in one category doesn't crash the others.
- `scrollbar-gutter: stable` on `<html>` prevents layout shift when the scrollbar appears/disappears on accordion expansion.

---

## 7. Emission Factor Sources

All factors sourced from publicly available EPA data. Results are in **kg CO₂e** using **IPCC AR5 GWP100** values (CH4=28, N2O=265).

| Source | Used for |
|--------|---------|
| [EPA GHG Emission Factors Hub (2023)](https://www.epa.gov/climateleadership/ghg-emission-factors-hub) | Transportation, diet, waste |
| [EPA eGRID2023](https://www.epa.gov/egrid) | Electricity (national average + NPCC subregion) |
| [IPCC AR5 WG1 (2013)](https://www.ipcc.ch/report/ar5/wg1/) | GWP100 multipliers for CH4 and N2O |

Key heuristics:

| Category | Heuristic |
|----------|-----------|
| Transportation | Gasoline car: 0.404 kg/mile (22 MPG fleet avg); EV: 0.115 kg/mile (grid-dependent); flights include RFI×1.9 for high-altitude effects |
| Energy | US avg electricity: 0.386 kg/kWh (eGRID2023); natural gas: 5.306 kg/therm; fuel oil: 10.16 kg/gallon |
| Diet | Beef: 27 kg/kg (enteric fermentation dominates); chicken: 6.9 kg/kg; vegetables: ~2 kg/kg |
| Waste | Landfill: 0.52 kg/kg (CH4 from anaerobic decomposition); composting: 0.03 kg/kg |

---

## 8. Testing Strategy

| Layer | Tool | Approach |
|-------|------|----------|
| Calculator unit tests | Vitest | Real factor values, boundary cases, all transformations |
| API route integration | Vitest + `app.request()` | No test server, no mocks — Hono handles in-process |
| Frontend components | Vitest + Testing Library + happy-dom | `QueryClientProvider` with seeded cache data |
| Hook logic | Vitest | Pure function tests (e.g. `groupActivitiesByCategory`) |

**Why happy-dom over jsdom:** `jsdom@29` depends on `html-encoding-sniffer@6`, which is ESM-only and cannot be `require()`d. `happy-dom` has no such conflict and is faster.

Current test count: **52** (36 API + 16 web).

---

## 9. Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| HTTP framework | Hono + `@hono/zod-openapi` | Lightweight, TypeScript-native, Zod schemas power validation + OpenAPI generation simultaneously |
| Schema constants | `const` objects + derived union types | vs. TypeScript `enum`: zero runtime overhead, no IIFE, works with string comparison, compatible with Zod |
| Transformations | `apply` function on each `TransformationDef` | vs. switch statement in calculator: adding a transformation never requires touching the calculator |
| Registry data | In-memory arrays | vs. database: stateless requirement; ~30 factors load in microseconds |
| Frontend data fetching | `staleTime: Infinity` | Registry data is immutable at runtime; no polling needed |
| Error boundaries | Per-section | vs. single top-level: isolates failures to individual categories and results panel |

---

## 10. Known Limitations & Future Work

- **No persistence** — calculation results are not saved; refreshing resets the form.
- **US-only factors** — the data model supports regional factors (`region` field), but only US values are populated. International users get inaccurate results.
- **Single factor per activity by default** — the override mechanism exists, but the UI does not expose factor selection.
- **No authentication** — the API is fully open; rate limiting would be needed for production.
- **AI features planned** — see `docs/ai-features.md` for the proposed NL input parser, recommendation engine, RAG Q&A, and MCP server.
