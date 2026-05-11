import { Component } from "react";
import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error.message}
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}
