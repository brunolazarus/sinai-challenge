import { useFactors } from "../../hooks/useFactors";

export const useActivityInputPresenter = (activityId: string) => {
  const factorsByActivity = useFactors();
  const factors = factorsByActivity[activityId] ?? [];
  return { methodology: factors[0]?.methodology };
};
