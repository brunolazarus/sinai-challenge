import type { EmissionCategory } from "@sinai/shared";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ActivityInput } from "../ActivityInput";
import { IconCircle } from "../IconCircle";
import { CATEGORY_META } from "../../lib/iconMaps";
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
  const { Icon, description, color } = CATEGORY_META[categoryId];

  return (
    <Accordion
      disableGutters
      expanded={isExpanded}
      onChange={onToggle}
      sx={{ borderRadius: 2, "&:before": { display: "none" }, boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <IconCircle size={40} bgcolor={`${color}18`}>
            <Icon sx={{ color, fontSize: 22 }} />
          </IconCircle>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filledCount > 0
                ? `${filledCount} ${filledCount === 1 ? "activity" : "activities"} filled`
                : description}
            </Typography>
          </Box>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ px: 2, pb: 2 }}>
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
