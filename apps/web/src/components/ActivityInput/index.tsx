import type { Activity } from "@sinai/shared";
import {
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconCircle } from "../IconCircle";
import { ACTIVITY_ICONS } from "../../lib/iconMaps";
import { useActivityInputPresenter } from "./useActivityInputPresenter";

interface ActivityInputProps {
  activity: Activity;
  quantity: string;
  onChange: (quantity: string) => void;
}

export const ActivityInput = ({
  activity,
  quantity,
  onChange,
}: ActivityInputProps) => {
  const {
    methodology,
    unitOptions,
    selectedUnitIdx,
    displayValue,
    setDisplayValue,
    toBase,
    switchUnit,
  } = useActivityInputPresenter(activity, quantity, onChange);

  const Icon = ACTIVITY_ICONS[activity.id];

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", width: { sm: 220 }, flexShrink: 0 }}
      >
        {Icon && (
          <IconCircle size={32} bgcolor="primary.main" opacity={0.85}>
            <Icon sx={{ color: "white", fontSize: 16 }} />
          </IconCircle>
        )}
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "flex-start" }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
            {activity.label}
          </Typography>
          {methodology && (
            <Tooltip title={methodology} arrow placement="top">
              <InfoOutlinedIcon
                fontSize="inherit"
                sx={{ color: "text.disabled", cursor: "help", fontSize: 14, mt: "2px" }}
              />
            </Tooltip>
          )}
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <TextField
          size="small"
          type="number"
          label="Amount"
          value={displayValue}
          onChange={(e) => {
            setDisplayValue(e.target.value);
            onChange(toBase(e.target.value));
          }}
          slotProps={{ htmlInput: { min: 0, step: "any" } }}
          sx={{ width: { xs: 120, sm: 140 } }}
        />
        {unitOptions ? (
          <Select
            size="small"
            value={selectedUnitIdx}
            onChange={(e) => switchUnit(Number(e.target.value))}
            sx={{ minWidth: 90 }}
          >
            {unitOptions.map((opt, idx) => (
              <MenuItem key={opt.label} value={idx}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
            {activity.inputUnit}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};
