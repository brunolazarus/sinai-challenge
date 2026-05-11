import { describe, it, expect } from "vitest";
import { app } from "../app.js";

async function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

function post(body: unknown) {
  return app.request("/v1/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /v1/calculate", () => {
  it("returns a footprint summary for a single valid input", async () => {
    const res = await post({ inputs: [{ activityId: "gasoline_car", quantity: 100 }] });
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
    const res = await post({ inputs: [{ activityId: "gasoline_car", quantity: 1 }] });
    const body = await json(res);
    const result = (body["results"] as { factor: string }[])[0];
    expect(result!.factor).toBe("gasoline_car_epa2023_us");
  });

  it("accepts an explicit factorId override", async () => {
    const res = await post({
      inputs: [{ activityId: "gasoline_car", quantity: 100, factorId: "gasoline_car_epa2023_us" }],
    });
    expect(res.status).toBe(200);
  });

  it("returns 400 when inputs array is empty", async () => {
    const res = await post({ inputs: [] });
    expect(res.status).toBe(400);
  });

  it("returns 400 for an unknown activityId", async () => {
    const res = await post({ inputs: [{ activityId: "unknown_activity", quantity: 10 }] });
    expect(res.status).toBe(400);
    const body = await json(res);
    expect(body["error"] as string).toMatch(/unknown_activity/i);
  });

  it("returns 400 for an unknown factorId override", async () => {
    const res = await post({
      inputs: [{ activityId: "beef", quantity: 10, factorId: "nonexistent_factor" }],
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
