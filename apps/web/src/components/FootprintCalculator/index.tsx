import type { EmissionCategory } from "@sinai/shared";
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
import { CategorySection } from "../CategorySection";
import { ErrorBoundary } from "../ErrorBoundary";
import { ResultsPanel } from "../ResultsPanel";
import { useFootprintCalculatorPresenter } from "./useFootprintCalculatorPresenter";

const ORDERED_CATEGORIES = Object.values(EMISSION_CATEGORIES) as EmissionCategory[];

export const FootprintCalculator = () => {
  const {
    selectedCategory,
    toggleCategory,
    isLoading,
    handleQuantityChange,
    quantities,
    validInputs,
    handleCalculate,
    summary,
    calculating,
    error,
  } = useFootprintCalculatorPresenter();

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
          <ErrorBoundary key={id}>
            <CategorySection
              categoryId={id}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              isExpanded={selectedCategory === id}
              onToggle={() => toggleCategory(id)}
            />
          </ErrorBoundary>
        ))}
      </Stack>

      {summary && (
        <ErrorBoundary>
          <ResultsPanel summary={summary} />
        </ErrorBoundary>
      )}
    </Container>
  );
};
