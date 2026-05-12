# Carbon Footprint Calculator

## TL;DR

Full-stack personal carbon footprint calculator. Enter annual quantities across transportation, energy, diet, and waste — get a CO₂e breakdown with full calculation provenance sourced from EPA data.

```bash
pnpm install && pnpm dev
# frontend → http://localhost:3000
# API + Swagger UI → http://localhost:4000/docs
```

- **Want to understand the architecture?** Read [`docs/TRD.md`](docs/TRD.md)
- **Want to add an activity or category?** Jump to [Registry Guide](#registry-guide) below
- **All amounts are annual totals** (e.g. miles driven per year, kg of beef per year)

---

## Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | TurboRepo + pnpm workspaces |
| Frontend | Vite + React 18 + MUI v9 + TanStack React Query v5 |
| Backend | Hono + `@hono/zod-openapi` (REST + OpenAPI 3.0) |
| Shared | TypeScript types and constants (`@sinai/shared`) |
| Tests | Vitest + Testing Library + happy-dom |

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20 (see `.nvmrc`) | [nodejs.org](https://nodejs.org) or `nvm use` |
| pnpm | 9 | `npm install -g pnpm@9` |

> **Using nvm?** Run `nvm use` in the repo root — it will pick up the `.nvmrc` automatically.

## Getting Started

```bash
pnpm install   # install all workspace dependencies
pnpm dev       # start frontend (port 3000) and API (port 4000) concurrently
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| REST API | http://localhost:4000 |
| Swagger UI | http://localhost:4000/docs |
| OpenAPI spec | http://localhost:4000/openapi.json |

## Project Structure

```
apps/
  web/                    # Vite + React frontend
    src/
      components/         # UI components (CategorySection, ActivityInput, ResultsPanel, …)
      hooks/              # React Query hooks (useActivities, useFactors, useCalculate)
      lib/                # Typed API client
  api/                    # Hono REST API
    src/
      routes/             # One file per route group (health, registry, calculate)
      lib/
        calculator.ts     # Pure calculation engine
        registry/         # In-memory data: categories, activities, transformations, factors
packages/
  shared/                 # Types and constants shared by both apps
  typescript-config/      # Shared tsconfig bases (base, react, node)
  eslint-config/          # Shared ESLint flat config
docs/
  TRD.md                  # Technical Requirements Document
  ai-features.md          # Planned AI feature roadmap
```

The frontend is structured around a **Model-View-Presenter** pattern. Raw data-fetching hooks (`useActivities`, `useFactors`, `useCalculate`) form the Model layer. Each component folder owns a collocated Presenter hook (e.g. `useActivityInputPresenter`, `useCategorySectionPresenter`) that owns UI state and derives the exact values the component needs. React components are the View: they receive props or call hooks, render output, and contain no calculation logic. This keeps the data layer swappable and components straightforward to test in isolation.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/v1/categories` | List emission categories |
| `GET` | `/v1/activities` | List activities (`?category=` filter supported) |
| `GET` | `/v1/transformations` | List calculation formulas |
| `GET` | `/v1/factors` | List emission factors (`?category=` filter supported) |
| `POST` | `/v1/calculate` | Calculate footprint from a list of activity inputs |

Full interactive documentation available at **http://localhost:4000/docs** when the API is running.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in watch mode |
| `pnpm build` | Build all packages in dependency order |
| `pnpm test` | Run all tests (Vitest) |
| `pnpm type-check` | Type-check all packages |
| `pnpm lint` | Lint all packages |
| `pnpm stop` | Kill any process running on ports 3000 and 4000 |

## Data Sources

All emission factors are sourced from publicly available EPA data. Results are in **kg CO₂e** using **IPCC AR5 GWP100** values (CH4 = 28, N2O = 265).

| Source | Used for |
|--------|---------|
| [EPA GHG Emission Factors Hub (2023)](https://www.epa.gov/climateleadership/ghg-emission-factors-hub) | Transportation, diet, waste |
| [EPA eGRID2023](https://www.epa.gov/egrid) | Electricity (US national average + regional) |
| [IPCC AR5 WG1 (2013)](https://www.ipcc.ch/report/ar5/wg1/) | GWP100 multipliers for CH4 and N2O |

Each factor record in the registry carries a `source` and `methodology` field — hover the `ⓘ` icon next to any activity in the UI to read the full methodology note.

---

## Registry Guide

The backend uses a **data-driven registry** — adding activities or categories is a pure data change, no logic required.

### Adding a new activity

An activity needs an entry in two files. The `id` field is the link between them.

**1. `apps/api/src/lib/registry/activities.ts`**

```ts
{
  id: "motorcycle",
  label: "Motorcycle",
  category: EMISSION_CATEGORIES.TRANSPORTATION,
  inputUnit: INPUT_UNITS.MILE,
  transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
},
```

**2. `apps/api/src/lib/registry/factors.ts`**

Follow the ID convention `{activity}_{source}_{year}_{region}`:

```ts
{
  id: "motorcycle_epa2023_us",
  activity: "motorcycle",          // must match the activity id above
  value: 0.184,
  unit: "kgCO2e_per_mile",
  region: "US",
  year: 2023,
  source: "EPA GHG Emission Factors Hub 2023",
  methodology:
    "Based on average US motorcycle fuel economy of ~48 MPG and 8.887 kg CO2e per gallon " +
    "of gasoline. Includes tailpipe CO2, CH4 (GWP100=28), and N2O (GWP100=265).",
},
```

That's it. The activity appears in the UI automatically on the next request — no frontend changes needed.

**Using a custom transformation**

If the activity needs a unit conversion or time-scaling (e.g. daily miles, weekly kg), use one of the existing `TRANSFORMATION_IDS` instead of `SIMPLE_MULTIPLY`:

| ID | Formula | Example use |
|----|---------|-------------|
| `simple_multiply` | `input × factor` | Annual totals |
| `annualized` | `input × 365 × factor` | Daily inputs |
| `weekly_to_yearly` | `input × 52 × factor` | Weekly inputs |
| `input_km` | `(input / 1.60934) × factor` | Kilometre inputs |
| `input_lbs` | `(input / 2.20462) × factor` | Pound inputs |

---

### Adding a new category

A category touches five locations. Start from the shared constants and work outward.

**1. `packages/shared/src/constants.ts`** — source of truth; everything else derives from this

```ts
export const EMISSION_CATEGORIES = {
  TRANSPORTATION: "transportation",
  ENERGY: "energy",
  DIET: "diet",
  WASTE: "waste",
  SHOPPING: "shopping",   // ← add here
} as const;
```

Adding the key here automatically updates the `EmissionCategory` union type and the frontend's ordered category list (which uses `Object.values(EMISSION_CATEGORIES)`).

**2. `apps/api/src/lib/registry/categories.ts`** — powers `GET /v1/categories`

```ts
{ id: "shopping", label: "Shopping" },
```

**3. `apps/api/src/lib/registry/activities.ts`** — add at least one activity

```ts
{
  id: "clothing",
  label: "Clothing",
  category: EMISSION_CATEGORIES.SHOPPING,
  inputUnit: INPUT_UNITS.KG,
  transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
},
```

**4. `apps/api/src/lib/registry/factors.ts`** — add a factor for each new activity

```ts
{
  id: "clothing_epa2023_us",
  activity: "clothing",
  value: 23.0,
  unit: "kgCO2e_per_kg",
  region: "US",
  year: 2023,
  source: "EPA GHG Emission Factors Hub 2023",
  methodology: "...",
},
```

The API route validation, OpenAPI spec, and frontend accordion list all pick up the new category automatically from step 1. No frontend changes needed for a new category.

---

## Further Reading

- [`docs/TRD.md`](docs/TRD.md) — architecture, data model, calculation engine, and key technical decisions
- [`docs/ai-features.md`](docs/ai-features.md) — planned AI feature roadmap (NL input, RAG, MCP server)
- [`CLAUDE.md`](CLAUDE.md) — guidance for Claude Code
- [`AGENTS.md`](AGENTS.md) — guidance for other AI coding agents
