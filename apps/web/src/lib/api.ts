import type {
  Activity,
  Category,
  Transformation,
  EmissionFactor,
  CalculationInput,
  FootprintSummary,
} from "@sinai/shared";

// ── Primitives ────────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ── Registry ──────────────────────────────────────────────────────────────────

export const api = {
  categories: (): Promise<{ categories: Category[] }> =>
    get("/v1/categories"),

  activities: (category?: string): Promise<{ activities: Activity[] }> =>
    get(category ? `/v1/activities?category=${category}` : "/v1/activities"),

  transformations: (): Promise<{ transformations: Transformation[] }> =>
    get("/v1/transformations"),

  factors: (category?: string): Promise<{ factors: EmissionFactor[] }> =>
    get(category ? `/v1/factors?category=${category}` : "/v1/factors"),

  // ── Calculation ─────────────────────────────────────────────────────────────

  calculate: (inputs: CalculationInput[]): Promise<FootprintSummary> =>
    post("/v1/calculate", { inputs }),
};
