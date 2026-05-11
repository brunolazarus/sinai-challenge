import { createTheme, CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { FootprintCalculator } from "./components/FootprintCalculator";
import { ErrorBoundary } from "./components/ErrorBoundary";

const theme = createTheme({
  palette: {
    primary: { main: "#2e7d32" },
    background: { default: "#f5f5f5" },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles styles={{ html: { scrollbarGutter: "stable" } }} />
    <ErrorBoundary>
      <FootprintCalculator />
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
