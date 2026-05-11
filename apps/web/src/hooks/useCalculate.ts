import { useMutation } from "@tanstack/react-query";
import type { CalculationInput } from "@sinai/shared";
import { api } from "../lib/api";

export const useCalculate = () =>
  useMutation({
    mutationFn: (inputs: CalculationInput[]) => api.calculate(inputs),
  });
