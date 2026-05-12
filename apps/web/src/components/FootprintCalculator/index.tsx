import type { EmissionCategory } from "@sinai/shared";
import { EMISSION_CATEGORIES } from "@sinai/shared";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AirIcon from "@mui/icons-material/Air";
import ParkIcon from "@mui/icons-material/Park";
import LandscapeIcon from "@mui/icons-material/Landscape";
import { CategorySection } from "../CategorySection";
import { ErrorBoundary } from "../ErrorBoundary";
import { IconCircle } from "../IconCircle";
import { ResultsPanel } from "../ResultsPanel/ResultsPanel";
import { useFootprintCalculatorPresenter } from "./useFootprintCalculatorPresenter";

const ORDERED_CATEGORIES = Object.values(
  EMISSION_CATEGORIES,
) as EmissionCategory[];

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
    showSpinner,
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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <Card
          sx={{
            display: "flex",
            overflow: "hidden",
            mb: 3,
            borderRadius: 3,
            border: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <Box sx={{ flex: 1, p: { xs: 3, sm: 4 } }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}
            >
              <IconCircle size={48} bgcolor="primary.main">
                <EnergySavingsLeafIcon sx={{ color: "white", fontSize: 26 }} />
              </IconCircle>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                Carbon Footprint Calculator
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Enter your annual activity levels to calculate your estimated
              carbon footprint. Every action counts. Small changes, big impact.
            </Typography>
          </Box>

          {/* Illustration */}
          <Box
            sx={{
              width: { sm: 200, md: 260 },
              bgcolor: "primary.main",
              position: "relative",
              overflow: "hidden",
              display: { xs: "none", sm: "block" },
              flexShrink: 0,
            }}
          >
            <WbSunnyIcon
              sx={{
                position: "absolute",
                top: 12,
                right: 16,
                fontSize: 44,
                color: "#FFD54F",
                opacity: 0.9,
              }}
            />
            <AirIcon
              sx={{
                position: "absolute",
                top: 22,
                left: 20,
                fontSize: 28,
                color: "rgba(255,255,255,0.5)",
                transform: "rotate(-10deg)",
              }}
            />
            <ParkIcon
              sx={{
                position: "absolute",
                bottom: 0,
                right: 16,
                fontSize: 80,
                color: "rgba(255,255,255,0.85)",
              }}
            />
            <ParkIcon
              sx={{
                position: "absolute",
                bottom: 0,
                right: 80,
                fontSize: 56,
                color: "rgba(255,255,255,0.6)",
              }}
            />
            <LandscapeIcon
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                fontSize: 84,
                color: "rgba(255,255,255,0.3)",
              }}
            />
          </Box>
        </Card>

        {/* Body — two-column grid on desktop: button top-left, results aligned with categories */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
            gap: 3,
          }}
        >
          {/* Row 1, col 1: button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              gridColumn: { md: "1" },
              gridRow: { md: "1" },
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<CalculateIcon />}
              disabled={validInputs.length === 0 || showSpinner}
              onClick={handleCalculate}
              sx={{ borderRadius: 2, fontWeight: 700, letterSpacing: 0.5 }}
            >
              Calculate Footprint
            </Button>
            {showSpinner && <CircularProgress size={20} />}
          </Box>

          {/* Row 2, col 1: categories (+ error above) */}
          <Box
            sx={{
              minWidth: 0,
              gridColumn: { md: "1" },
              gridRow: { md: "2" },
            }}
          >
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error instanceof Error ? error.message : "Calculation failed."}
              </Typography>
            )}
            <Stack spacing={1}>
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
          </Box>

          {/* Row 2, col 2: results — desktop only, aligned with categories */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              gridColumn: { md: "2" },
              gridRow: { md: "2" },
              position: "sticky",
              top: 16,
            }}
          >
            {summary ? (
              <ErrorBoundary>
                <ResultsPanel summary={summary} />
              </ErrorBoundary>
            ) : (
              <Card
                variant="outlined"
                sx={{ p: 3, borderRadius: 3, textAlign: "center", color: "text.disabled", borderStyle: "dashed" }}
              >
                <CalculateIcon sx={{ fontSize: 40, mb: 1, opacity: 0.35 }} />
                <Typography variant="body2">
                  Fill in your activities and click Calculate to see your footprint.
                </Typography>
              </Card>
            )}
          </Box>

          {/* Mobile: results below categories */}
          {summary && (
            <Box sx={{ display: { md: "none" }, gridColumn: "1" }}>
              <ErrorBoundary>
                <ResultsPanel summary={summary} />
              </ErrorBoundary>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};
