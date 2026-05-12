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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ParkIcon from "@mui/icons-material/Park";
import { IconCircle } from "../IconCircle";
import { CATEGORY_META } from "../../lib/iconMaps";
import { toTrees, toGasolineMiles, formatAnalogy } from "../../lib/analogies";
import { useResultPanelPresenter } from "./useResultPanelPresenter";

interface ResultsPanelProps {
  summary: FootprintSummary;
}

export const ResultsPanel = ({ summary }: ResultsPanelProps) => {
  const {
    REFERENCES,
    ORDERED_CATEGORIES,
    total,
    pieData,
    factorsByActivity,
    categoryTotals,
  } = useResultPanelPresenter(summary);
  return (
    <Stack spacing={2}>
      {/* Total */}
      <Card
        variant="outlined"
        sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
      >
        <CardContent>
          <Typography variant="overline" sx={{ opacity: 0.8 }}>
            Your Total Carbon Footprint
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {total.toFixed(2)}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              kg CO₂e
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
            per year
          </Typography>
        </CardContent>
      </Card>

      {/* That's like */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            That&apos;s like…
          </Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <IconCircle
                size={40}
                bgcolor={`${CATEGORY_META.transportation.color}18`}
              >
                <DirectionsCarIcon
                  sx={{
                    color: CATEGORY_META.transportation.color,
                    fontSize: 22,
                  }}
                />
              </IconCircle>
              <Box>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, lineHeight: 1.1 }}
                >
                  {formatAnalogy(toGasolineMiles(total))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  miles in a gasoline car
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <IconCircle size={40} bgcolor={`${CATEGORY_META.diet.color}18`}>
                <ParkIcon
                  sx={{ color: CATEGORY_META.diet.color, fontSize: 22 }}
                />
              </IconCircle>
              <Box>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, lineHeight: 1.1 }}
                >
                  {formatAnalogy(toTrees(total))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  trees growing for a year
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Breakdown by category */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Breakdown
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 100, height: 100, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      pieData.length > 0
                        ? pieData
                        : [{ name: "none", value: 1, color: "#e0e0e0" }]
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={44}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {(pieData.length > 0
                      ? pieData
                      : [{ color: "#e0e0e0" }]
                    ).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(2)} kg`,
                      "",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
              {ORDERED_CATEGORIES.map((cat) => {
                const kg = categoryTotals[cat] ?? 0;
                const pct = total > 0 ? (kg / total) * 100 : 0;
                const { color } = CATEGORY_META[cat];
                const label = cat.charAt(0).toUpperCase() + cat.slice(1);
                return (
                  <Stack
                    key={cat}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="caption" sx={{ flex: 1 }}>
                      {label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color }}
                    >
                      {pct.toFixed(0)}%
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Box>

          {/* Activity detail */}
          <Divider sx={{ mt: 2, mb: 1.5 }} />
          <Stack divider={<Divider flexItem />} spacing={1.5}>
            {summary.results.map((result, i) => {
              const methodology = factorsByActivity[result.activity]?.find(
                (f) => f.id === result.factor,
              )?.methodology;
              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, textTransform: "capitalize" }}
                    >
                      {result.activity.replace(/_/g, " ")}
                    </Typography>
                    <Tooltip
                      title={methodology ?? result.factor}
                      arrow
                      placement="top"
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ cursor: "help" }}
                      >
                        {result.input.toFixed(2)} {result.inputUnit} ·{" "}
                        {result.factor}
                      </Typography>
                    </Tooltip>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {result.result.kgCO2e.toFixed(2)} kg
                  </Typography>
                </Box>
              );
            })}
          </Stack>

          {/* Sources */}
          <Divider sx={{ mt: 2, mb: 1.5 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5 }}
          >
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
