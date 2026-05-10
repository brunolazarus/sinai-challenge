# Plan: Category-by-Category Calculator UI

> **Status: Complete.** All phases implemented. This document reflects the final design.

## Overview

The carbon footprint calculator frontend is a category-driven form. Each of the four
emission categories (Transportation, Energy, Diet, Waste) gets its own accordion section.
Every activity within a category is always visible with its own labelled input field —
users fill in amounts for the activities that apply to them, then submit to calculate.

---

## Final Component Tree

```
App
└── FootprintCalculator          ← orchestrates state + layout
    ├── CategorySection × 4      ← one MUI Accordion per category
    │   └── ActivityInput × n    ← one input per activity (fixed, not user-added)
    │       ├── Activity label   ← read-only, from registry
    │       ├── QuantityInput    ← MUI TextField type="number"
    │       └── UnitLabel        ← read-only, from activity.inputUnit
    ├── CalculateButton          ← disabled until ≥1 quantity > 0
    └── ResultsPanel             ← rendered after a successful calculate
        ├── TotalCard            ← totalKgCO2e on primary.main background
        └── ResultRow × n        ← per-activity breakdown with factor provenance
```

---

## State Shape

Flat map in `FootprintCalculator` — one entry per activity ID the user has touched:

```ts
// activityId → raw quantity string (empty = not entered)
const [quantities, setQuantities] = useState<Record<string, string>>({});
```

On "Calculate", entries are filtered to `quantity > 0` and mapped to `CalculationInput[]`
before calling `POST /v1/calculate`.

---

## Interaction Flow

1. Page loads → `useActivities()` fetches and groups activities by category
2. Each `CategorySection` renders as a collapsed MUI Accordion
3. User expands a category — all activities for that category are visible immediately
4. User types an amount into any input field
5. The accordion header shows how many activities have been filled (e.g. "2 activities filled")
6. "Calculate Footprint" button becomes enabled once at least one quantity > 0 exists
7. On click → `POST /v1/calculate` → `ResultsPanel` renders below the form
8. User can keep editing inputs; re-calculating updates results in place

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Fixed inputs per activity (not user-added rows) | Reduces friction — no "add row" step; all options are discoverable upfront |
| Flat `Record<activityId, string>` state | Simpler than `Record<categoryId, InputRow[]>`; no row IDs needed |
| `staleTime: Infinity` on `useActivities` | Registry data is static at runtime — no need to refetch |
| `factorId` optional on calculate | API defaults to US 2023 EPA factors; override available for region/year |

---

## Implementation Summary

| Step | File | Status |
|------|------|--------|
| 0 | Package cleanup, Vite proxy | ✅ |
| 1 | `src/lib/api.ts` — typed fetch wrapper | ✅ |
| 2 | `src/hooks/useActivities.ts`, `useCalculate.ts` | ✅ |
| 3 | `src/components/ActivityInput.tsx` | ✅ |
| 4 | `src/components/CategorySection.tsx` | ✅ |
| 5 | `src/components/ResultsPanel.tsx` | ✅ |
| 6 | `src/components/FootprintCalculator.tsx` | ✅ |
| 7 | `src/App.tsx` — ThemeProvider + render | ✅ |
| 8 | Tests — `CategorySection.test.tsx` | ✅ |
