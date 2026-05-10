# sinai-challenge

A full-stack personal carbon footprint calculator.

## Stack

- **Monorepo**: TurboRepo + pnpm workspaces
- **Frontend** (`apps/web`): Vite, React, MUI v9, TanStack React Query v5
- **Backend** (`apps/api`): Hono + `@hono/zod-openapi` (REST + OpenAPI 3.0)
- **Shared** (`packages/shared`): TypeScript types and constants

## Getting Started

```bash
pnpm install
pnpm dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| REST API | http://localhost:4000 |
| Swagger UI | http://localhost:4000/docs |
| OpenAPI spec | http://localhost:4000/openapi.json |

## Structure

```
apps/
  web/    # Vite + React frontend
  api/    # Hono REST API with OpenAPI docs
packages/
  shared/              # Shared TypeScript types and constants
  typescript-config/   # Shared tsconfig bases (base, react, node)
  eslint-config/       # Shared ESLint flat config
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/v1/categories` | List emission categories |
| `GET` | `/v1/activities` | List activities (optional `?category=` filter) |
| `GET` | `/v1/transformations` | List calculation formulas |
| `GET` | `/v1/factors` | List emission factors (optional `?category=` filter) |
| `POST` | `/v1/calculate` | Calculate carbon footprint from a list of activity inputs |

Emission factors are sourced from the **EPA GHG Emission Factors Hub (2023)** and **EPA eGRID2023**.
Results are in **kg CO₂e** using IPCC AR5 GWP100 values.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in watch mode |
| `pnpm build` | Build all packages in dependency order |
| `pnpm test` | Run all tests (Vitest) |
| `pnpm type-check` | Type-check all packages |
| `pnpm lint` | Lint all packages |
