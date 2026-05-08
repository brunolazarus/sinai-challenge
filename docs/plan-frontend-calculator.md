# Plan: Category-by-Category Calculator UI

## Overview

Implement the carbon footprint calculator frontend as a category-driven form.
Each of the 4 emission categories (transportation, energy, diet, waste) gets its own
accordion section. Users add activity rows per category, then calculate their total footprint.

---

## 0. Package cleanup

- Remove `graphql` and `graphql-request` from `apps/web/package.json`
- Update the Vite proxy in `vite.config.ts` from `/graphql` → `/v1`

---

## 1. API client — `src/lib/api.ts`

Replace `src/lib/graphql-client.ts` with a typed fetch wrapper:

```ts
get<T>(path: string): Promise<T>
post<T>(path: string, body: unknown): Promise<T>
```

Import shared types (`Activity`, `CalculationInput`, `FootprintSummary`) directly from
`@sinai/shared` — no code generation needed.

---

## 2. React Query hooks — `src/hooks/`

| File | Hook | Description |
|------|------|-------------|
| `useActivities.ts` | `useActivities()` | `GET /v1/activities` — grouped by category |
| `useCalculate.ts` | `useCalculate()` | `useMutation` wrapping `POST /v1/calculate` |

---

## 3. Component tree

```
App
└── FootprintCalculator          ← orchestrates state + layout
    ├── CategorySection × 4      ← one MUI Accordion per category
    │   ├── ActivityRow × n      ← dynamically added rows
    │   │   ├── ActivitySelect   ← MUI Select (activities for this category)
    │   │   ├── QuantityInput    ← MUI TextField type="number"
    │   │   ├── UnitLabel        ← read-only, resolved from selected activity
    │   │   └── RemoveButton     ← IconButton
    │   └── AddRowButton         ← "+ Add activity"
    ├── CalculateButton          ← disabled until ≥1 valid row exists
    └── ResultsPanel             ← only rendered after a successful calculate
        ├── TotalCard            ← big number: X kg CO₂e
        └── ResultRow × n        ← per-activity breakdown with factor provenance
```

---

## 4. State shape

Local state in `FootprintCalculator`:

```ts
type InputRow = { rowId: string; activityId: string; quantity: string };

// keyed by categoryId
const [rows, setRows] = useState<Record<string, InputRow[]>>({
  transportation: [],
  energy: [],
  diet: [],
  waste: [],
});
```

On "Calculate", flatten all rows into `CalculationInput[]` (skip rows with empty quantity
or no activity selected) and fire the mutation.

---

## 5. Interaction flow

1. Page loads → `useActivities()` fetches and groups activities by category
2. Each `CategorySection` renders as a collapsed MUI Accordion
3. User expands a category, clicks "+ Add activity"
4. A row appears: dropdown of activities for that category + quantity field
5. Unit label auto-updates when activity is selected (resolved from registry)
6. User fills in ≥1 row across any categories
7. "Calculate Footprint" button (bottom of page) becomes enabled
8. On click → `POST /v1/calculate` → `ResultsPanel` renders below the form
9. User can keep editing rows; re-calculating updates results in place

---

## 6. MUI components

| Purpose | Component |
|---------|-----------|
| Category sections | `Accordion`, `AccordionSummary`, `AccordionDetails` |
| Activity dropdown | `Select`, `MenuItem` |
| Quantity input | `TextField` type="number" |
| Remove row | `IconButton` + `DeleteOutlineIcon` |
| Add row / Calculate | `Button` |
| Results total | `Card`, `Typography` |
| Loading state | `CircularProgress` |

---

## 7. Implementation order

1. **Package cleanup** — remove GraphQL deps, update Vite proxy
2. **`src/lib/api.ts`** — typed fetch wrappers
3. **`src/hooks/useActivities.ts`** — fetch + group by category
4. **`src/hooks/useCalculate.ts`** — calculate mutation
5. **`src/components/ActivityRow.tsx`** — select + quantity + unit + remove
6. **`src/components/CategorySection.tsx`** — accordion + row list + add button
7. **`src/components/ResultsPanel.tsx`** — total card + per-activity breakdown
8. **`src/components/FootprintCalculator.tsx`** — wires state, sections, results
9. **`src/App.tsx`** — render `FootprintCalculator`
