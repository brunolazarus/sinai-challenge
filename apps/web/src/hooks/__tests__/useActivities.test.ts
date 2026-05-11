import { describe, it, expect } from "vitest";
import { EMISSION_CATEGORIES } from "@sinai/shared";
import type { Activity } from "@sinai/shared";
import { groupActivitiesByCategory } from "../useActivities";

const makeActivity = (id: string, category: Activity["category"]): Activity => {
  return {
    id,
    label: id,
    category,
    inputUnit: "mile",
    transformation: "simple_multiply",
  };
}

describe("groupActivitiesByCategory", () => {
  it("returns all four category keys when input is empty", () => {
    const result = groupActivitiesByCategory({ activities: [] });
    expect(Object.keys(result)).toEqual(Object.values(EMISSION_CATEGORIES));
    Object.values(result).forEach((arr) => expect(arr).toEqual([]));
  });

  it("routes each activity to the correct category bucket", () => {
    const activities = [
      makeActivity("gasoline_car", EMISSION_CATEGORIES.TRANSPORTATION),
      makeActivity("electricity", EMISSION_CATEGORIES.ENERGY),
      makeActivity("beef", EMISSION_CATEGORIES.DIET),
      makeActivity("landfill", EMISSION_CATEGORIES.WASTE),
    ];
    const result = groupActivitiesByCategory({ activities });
    expect(result[EMISSION_CATEGORIES.TRANSPORTATION]).toHaveLength(1);
    expect(result[EMISSION_CATEGORIES.TRANSPORTATION][0].id).toBe("gasoline_car");
    expect(result[EMISSION_CATEGORIES.ENERGY][0].id).toBe("electricity");
    expect(result[EMISSION_CATEGORIES.DIET][0].id).toBe("beef");
    expect(result[EMISSION_CATEGORIES.WASTE][0].id).toBe("landfill");
  });

  it("groups multiple activities in the same category", () => {
    const activities = [
      makeActivity("gasoline_car", EMISSION_CATEGORIES.TRANSPORTATION),
      makeActivity("electric_car", EMISSION_CATEGORIES.TRANSPORTATION),
      makeActivity("train", EMISSION_CATEGORIES.TRANSPORTATION),
    ];
    const result = groupActivitiesByCategory({ activities });
    expect(result[EMISSION_CATEGORIES.TRANSPORTATION]).toHaveLength(3);
    expect(result[EMISSION_CATEGORIES.ENERGY]).toHaveLength(0);
  });

  it("does not crash on an unknown category — skips the entry", () => {
    const activities = [
      { ...makeActivity("unknown_activity", EMISSION_CATEGORIES.TRANSPORTATION), category: "unknown" as Activity["category"] },
    ];
    expect(() => groupActivitiesByCategory({ activities })).not.toThrow();
    const result = groupActivitiesByCategory({ activities });
    Object.values(EMISSION_CATEGORIES).forEach((cat) => {
      expect(result[cat]).toHaveLength(0);
    });
  });

  it("does not share array references between calls", () => {
    const activity = makeActivity("gasoline_car", EMISSION_CATEGORIES.TRANSPORTATION);
    const result1 = groupActivitiesByCategory({ activities: [activity] });
    const result2 = groupActivitiesByCategory({ activities: [] });
    expect(result1[EMISSION_CATEGORIES.TRANSPORTATION]).toHaveLength(1);
    expect(result2[EMISSION_CATEGORIES.TRANSPORTATION]).toHaveLength(0);
  });
});
