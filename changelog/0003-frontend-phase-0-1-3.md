# 0003 — Frontend Phases 0, 1 & 3: API Client, Hooks, Atomic Components

**Date:** 2026-05-07

## Summary

Bootstrapped the React frontend for the carbon footprint calculator. Removed the legacy
GraphQL wiring, replaced it with a typed REST client, added React Query hooks for registry
and calculation data, and built the atomic component layer (ActivityRow, CategorySection,
ResultsPanel) using MUI v9.

---

## Removed

### `apps/web`

- `src/lib/graphql-client.ts` — GraphQL client stub, replaced by `src/lib/api.ts`
- Dependencies: `graphql`, `graphql-request`

---

## Added

### `apps/web`

**Dependencies:** `@mui/icons-material@^9.0.1`

**API client — `src/lib/api.ts`**

Thin typed fetch wrapper exposing a single `api` object:

| Method | Endpoint |
|--------|----------|
| `api.categories()` | `GET /v1/categories` |
| `api.activities(category?)` | `GET /v1/activities` |
| `api.transformations()` | `GET /v1/transformations` |
| `api.factors(category?)` | `GET /v1/factors` |
| `api.calculate(inputs)` | `POST /v1/calculate` |

All return types are imported directly from `@sinai/shared` — no code generation needed.
Throws a descriptive `Error` on non-2xx responses.

**Types — `src/types.ts`**

- `InputRow` — `{ rowId, activityId, quantity }` — the local state unit for a single
  user-entered activity row; lives in the frontend only.

**Hooks — `src/hooks/`**

- `useActivities.ts` — wraps `GET /v1/activities` with `useQuery`; uses `select` to group
  the flat list into `Record<categoryId, Activity[]>`. `staleTime: Infinity` since registry
  data is static at runtime.
- `useCalculate.ts` — wraps `POST /v1/calculate` with `useMutation`; accepts
  `CalculationInput[]` and returns `FootprintSummary`.

**Components — `src/components/`**

*Atom*

- `ActivityRow.tsx` — a single input row consisting of:
  - MUI `Select` populated with activities for the current category
  - MUI `TextField` (type="number") for the quantity; disabled until an activity is chosen
  - Read-only unit label resolved from the selected activity's `inputUnit`
  - `IconButton` with `DeleteOutlinedIcon` to remove the row

*Molecules*

- `CategorySection.tsx` — MUI `Accordion` section for one category; renders a list of
  `ActivityRow`s, shows a collapsed entry count, and an "Add activity" `Button`.
- `ResultsPanel.tsx` — two-card layout:
  - Top card: prominent `totalKgCO2e` figure on a `primary.main` background
  - Bottom card: per-result breakdown showing activity name, input + unit, factor ID (provenance), and individual kgCO2e

---

## Changed

### `apps/web`

- `vite.config.ts` — updated dev proxy: `/graphql → http://localhost:4000` replaced with
  `/v1` and `/health` proxied to `http://localhost:4000`
- `package.json` — removed `graphql`, `graphql-request`; added `@mui/icons-material@^9.0.1`

---

## Notes

- MUI v9 removed CSS shorthand system props (`alignItems`, `fontWeight`, `display`, etc.)
  as direct component props — these must now go in the `sx` prop. All components written
  accordingly.
- Icon import paths in `@mui/icons-material` v9 use the `*Outlined` suffix convention
  (e.g. `DeleteOutlinedIcon` not `DeleteOutlineIcon`).
- `String.prototype.replaceAll` is not available in the configured TS lib target; using
  `.replace(/_/g, " ")` instead.

---

## What's next

- `FootprintCalculator.tsx` — orchestrator component: manages `InputRow` state per
  category, wires all `CategorySection`s together, fires the calculate mutation, and
  renders `ResultsPanel` on success.
- `App.tsx` — render `FootprintCalculator` inside a MUI `ThemeProvider` + `Container`.
