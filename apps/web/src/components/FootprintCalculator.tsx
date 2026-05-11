import { useState, useMemo } from "react";
import type { CalculationInput, EmissionCategory } from "@sinai/shared";
import { EMISSION_CATEGORIES } from "@sinai/shared";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useActivitiesByCategory } from "../hooks/useActivities";
import { useCalculate } from "../hooks/useCalculate";
import { useFactors } from "../hooks/useFactors";

import { CategorySection } from "./CategorySection";
import { ResultsPanel } from "./ResultsPanel";

const ORDERED_CATEGORIES = Object.values(
  EMISSION_CATEGORIES,
) as EmissionCategory[];

export const FootprintCalculator = () => {
  const { activitiesByCategory, selectedCategory, toggleCategory, isLoading } =
    useActivitiesByCategory();
  const factorsByActivity = useFactors();
  const {
    mutate: calculate,
    data: summary,
    isPending: calculating,
    error,
  } = useCalculate();

  const [quantities, setQuantities] = useState<Record<string, string>>({});

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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Carbon Footprint Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Enter amounts for the activities that apply to you, then calculate your
        estimated carbon footprint.
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error instanceof Error ? error.message : "Calculation failed."}
        </Typography>
      )}

      <Button
        variant="contained"
        size="large"
        startIcon={
          calculating ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <CalculateIcon />
          )
        }
        disabled={validInputs.length === 0 || calculating}
        onClick={handleCalculate}
        sx={{ mb: 4 }}
      >
        {calculating ? "Calculating…" : "Calculate Footprint"}
      </Button>

      <Stack spacing={1} sx={{ mb: 4 }}>
        {ORDERED_CATEGORIES.map((id) => (
          <CategorySection
            key={id}
            label={id.charAt(0).toUpperCase() + id.slice(1)}
            activities={activitiesByCategory?.[id] ?? []}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            isExpanded={selectedCategory === id}
            onToggle={() => toggleCategory(id)}
            factorsByActivity={factorsByActivity}
          />
        ))}
      </Stack>

      {summary && <ResultsPanel summary={summary} />}
    </Container>
  );
}
