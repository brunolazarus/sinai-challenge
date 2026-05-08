# 0001 — Initial Monorepo Scaffold

**Date:** 2026-05-07

## Summary

Bootstrapped the full TurboRepo monorepo structure for the SINAI fullstack take-home challenge.

## Added

### Root

- `package.json` — pnpm workspace root with turbo scripts (`dev`, `build`, `test`, `type-check`, `lint`, `clean`)
- `pnpm-workspace.yaml` — declares `apps/*` and `packages/*` as workspace members
- `turbo.json` — task pipeline: `build` (with `^build` dependency ordering), `dev` (persistent, no cache), `test`, `lint`, `type-check`, `clean`
- `.nvmrc` — pins Node.js to v20
- `CLAUDE.md` — Claude Code guidance: commands, architecture constraints, testing conventions, domain notes
- `AGENTS.md` — AI agent guidance (Cursor, Copilot, etc.) with the same constraints in a tool-agnostic format
- `README.md` — project overview, stack, getting-started steps, and script reference

### `packages/typescript-config`

Shared tsconfig bases consumed by all workspaces via `@sinai/typescript-config`:

- `base.json` — strict mode, ESM, NodeNext resolution (foundation for all packages)
- `node.json` — extends base; target ES2022, NodeNext module resolution (used by `apps/api`)
- `react.json` — extends base; ESNext + bundler resolution, `jsx: react-jsx` (used by `apps/web`)

### `packages/eslint-config`

Shared ESLint v9 flat config exposed as `@sinai/eslint-config`:

- `index.js` — TypeScript ESLint recommended rules + `no-explicit-any`, `consistent-type-imports`
- `react.js` — extends base with `eslint-plugin-react` and `eslint-plugin-react-hooks`

### `packages/shared`

Shared TypeScript types and constants published as `@sinai/shared`:

- `src/types.ts` — core domain types: `EmissionCategory`, `EmissionFactor`, `CalculationInput`, `CalculationResult`, `FootprintSummary`
- `src/constants.ts` — `EMISSION_CATEGORIES` tuple, `CO2E_UNITS` map
- `src/index.ts` — barrel re-export
- `tsconfig.json` — extends `@sinai/typescript-config/base.json`, outputs to `dist/`

### `apps/api`

Express + GraphQL backend scaffold (`@sinai/api`, port 4000):

- `src/index.ts` — Express server with CORS, mounts `graphql-http` handler at `/graphql`
- `src/graphql/schema.ts` — GraphQL schema stub (`Query.health`)
- `src/graphql/resolvers.ts` — resolver stub returning `"ok"` for `health`
- `tsconfig.json` — extends `@sinai/typescript-config/node.json`
- `eslint.config.js` — uses `@sinai/eslint-config` base

### `apps/web`

Vite + React frontend scaffold (`@sinai/web`, port 3000):

- `src/main.tsx` — React root with `QueryClientProvider` wrapping the app
- `src/App.tsx` — minimal App component stub
- `src/lib/graphql-client.ts` — `GraphQLClient` instance pointed at `/graphql`
- `vite.config.ts` — `@vitejs/plugin-react`, dev proxy `/graphql` → `http://localhost:4000`
- `index.html` — HTML entry point
- `tsconfig.json` + `tsconfig.node.json` — extends `@sinai/typescript-config/react.json`
- `eslint.config.js` — uses `@sinai/eslint-config/react`

## Tech Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Monorepo tool | TurboRepo | Task caching, parallel execution, `^build` dependency ordering |
| Package manager | pnpm | Native workspace support, disk-efficient with symlinks |
| GraphQL server | `graphql-http` | Minimal, spec-compliant, no Apollo overhead for this scope |
| GraphQL client | `graphql-request` + TanStack React Query | Lightweight; React Query handles caching/loading states |
| Test framework | Vitest | Vite-native, same config for both apps |
| TypeScript | Strict mode everywhere | Matches challenge expectations for well-typed code |
