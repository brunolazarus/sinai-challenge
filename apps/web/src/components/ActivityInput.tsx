import type { Activity, EmissionFactor } from "@sinai/shared";
import { Stack, TextField, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface ActivityInputProps {
  activity: Activity;
  quantity: string;
  onChange: (quantity: string) => void;
  factors: EmissionFactor[];
}

export const ActivityInput = ({ activity, quantity, onChange, factors }: ActivityInputProps) => {
  const methodology = factors[0]?.methodology;

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", minWidth: 180 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {activity.label}
        </Typography>
        {methodology && (
          <Tooltip title={methodology} arrow placement="top">
            <InfoOutlinedIcon
              fontSize="inherit"
              sx={{ color: "text.disabled", cursor: "help", fontSize: 14 }}
            />
          </Tooltip>
        )}
      </Stack>
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
