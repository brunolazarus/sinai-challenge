# Plan: Natural Language → Structured Input Layer

**Goal:** Add a `POST /v1/parse` endpoint that accepts a free-text description of activities (e.g. "I drove 200 miles and took 2 long-haul flights") and returns a `ParsedInput[]` array ready to pass to `POST /v1/calculate`. The frontend gets a textarea that pre-fills the existing form fields for user review before calculating.

**Provider:** OpenRouter (OpenAI-compatible API) using `OPENROUTER_API_KEY` env var.

**UX flow:** Parse → user reviews pre-filled inputs → user edits if needed → Calculate.

---

## Phase 1 — Backend

### 1. Add `openai` package to `apps/api/`

```
pnpm add openai --filter @sinai/api
```

OpenRouter uses an OpenAI-compatible API, so the `openai` SDK works with a custom `baseURL`.

---

### 2. Add shared types to `packages/shared/src/types.ts`

```ts
export interface ParseRequest {
  text: string;
}

export interface ParsedInput extends CalculationInput {
  confidence: "high" | "low"; // lets the UI flag uncertain extractions
}

export interface ParseResponse {
  inputs: ParsedInput[];
}
```

---

### 3. Create `apps/api/src/lib/openrouter.ts`

- Instantiate `OpenAI` with `baseURL: "https://openrouter.ai/api/v1"` and key from `OPENROUTER_API_KEY`.
- Export a single `parseActivities(text: string): Promise<ParsedInput[]>` function.
- Uses **tool calling** (`tools` + `tool_choice: "required"`) to force structured JSON output — define the tool schema as `{ inputs: Array<{ activityId, quantity, confidence }> }`.
- The system prompt injects the full activity registry (IDs, labels, inputUnits) as context so the model maps natural language to real `activityId` values.
- Model: `OPENROUTER_MODEL` env var, defaulting to `anthropic/claude-3-5-haiku` (fast, cheap for extraction).
- Throws `ServiceUnavailableError` if `OPENROUTER_API_KEY` is not set.

---

### 4. Create `apps/api/src/routes/parse.ts`

- `POST /v1/parse`
- Request schema: `{ text: z.string().min(1).max(2000) }`
- Response schema: `{ inputs: ParsedInputSchema[] }`
- Calls `parseActivities(text)`, returns the result.
- Returns `503` if OpenRouter is unavailable (key missing), `400` on validation error, `502` on OpenRouter API failure.

---

### 5. Register in `apps/api/src/app.ts`

```ts
import { registerParseRoutes } from "./routes/parse.js";
registerParseRoutes(app);
```

---

## Phase 2 — Frontend

### 6. Add `api.parse()` to `apps/web/src/lib/api.ts`

```ts
parse: (text: string): Promise<ParseResponse> =>
  post("/v1/parse", { text }),
```

---

### 7. Create `apps/web/src/hooks/useParse.ts`

- `useMutation` wrapper around `api.parse()`.
- Returns `{ mutate: parse, data, isPending, error }`.

---

### 8. Create `apps/web/src/components/NaturalLanguageInput/`

Two files: `index.tsx` + `useNaturalLanguageInputPresenter.ts`

The presenter:

- Accepts a callback `onParsed(inputs: ParsedInput[])`.
- Manages `text` state (textarea value).
- Calls `useParse` on submit, then calls `onParsed` when data arrives.

The UI:

- `<textarea>` with placeholder e.g. `"I drove 200 miles and ate beef 3 times a week..."`
- "Parse with AI" button (disabled while pending).
- Loading state: spinner + "Parsing..."
- Error state: inline error message.
- Hands parsed inputs up via `onParsed` — no results display in this component.

---

### 9. Integrate into `apps/web/src/components/FootprintCalculator/`

In `useFootprintCalculatorPresenter.ts`, add:

```ts
const handleParsed = (inputs: ParsedInput[]) => {
  const next: Record<string, string> = {};
  for (const { activityId, quantity } of inputs) {
    next[activityId] = String(quantity);
  }
  setQuantities((prev) => ({ ...prev, ...next }));
};
```

In `index.tsx`, render `<NaturalLanguageInput onParsed={handleParsed} />` above the category sections. Parsed quantities populate the existing form fields — the user sees them pre-filled and can edit before clicking Calculate.

---

## Phase 3 — Config

### 10. Env vars

Document in `apps/api/.env.example` (or root `.env.example`):

```
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=anthropic/claude-3-5-haiku   # optional, this is the default
```

The API returns `503` when the key is absent so the rest of the app still works without OpenRouter configured.

---

## Key Decisions

| Decision                               | Rationale                                                                     |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| Tool calling over JSON mode            | Forces output to match the exact schema; model cannot return free-form text   |
| Activity list in system prompt         | Eliminates hallucinated `activityId` values — model picks from a finite set   |
| `confidence` field                     | Lets the UI optionally flag low-confidence extractions (e.g. ambiguous units) |
| Parse → review → calculate             | User stays in control; no silent auto-submit                                  |
| `503` on missing key                   | Rest of the app still works without OpenRouter configured                     |
| OpenRouter over Anthropic SDK directly | User-supplied key; OpenRouter provides model flexibility via a single API     |

<!-- suggested models -->
<!-- voice processing -->

- gemma-4
<!-- function calling -->
- gpt oss

-> research

- structured output depends on the quality of the provider. check models that have a good validation
