import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { FootprintCalculator } from "./components/FootprintCalculator";
import { ErrorBoundary } from "./components/ErrorBoundary";

const theme = createTheme({
  palette: {
    primary: { main: "#2e7d32" },
    background: { default: "#f5f5f5" },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <FootprintCalculator />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
