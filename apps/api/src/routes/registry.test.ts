import { describe, it, expect } from "vitest";
import { app } from "../app.js";
import { EMISSION_CATEGORIES } from "@sinai/shared";

async function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

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
  it("returns at least one transformation with required fields", async () => {
    const res = await app.request("/v1/transformations");
    expect(res.status).toBe(200);
    const body = await json(res);
    const transformations = body["transformations"] as Record<string, unknown>[];
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
    const energy = ((await energyRes.json()) as Record<string, unknown[]>)["factors"];
    const all = ((await allRes.json()) as Record<string, unknown[]>)["factors"];
    expect(energy!.length).toBeGreaterThan(0);
    expect(energy!.length).toBeLessThan(all!.length);
  });

  it("returns 400 for an unknown category", async () => {
    const res = await app.request("/v1/factors?category=unknown");
    expect(res.status).toBe(400);
  });
});
