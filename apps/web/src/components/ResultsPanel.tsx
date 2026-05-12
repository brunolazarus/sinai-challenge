import type { FootprintSummary } from "@sinai/shared";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Link,
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

  const REFERENCES = [
    { label: "EPA GHG Emission Factors Hub 2023", url: "https://www.epa.gov/system/files/documents/2023-03/ghg_emission_factors_hub.pdf" },
    { label: "EPA eGRID2023", url: "https://www.epa.gov/egrid" },
    { label: "EPA WARM model v16 (2023)", url: "https://www.epa.gov/warm" },
  ];

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
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 1 }}
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
                    sx={{ fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {result.result.kgCO2e.toFixed(2)} kg
                  </Typography>
                </Box>
              );
            })}
          </Stack>

          <Divider sx={{ mt: 2, mb: 1.5 }} />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            Sources
          </Typography>
          <Stack spacing={0.5}>
            {REFERENCES.map(({ label, url }) => (
              <Link
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
                color="text.secondary"
              >
                {label}
              </Link>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};
