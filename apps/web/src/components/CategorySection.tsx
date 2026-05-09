import type { Activity } from "@sinai/shared";
import type { InputRow } from "../types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ActivityRow } from "./ActivityRow";

interface CategorySectionProps {
  label: string;
  activities: Activity[];
  rows: InputRow[];
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onUpdateRow: (rowId: string, field: "activityId" | "quantity", value: string) => void;
}

export function CategorySection({
  label,
  activities,
  rows,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
}: CategorySectionProps) {
  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          {rows.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              ({rows.length} {rows.length === 1 ? "entry" : "entries"})
            </Typography>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2}>
          {rows.map((row) => (
            <ActivityRow
              key={row.rowId}
              activities={activities}
              activityId={row.activityId}
              quantity={row.quantity}
              onActivityChange={(id) => onUpdateRow(row.rowId, "activityId", id)}
              onQuantityChange={(q) => onUpdateRow(row.rowId, "quantity", q)}
              onRemove={() => onRemoveRow(row.rowId)}
            />
          ))}

          <Button
            size="small"
            variant="text"
            startIcon={<AddIcon />}
            onClick={onAddRow}
            sx={{ alignSelf: "flex-start" }}
          >
            Add activity
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
