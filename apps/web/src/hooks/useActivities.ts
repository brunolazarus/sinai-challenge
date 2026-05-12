import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Activity, EmissionCategory } from "@sinai/shared";
import { api } from "../lib/api";

export const useActivities = () =>
  useQuery({
    queryKey: ["activities"],
    queryFn: () => api.activities(),
    staleTime: Infinity,
  });

export const useActivitiesForCategory = (
  category: EmissionCategory,
): Activity[] => {
  const { data } = useActivities();
  return useMemo(
    () =>
      data?.activities.filter((a) => a.category === category) ?? [],
    [data, category],
  );
};
