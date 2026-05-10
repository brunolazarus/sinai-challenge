# 0005 — Registry Type Safety, Transformations Refactor & Shared Constants

**Date:** 2026-05-10

## Summary

Hardened the emission registry with compile-time type enforcement across all three
constrained fields (`transformation`, `inputUnit`, `category`). Refactored transformations
from a string-keyed switch statement to self-contained `apply` functions. Added four new
transformations (time-scaling and unit-conversion) with corresponding activities and factors.
Propagated the shared constants into the frontend so category strings are no longer hardcoded
in component files.

---

## Changed

### `packages/shared`

**`src/constants.ts`**

Converted all three registry constant arrays/objects to a consistent `const` object pattern
so named keys can be used instead of raw strings:

| Constant | Before | After |
|----------|--------|-------|
| `EMISSION_CATEGORIES` | `["transportation", ...]` array | `{ TRANSPORTATION: "transportation", ... }` object |
| `TRANSFORMATION_IDS` | `["simple_multiply", ...]` array | `{ SIMPLE_MULTIPLY: "simple_multiply", ... }` object |
| `INPUT_UNITS` | _(new)_ | `{ MILE: "mile", KWH: "kWh", KG: "kg", ... }` object |

Derived types updated from `[number]` (array index) to `[keyof typeof ...]` (object values):

```ts
export type EmissionCategory  = (typeof EMISSION_CATEGORIES)[keyof typeof EMISSION_CATEGORIES];
export type TransformationId  = (typeof TRANSFORMATION_IDS)[keyof typeof TRANSFORMATION_IDS];
export type InputUnit         = (typeof INPUT_UNITS)[keyof typeof INPUT_UNITS];
```

**`src/types.ts`**

- `Activity.transformation: string` → `Activity.transformation: TransformationId`
- `Activity.inputUnit: string` → `Activity.inputUnit: InputUnit`
- `CalculationResult.inputUnit: string` → `CalculationResult.inputUnit: InputUnit`

---

### `apps/api`

**`src/lib/registry/transformations.ts`**

Introduced a backend-only `TransformationDef` interface that extends the shared
`Transformation` with an `apply` function:

```ts
interface TransformationDef extends Omit<Transformation, "id"> {
  id: TransformationId;
  apply: (input: number, factor: number) => number;
}
```

The `apply` field is silently dropped when `c.json()` serializes the response, so
`GET /v1/transformations` continues to return clean `{ id, label, formula }` objects.

Added four new transformations:

| ID | Formula | Use case |
|----|---------|----------|
| `annualized` | `input × 365 × factor` | Daily miles → annual footprint |
| `weekly_to_yearly` | `input × 52 × factor` | Weekly food consumption → annual |
| `input_km` | `(input / 1.60934) × factor` | Kilometres input, factor per mile |
| `input_lbs` | `(input / 2.20462) × factor` | Pounds input, factor per kg |

**`src/lib/calculator.ts`**

Removed the `applyTransformation` switch statement. Calculator now calls
`transformation.apply(input.quantity, factor.value)` directly — adding a new transformation
no longer requires touching the calculator.

**`src/lib/registry/activities.ts`**

- All `inputUnit` fields now use `INPUT_UNITS.*` constants
- All `transformation` fields now use `TRANSFORMATION_IDS.*` constants
- Fixed bug: `recycled.transformation` was `""` (empty string); restored to `TRANSFORMATION_IDS.SIMPLE_MULTIPLY`

Added four new activities wiring up the new transformations:

| ID | Category | Input unit | Transformation |
|----|----------|-----------|----------------|
| `gasoline_car_daily` | transportation | `mile/day` | `annualized` |
| `gasoline_car_km` | transportation | `km` | `input_km` |
| `beef_weekly` | diet | `kg/week` | `weekly_to_yearly` |
| `beef_lbs` | diet | `lb` | `input_lbs` |

**`src/lib/registry/factors.ts`**

- Added `electricity_egrid2023_northeast` (0.21 kg CO₂e/kWh, NPCC subregion) — first
  case of two factors for the same activity, demonstrating the multi-factor override model
- Added factors for the four new activities above (reuse same `value` as the base activity,
  transformation handles the unit conversion)

**`src/routes/registry.ts`**

Updated `z.enum()` call to extract values from the new object-shaped `EMISSION_CATEGORIES`:

```ts
const EMISSION_CATEGORY_VALUES = Object.values(EMISSION_CATEGORIES) as [EmissionCategory, ...EmissionCategory[]];
z.enum(EMISSION_CATEGORY_VALUES)
```

**`src/lib/calculator.test.ts`**

Added four tests covering the new transformations (`annualized`, `weekly_to_yearly`,
`input_km`, `input_lbs`). Total API tests: **36** (15 calculator unit + 21 route integration).

---

### `apps/web`

**`src/lib/api.ts`**

- `activities(category?: string)` → `activities(category?: EmissionCategory)`
- `factors(category?: string)` → `factors(category?: EmissionCategory)`

**`src/hooks/useActivities.ts`**

- `ActivitiesByCategory` tightened from `Record<string, Activity[]>` to
  `Record<EmissionCategory, Activity[]>`
- Accumulator initialized with all four keys pre-filled using `EMISSION_CATEGORIES`,
  removing the `if (!acc[category])` guard

**`src/components/FootprintCalculator.tsx`**

Replaced the local hardcoded `CATEGORIES` array with `Object.values(EMISSION_CATEGORIES)`
from shared. Labels are derived at render time (`id.charAt(0).toUpperCase() + id.slice(1)`).

---

## Notes

- TypeScript `enum` keyword was considered for the registry constants but rejected in favour
  of `const` objects: `enum` compiles to a JS IIFE with reverse mapping, adds runtime weight,
  and causes surprises with string comparison. The `const` object + derived union type gives
  identical ergonomics (autocomplete, rename-refactor) with zero runtime cost.
- `z.enum()` in Zod v3 requires a `readonly [string, ...string[]]` tuple, not a plain object.
  `Object.values()` returns `string[]`, requiring a cast to satisfy the non-empty tuple
  constraint. This is a Zod API limitation, not a type-safety regression.
