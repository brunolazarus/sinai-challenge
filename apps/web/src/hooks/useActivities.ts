import { useQuery } from "@tanstack/react-query";
import type { Activity } from "@sinai/shared";
import { api } from "../lib/api";

export type ActivitiesByCategory = Record<string, Activity[]>;

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => api.activities(),
    select: (data): ActivitiesByCategory =>
      data.activities.reduce<ActivitiesByCategory>((acc, activity) => {
        if (!acc[activity.category]) acc[activity.category] = [];
        acc[activity.category]!.push(activity);
        return acc;
      }, {}),
    staleTime: Infinity,
  });
}
