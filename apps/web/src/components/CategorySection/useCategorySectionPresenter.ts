import type { EmissionCategory } from "@sinai/shared";
import { useActivitiesForCategory } from "../../hooks/useActivities";

export const useCategorySectionPresenter = (
  categoryId: EmissionCategory,
  quantities: Record<string, string>,
) => {
  const activities = useActivitiesForCategory(categoryId);
  const filledCount = activities.filter(
    (a) => quantities[a.id] && Number(quantities[a.id]) > 0,
  ).length;
  const label = `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}`;
  return { activities, filledCount, label };
};
