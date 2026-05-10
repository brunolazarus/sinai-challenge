import { useQuery } from "@tanstack/react-query";
import type { Activity, EmissionCategory } from "@sinai/shared";
import { EMISSION_CATEGORIES } from "@sinai/shared";
import { api } from "../lib/api";

export type ActivitiesByCategory = Record<EmissionCategory, Activity[]>;

const EMPTY_BY_CATEGORY: ActivitiesByCategory = {
  [EMISSION_CATEGORIES.TRANSPORTATION]: [],
  [EMISSION_CATEGORIES.ENERGY]: [],
  [EMISSION_CATEGORIES.DIET]: [],
  [EMISSION_CATEGORIES.WASTE]: [],
};

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => api.activities(),
    select: (data): ActivitiesByCategory =>
      data.activities.reduce<ActivitiesByCategory>(
        (acc, activity) => {
          acc[activity.category].push(activity);
          return acc;
        },
        { ...EMPTY_BY_CATEGORY },
      ),
    staleTime: Infinity,
  });
}
