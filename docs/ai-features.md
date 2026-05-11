# AI Feature Ideas

Three tiers by effort and interview signal.

---

## Tier 1 — Simple API calls (1–2 days)

### Natural language input parser
Add a text box — *"Describe your week"* — and parse free text into structured `CalculationInput[]` to pre-fill the form.

**New endpoint:** `POST /v1/parse-activities`
```
body:    { text: string }
returns: CalculationInput[]
```

Send the user's text to Claude with the activity schema as context. Claude resolves ambiguity ("twice a week" → annualize, "a short flight" → `short_haul_flight`). No vector DB needed.

### Personalized reduction tips
After a calculation, stream back 3 targeted recommendations based on the user's actual `FootprintSummary`. Streaming makes it feel alive in a demo.

**New endpoint:** `POST /v1/recommendations`
```
body:    FootprintSummary
returns: ReadableStream (SSE)
```

---

## Tier 2 — RAG pipeline (3–5 days)

The `methodology` field on each `EmissionFactor` is already rich prose. The natural question to answer: *"Why is beef so high?"* or *"What's the RFI multiplier for flights?"*

**Architecture:**
1. At startup, embed each factor's `methodology` string (OpenAI embeddings or a local model)
2. Store in a vector store — pgvector, Chroma, Qdrant, or in-memory cosine similarity (viable at ~30 factors)
3. `POST /v1/ask` — embed the question → retrieve top-k factors → pass as context to Claude → return answer

**Note on scope:** with ~30 factors, a full vector DB is over-engineering. In-memory cosine similarity is O(n) and fast enough — worth calling out explicitly in an interview as a deliberate tradeoff.

---

## Tier 3 — MCP server (2–3 days, highest interview signal)

Expose the calculator as a tool for Claude Desktop or any MCP client. Turns the app into an agent-callable service — very few candidates will have shipped one.

**New workspace:** `apps/mcp/`

| Tool | Description |
|---|---|
| `list_activities` | Returns all activities grouped by category |
| `get_emission_factor` | Returns factor + methodology for an activity |
| `calculate_footprint` | Calls `POST /v1/calculate` and returns the summary |

```ts
server.tool(
  "calculate_footprint",
  { inputs: z.array(CalculationInputSchema) },
  async ({ inputs }) => {
    const res = await fetch("http://localhost:4000/v1/calculate", {
      method: "POST",
      body: JSON.stringify({ inputs }),
    });
    return res.json();
  },
);
```

**Demo story:** *"Claude can answer 'what's my footprint if I drive 10,000 miles a year and eat beef weekly?' — it calls my calculator tool and interprets the result."* That's a complete agentic loop.

---

## Priority matrix

| Feature | Effort | Interview signal |
|---|---|---|
| NL input parser | Low | API integration + UX thinking |
| Streaming recommendations | Low | Streaming, product sense |
| RAG Q&A on methodology | Medium | Understands embeddings + retrieval |
| MCP server | Medium | Differentiator — agentic ecosystem |

**Strongest narrative:** MCP server + NL input parser together — the app works standalone and as an agent tool.
