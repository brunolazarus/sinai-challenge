import type { Activity } from "@sinai/shared";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

interface ActivityRowProps {
  activities: Activity[];
  activityId: string;
  quantity: string;
  onActivityChange: (id: string) => void;
  onQuantityChange: (quantity: string) => void;
  onRemove: () => void;
}

export function ActivityRow({
  activities,
  activityId,
  quantity,
  onActivityChange,
  onQuantityChange,
  onRemove,
}: ActivityRowProps) {
  const selected = activities.find((a) => a.id === activityId);

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel>Activity</InputLabel>
        <Select
          value={activityId}
          label="Activity"
          onChange={(e) => onActivityChange(e.target.value)}
        >
          {activities.map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        type="number"
        label="Quantity"
        value={quantity}
        onChange={(e) => onQuantityChange(e.target.value)}
        disabled={!activityId}
        slotProps={{ htmlInput: { min: 0, step: "any" } }}
        sx={{ width: 120 }}
      />

      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
        {selected?.inputUnit ?? ""}
      </Typography>

      <IconButton size="small" onClick={onRemove} aria-label="Remove row">
        <DeleteOutlinedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
