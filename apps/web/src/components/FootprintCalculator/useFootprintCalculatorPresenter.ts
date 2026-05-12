import { useMemo, useState } from "react";
import type { CalculationInput, EmissionCategory } from "@sinai/shared";
import { EMISSION_CATEGORIES } from "@sinai/shared";
import { useActivities } from "../../hooks/useActivities";
import { useCalculate } from "../../hooks/useCalculate";
import { useDebounce } from "../../hooks/useDebounce";

export const useFootprintCalculatorPresenter = () => {
  const { isLoading } = useActivities();
  const [selectedCategory, setSelectedCategory] = useState<EmissionCategory | null>(
    EMISSION_CATEGORIES.TRANSPORTATION,
  );
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const { mutate: calculate, data: summary, isPending: calculating, error } = useCalculate();
  const showSpinner = useDebounce(calculating, 300);

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

  const handleCalculate = () => {
    if (validInputs.length > 0) calculate(validInputs);
  };

  return {
    selectedCategory,
    toggleCategory,
    isLoading,
    handleQuantityChange,
    quantities,
    validInputs,
    handleCalculate,
    summary,
    calculating,
    showSpinner,
    error,
  };
};
