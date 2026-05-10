import { describe, it, expect } from "vitest";
import { app } from "../app.js";
import { EMISSION_CATEGORIES } from "@sinai/shared";

async function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await json(res)).toEqual({ status: "ok" });
  });
});

describe("GET /v1/categories", () => {
  it("returns all 4 categories", async () => {
    const res = await app.request("/v1/categories");
    expect(res.status).toBe(200);
    const body = await json(res);
    const categories = body["categories"] as { id: string }[];
    expect(categories).toHaveLength(4);
    expect(categories.map((c) => c.id)).toEqual(
      expect.arrayContaining(Object.values(EMISSION_CATEGORIES)),
    );
  });

  it("each category has id and label", async () => {
    const res = await app.request("/v1/categories");
    const body = await json(res);
    const categories = body["categories"] as { id: string; label: string }[];
    categories.forEach((c) => {
      expect(c).toHaveProperty("id");
      expect(c).toHaveProperty("label");
    });
  });
});

describe("GET /v1/activities", () => {
  it("returns all activities without a filter", async () => {
    const res = await app.request("/v1/activities");
    expect(res.status).toBe(200);
    const body = await json(res);
    const activities = body["activities"] as unknown[];
    expect(activities.length).toBeGreaterThan(0);
  });

  it("each activity has the required fields", async () => {
    const res = await app.request("/v1/activities");
    const body = await json(res);
    const first = (body["activities"] as Record<string, unknown>[])[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("category");
    expect(first).toHaveProperty("label");
    expect(first).toHaveProperty("inputUnit");
    expect(first).toHaveProperty("transformation");
  });

  it("filters to the requested category", async () => {
    const res = await app.request("/v1/activities?category=transportation");
    expect(res.status).toBe(200);
    const body = await json(res);
    const activities = body["activities"] as { category: string }[];
    expect(activities.length).toBeGreaterThan(0);
    activities.forEach((a) =>
      expect(a.category).toBe(EMISSION_CATEGORIES.TRANSPORTATION),
    );
  });

  it("returns 400 for an unknown category", async () => {
    const res = await app.request("/v1/activities?category=unknown");
    expect(res.status).toBe(400);
  });
});

describe("GET /v1/transformations", () => {
  it("returns at least one transformation", async () => {
    const res = await app.request("/v1/transformations");
    expect(res.status).toBe(200);
    const body = await json(res);
    const transformations = body["transformations"] as Record<
      string,
      unknown
    >[];
    expect(transformations.length).toBeGreaterThan(0);
    expect(transformations[0]).toHaveProperty("id");
    expect(transformations[0]).toHaveProperty("label");
    expect(transformations[0]).toHaveProperty("formula");
  });
});

describe("GET /v1/factors", () => {
  it("returns all factors without a filter", async () => {
    const res = await app.request("/v1/factors");
    expect(res.status).toBe(200);
    const body = await json(res);
    const factors = body["factors"] as unknown[];
    expect(factors.length).toBeGreaterThan(0);
  });

  it("each factor has the required fields", async () => {
    const res = await app.request("/v1/factors");
    const body = await json(res);
    const first = (body["factors"] as Record<string, unknown>[])[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("activity");
    expect(first).toHaveProperty("value");
    expect(first).toHaveProperty("unit");
    expect(first).toHaveProperty("region");
    expect(first).toHaveProperty("year");
    expect(first).toHaveProperty("source");
    expect(first).toHaveProperty("methodology");
  });

  it("filters factors by category", async () => {
    const [energyRes, allRes] = await Promise.all([
      app.request("/v1/factors?category=energy"),
      app.request("/v1/factors"),
    ]);
    expect(energyRes.status).toBe(200);
    const energy = ((await energyRes.json()) as Record<string, unknown[]>)[
      "factors"
    ];
    const all = ((await allRes.json()) as Record<string, unknown[]>)["factors"];
    expect(energy!.length).toBeGreaterThan(0);
    expect(energy!.length).toBeLessThan(all!.length);
  });

  it("returns 400 for an unknown category", async () => {
    const res = await app.request("/v1/factors?category=unknown");
    expect(res.status).toBe(400);
  });
});

describe("POST /v1/calculate", () => {
  function post(body: unknown) {
    return app.request("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns a footprint summary for a single valid input", async () => {
    const res = await post({
      inputs: [{ activityId: "gasoline_car", quantity: 100 }],
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body).toHaveProperty("totalKgCO2e");
    expect(body).toHaveProperty("results");
    expect((body["results"] as unknown[]).length).toBe(1);
    expect(body["totalKgCO2e"] as number).toBeCloseTo(40.4, 1);
  });

  it("sums multiple inputs correctly", async () => {
    const res = await post({
      inputs: [
        { activityId: "gasoline_car", quantity: 100 },
        { activityId: "beef", quantity: 10 },
      ],
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect((body["results"] as unknown[]).length).toBe(2);
    expect(body["totalKgCO2e"] as number).toBeCloseTo(40.4 + 270, 0);
  });

  it("preserves factor provenance in results", async () => {
    const res = await post({
      inputs: [{ activityId: "gasoline_car", quantity: 1 }],
    });
    const body = await json(res);
    const result = (body["results"] as { factor: string }[])[0];
    expect(result!.factor).toBe("gasoline_car_epa2023_us");
  });

  it("accepts an explicit factorId override", async () => {
    const res = await post({
      inputs: [
        {
          activityId: "gasoline_car",
          quantity: 100,
          factorId: "gasoline_car_epa2023_us",
        },
      ],
    });
    expect(res.status).toBe(200);
  });

  it("returns 400 when inputs array is empty", async () => {
    const res = await post({ inputs: [] });
    expect(res.status).toBe(400);
  });

  it("returns 400 for an unknown activityId", async () => {
    const res = await post({
      inputs: [{ activityId: "unknown_activity", quantity: 10 }],
    });
    expect(res.status).toBe(400);
    const body = await json(res);
    expect(body["error"] as string).toMatch(/unknown_activity/i);
  });

  it("returns 400 for an unknown factorId override", async () => {
    const res = await post({
      inputs: [
        { activityId: "beef", quantity: 10, factorId: "nonexistent_factor" },
      ],
    });
    expect(res.status).toBe(400);
    const body = await json(res);
    expect(body["error"] as string).toMatch(/nonexistent_factor/i);
  });

  it("returns 400 for a negative quantity", async () => {
    const res = await post({ inputs: [{ activityId: "beef", quantity: -1 }] });
    expect(res.status).toBe(400);
  });

  it("returns 400 when the request body is missing", async () => {
    const res = await app.request("/v1/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});
