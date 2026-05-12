import type { EmissionCategory } from "@sinai/shared";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ActivityInput } from "../ActivityInput";
import { useCategorySectionPresenter } from "./useCategorySectionPresenter";

interface CategorySectionProps {
  categoryId: EmissionCategory;
  quantities: Record<string, string>;
  onQuantityChange: (activityId: string, quantity: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export const CategorySection = ({
  categoryId,
  quantities,
  onQuantityChange,
  isExpanded,
  onToggle,
}: CategorySectionProps) => {
  const { activities, filledCount, label } = useCategorySectionPresenter(categoryId, quantities);

  return (
    <Accordion disableGutters expanded={isExpanded} onChange={onToggle}>
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
};
