import { Box } from "@mui/material";
import type { ReactNode } from "react";

interface IconCircleProps {
  size?: number;
  bgcolor: string;
  opacity?: number;
  children: ReactNode;
}

export const IconCircle = ({ size = 36, bgcolor, opacity, children }: IconCircleProps) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: "50%",
      bgcolor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      opacity,
    }}
  >
    {children}
  </Box>
);
