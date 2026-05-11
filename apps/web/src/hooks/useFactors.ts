import { useQuery } from "@tanstack/react-query";
import type { EmissionFactor } from "@sinai/shared";
import { api } from "../lib/api";

export const useFactors = (): Record<string, EmissionFactor[]> => {
  const { data } = useQuery({
    queryKey: ["factors"],
    queryFn: () => api.factors(),
    staleTime: Infinity,
  });

  if (!data) return {};

  return data.factors.reduce<Record<string, EmissionFactor[]>>((acc, factor) => {
    if (!acc[factor.activity]) acc[factor.activity] = [];
    acc[factor.activity].push(factor);
    return acc;
  }, {});
};
