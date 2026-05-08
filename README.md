# sinai-challenge

A full-stack personal carbon footprint calculator.

## Stack

- **Monorepo**: TurboRepo + pnpm workspaces
- **Frontend** (`apps/web`): Vite, React, TanStack React Query, graphql-request
- **Backend** (`apps/api`): Node.js, Express, GraphQL (graphql-http)
- **Shared** (`packages/shared`): TypeScript types and constants

## Getting Started

```bash
pnpm install
pnpm dev
```

- Frontend: http://localhost:3000
- GraphQL API: http://localhost:4000/graphql

## Structure

```
apps/
  web/    # Vite + React frontend
  api/    # Express + GraphQL API
packages/
  shared/              # Shared TypeScript types
  typescript-config/   # Shared tsconfig bases (base, react, node)
  eslint-config/       # Shared ESLint flat config
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in watch mode |
| `pnpm build` | Build all packages in dependency order |
| `pnpm test` | Run all tests (Vitest) |
| `pnpm type-check` | Type-check all packages |
| `pnpm lint` | Lint all packages |
