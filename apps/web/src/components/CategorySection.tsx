import type { Activity } from "@sinai/shared";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ActivityInput } from "./ActivityInput";

interface CategorySectionProps {
  label: string;
  activities: Activity[];
  quantities: Record<string, string>;
  onQuantityChange: (activityId: string, quantity: string) => void;
}

export function CategorySection({
  label,
  activities,
  quantities,
  onQuantityChange,
}: CategorySectionProps) {
  const filledCount = activities.filter(
    (a) => quantities[a.id] && Number(quantities[a.id]) > 0
  ).length;

  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {filledCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              ({filledCount} {filledCount === 1 ? "activity" : "activities"} filled)
            </Typography>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2}>
          {activities.map((activity) => (
            <ActivityInput
              key={activity.id}
              activity={activity}
              quantity={quantities[activity.id] ?? ""}
              onChange={(q) => onQuantityChange(activity.id, q)}
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
