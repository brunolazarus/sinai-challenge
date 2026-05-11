import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  Activity,
  CalculationInput,
  EmissionCategory,
} from "@sinai/shared";
import { EMISSION_CATEGORIES } from "@sinai/shared";
import { api } from "../lib/api";

export type ActivitiesByCategory = Record<EmissionCategory, Activity[]>;

export const groupActivitiesByCategory = (data: {
  activities: Activity[];
}): ActivitiesByCategory => {
  return data.activities.reduce<ActivitiesByCategory>(
    (acc, activity) => {
      if (acc[activity.category]) {
        acc[activity.category].push(activity);
      }
      return acc;
    },
    {
      [EMISSION_CATEGORIES.TRANSPORTATION]: [],
      [EMISSION_CATEGORIES.ENERGY]: [],
      [EMISSION_CATEGORIES.DIET]: [],
      [EMISSION_CATEGORIES.WASTE]: [],
    },
  );
};

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
  return data?.activities.filter((a) => a.category === category) ?? [];
};

export const useActivitiesByCategory = () => {
  // state
  const { data, isLoading } = useActivities();
  const [selectedCategory, setSelectedCategory] =
    useState<EmissionCategory | null>(EMISSION_CATEGORIES.TRANSPORTATION);

  const [quantities, setQuantities] = useState<Record<string, string>>({});

  // transformations
  const activitiesByCategory = data ? groupActivitiesByCategory(data) : null;

  // handlers
  const toggleCategory = (category: EmissionCategory) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const handleQuantityChange = (activityId: string, quantity: string) => {
    setQuantities((prev) => ({ ...prev, [activityId]: quantity }));
  };

  const validInputs = useMemo<CalculationInput[]>(() => {
    return Object.entries(quantities)
      .filter(([, q]) => q !== "" && Number(q) > 0)
      .map(([activityId, q]) => ({ activityId, quantity: Number(q) }));
  }, [quantities]);

  return {
    activitiesByCategory,
    selectedCategory,
    toggleCategory,
    isLoading,
    handleQuantityChange,
    validInputs,
    quantities,
  };
};
