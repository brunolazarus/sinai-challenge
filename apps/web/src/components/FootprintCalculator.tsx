import { useState, useMemo } from "react";
import type { CalculationInput } from "@sinai/shared";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useActivities } from "../hooks/useActivities";
import { useCalculate } from "../hooks/useCalculate";
import { CategorySection } from "./CategorySection";
import { ResultsPanel } from "./ResultsPanel";

const CATEGORIES = [
  { id: "transportation", label: "Transportation" },
  { id: "energy", label: "Energy" },
  { id: "diet", label: "Diet" },
  { id: "waste", label: "Waste" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

export function FootprintCalculator() {
  const { data: activitiesByCategory, isLoading: loadingActivities } = useActivities();
  const { mutate: calculate, data: summary, isPending: calculating, error } = useCalculate();

  const [quantities, setQuantities] = useState<Record<string, string>>({});

  function handleQuantityChange(activityId: string, quantity: string) {
    setQuantities((prev) => ({ ...prev, [activityId]: quantity }));
  }

  const validInputs = useMemo<CalculationInput[]>(() => {
    return Object.entries(quantities)
      .filter(([, q]) => q !== "" && Number(q) > 0)
      .map(([activityId, q]) => ({ activityId, quantity: Number(q) }));
  }, [quantities]);

  function handleCalculate() {
    if (validInputs.length > 0) calculate(validInputs);
  }

  if (loadingActivities) {
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
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter amounts for the activities that apply to you, then calculate your
        estimated carbon footprint.
      </Typography>

      <Stack spacing={1} sx={{ mb: 4 }}>
        {CATEGORIES.map(({ id, label }: { id: CategoryId; label: string }) => (
          <CategorySection
            key={id}
            label={label}
            activities={activitiesByCategory?.[id] ?? []}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </Stack>

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

      {summary && <ResultsPanel summary={summary} />}
    </Container>
  );
}
