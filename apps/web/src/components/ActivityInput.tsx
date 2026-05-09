import type { Activity } from "@sinai/shared";
import { Stack, TextField, Typography } from "@mui/material";

interface ActivityInputProps {
  activity: Activity;
  quantity: string;
  onChange: (quantity: string) => void;
}

export function ActivityInput({ activity, quantity, onChange }: ActivityInputProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Typography variant="body2" sx={{ minWidth: 180, fontWeight: 500 }}>
        {activity.label}
      </Typography>
      <TextField
        size="small"
        type="number"
        label="Amount"
        value={quantity}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{ htmlInput: { min: 0, step: "any" } }}
        sx={{ width: 140 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
        {activity.inputUnit}
      </Typography>
    </Stack>
  );
}
