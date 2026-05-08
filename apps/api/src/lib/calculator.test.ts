import { describe, it, expect } from "vitest";
import { calculateSingle, calculateFootprint } from "./calculator.js";

describe("calculateSingle", () => {
  it("calculates gasoline car emissions", () => {
    const result = calculateSingle({ activityId: "gasoline_car", quantity: 100 });
    expect(result.result.kgCO2e).toBeCloseTo(40.4, 1);
    expect(result.activity).toBe("gasoline_car");
    expect(result.factor).toBe("gasoline_car_epa2023_us");
    expect(result.inputUnit).toBe("mile");
  });

  it("calculates electricity emissions", () => {
    const result = calculateSingle({ activityId: "electricity", quantity: 1000 });
    expect(result.result.kgCO2e).toBeCloseTo(386, 0);
    expect(result.factor).toBe("electricity_egrid2023_us");
  });

  it("calculates beef emissions", () => {
    const result = calculateSingle({ activityId: "beef", quantity: 10 });
    expect(result.result.kgCO2e).toBeCloseTo(270, 0);
  });

  it("calculates landfill waste emissions", () => {
    const result = calculateSingle({ activityId: "landfill", quantity: 100 });
    expect(result.result.kgCO2e).toBeCloseTo(52, 0);
  });

  it("returns zero for zero quantity (boundary value)", () => {
    const result = calculateSingle({ activityId: "beef", quantity: 0 });
    expect(result.result.kgCO2e).toBe(0);
  });

  it("accepts an explicit factorId override", () => {
    const result = calculateSingle({ activityId: "beef", quantity: 10, factorId: "beef_epa2023_us" });
    expect(result.result.kgCO2e).toBeCloseTo(270, 0);
    expect(result.factor).toBe("beef_epa2023_us");
  });

  it("throws for unknown activity", () => {
    expect(() => calculateSingle({ activityId: "unknown_activity", quantity: 100 })).toThrow(
      "Unknown activity: unknown_activity"
    );
  });

  it("throws for unknown factorId override", () => {
    expect(() =>
      calculateSingle({ activityId: "beef", quantity: 10, factorId: "nonexistent_factor" })
    ).toThrow("No emission factor found for activity: beef");
  });
});

describe("calculateFootprint", () => {
  it("sums multiple inputs correctly", () => {
    const result = calculateFootprint([
      { activityId: "gasoline_car", quantity: 100 },
      { activityId: "beef", quantity: 10 },
    ]);
    expect(result.totalKgCO2e).toBeCloseTo(40.4 + 270, 0);
    expect(result.results).toHaveLength(2);
  });

  it("returns zero total for empty input list (boundary value)", () => {
    const result = calculateFootprint([]);
    expect(result.totalKgCO2e).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("preserves provenance on each result", () => {
    const result = calculateFootprint([
      { activityId: "bus", quantity: 50 },
      { activityId: "electricity", quantity: 200 },
    ]);
    expect(result.results[0]?.activity).toBe("bus");
    expect(result.results[0]?.factor).toBe("bus_epa2023_us");
    expect(result.results[1]?.activity).toBe("electricity");
    expect(result.results[1]?.factor).toBe("electricity_egrid2023_us");
  });
});
