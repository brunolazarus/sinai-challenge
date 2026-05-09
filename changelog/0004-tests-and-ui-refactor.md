# 0004 — Tests & UI Refactor: Direct Activity Inputs

**Date:** 2026-05-09

## Summary

Added a full test suite across both apps and refactored the frontend UX from a
dynamic-row-with-dropdown model to a direct-input-per-activity model, where every
activity in a category is always visible with its own labelled input field.

---

## Added

### `apps/api`

**`src/routes/routes.test.ts`** — 21 integration tests covering every HTTP endpoint
using Hono's `app.request()` helper (no mocking, no test server):

| Group | Tests |
|-------|-------|
| `GET /health` | 200 + `{ status: "ok" }` |
| `GET /v1/categories` | returns all 4 categories; shape validation |
| `GET /v1/activities` | all activities; shape; category filter; 400 on bad filter |
| `GET /v1/transformations` | at least one; shape |
| `GET /v1/factors` | all factors; shape; category filter narrows set; 400 on bad filter |
| `POST /v1/calculate` | single input; multi-input sum; provenance; factorId override; 400 on empty inputs, unknown activityId, unknown factorId, negative quantity, missing body |

Total API tests after this change: **32** (11 calculator unit + 21 route integration).

### `apps/web`

**Dev dependencies added:** `@testing-library/react`, `@testing-library/user-event`,
`@testing-library/jest-dom`, `jsdom`

**`vitest.config.ts`** — Vitest config for the web package: `environment: "jsdom"`,
`setupFiles: ["./src/test/setup.ts"]`.

**`src/test/setup.ts`** — Test setup:
- Imports `@testing-library/jest-dom/vitest` for matcher type augmentation and runtime extend
- Registers `afterEach(cleanup)` (required because `@testing-library/react` v16 auto-cleanup
  relies on Vitest globals being enabled; explicit registration avoids enabling globals)
- Mocks `window.matchMedia` (absent in jsdom, required by MUI)

**`src/components/ActivityInput.tsx`** — New atom component replacing `ActivityRow` for
the direct-input UX: renders a fixed activity label, a number `TextField`, and a unit label.
No dropdown, no remove button.

**`src/components/CategorySection.test.tsx`** — 7 tests for `CategorySection`:
- Label renders in AccordionSummary
- Filled-activity count hidden when none, singular/plural when present
- Zero and empty quantities not counted as filled
- Correct number of `spinbutton` inputs when expanded
- `onQuantityChange` called with the correct `activityId` on input

---

## Changed

### `apps/web`

**`src/components/CategorySection.tsx`** — Props interface replaced:

| Before | After |
|--------|-------|
| `rows: InputRow[]` | `quantities: Record<string, string>` |
| `onAddRow / onRemoveRow / onUpdateRow` | `onQuantityChange(activityId, quantity)` |
| Renders `ActivityRow` (dropdown + remove) | Renders `ActivityInput` (label + number input) |
| Entry count = total rows | Entry count = activities with quantity > 0 |

**`src/components/FootprintCalculator.tsx`** — State simplified from
`Record<CategoryId, InputRow[]>` to a flat `Record<string, string>` (activityId → raw
quantity string). `addRow` / `removeRow` / `updateRow` removed; single `handleQuantityChange`
replaces all three. `validInputs` derivation unchanged in semantics (filter non-positive,
map to `CalculationInput[]`).

---

## Notes

- `@testing-library/jest-dom` v6 ships a `/vitest` entry point that calls
  `expect.extend(matchers)` using Vitest's own `expect` import — using the bare
  `@testing-library/jest-dom` import caused `ReferenceError: expect is not defined`
  because the global was not yet injected when the setup file ran.
- MUI `TextField` labels are associated with a `<div>`-wrapped input, not the raw
  `<input>` element, so `getByLabelText` throws "non-labellable element". Use
  `getAllByRole("spinbutton")` to query number inputs in MUI TextFields.

---

## What's next

- `ActivityRow.tsx` is now unreferenced — can be removed in a cleanup pass.
- `InputRow` type in `src/types.ts` is no longer used and can be removed.
- Consider adding tests for `ResultsPanel` and `FootprintCalculator` (the latter
  requires mocking `useActivities` and `useCalculate`).
