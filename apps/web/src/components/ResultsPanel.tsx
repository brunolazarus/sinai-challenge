import type { FootprintSummary } from "@sinai/shared";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFactors } from "../hooks/useFactors";

interface ResultsPanelProps {
  summary: FootprintSummary;
}

export const ResultsPanel = ({ summary }: ResultsPanelProps) => {
  const factorsByActivity = useFactors();

  return (
    <Stack spacing={2}>
      <Card
        variant="outlined"
        sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
      >
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.8 }}>
            Total Carbon Footprint
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {summary.totalKgCO2e.toFixed(2)}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              kg CO₂e
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Breakdown
          </Typography>
          <Stack divider={<Divider flexItem />} spacing={1.5}>
            {summary.results.map((result, i) => {
              const methodology = factorsByActivity[result.activity]
                ?.find((f) => f.id === result.factor)
                ?.methodology;

              return (
                <Box
                  key={i}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Stack spacing={0.25}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, textTransform: "capitalize" }}
                    >
                      {result.activity.replace(/_/g, " ")}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                      <Typography variant="caption" color="text.secondary">
                        {result.input.toFixed(2)} {result.inputUnit} ·
                      </Typography>
                      <Tooltip
                        title={methodology ?? result.factor}
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ cursor: "help", textDecoration: "underline dotted" }}
                        >
                          {result.factor}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, whiteSpace: "nowrap", ml: 2 }}
                  >
                    {result.result.kgCO2e.toFixed(2)} kg
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
