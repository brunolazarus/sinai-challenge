import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { EmissionFactor, FootprintSummary } from "@sinai/shared";
import { ResultsPanel } from "../ResultsPanel";

afterEach(cleanup);

const factors: EmissionFactor[] = [
  {
    id: "gasoline_car_epa2023_us",
    activity: "gasoline_car",
    value: 0.404,
    unit: "kgCO2e_per_mile",
    region: "US",
    year: 2023,
    source: "EPA GHG Emission Factors Hub 2023",
    methodology: "Based on average US fleet fuel economy of 22 MPG.",
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["factors"], { factors });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const summary: FootprintSummary = {
  totalKgCO2e: 123.45,
  results: [
    {
      activity: "gasoline_car",
      input: 10000,
      inputUnit: "mile",
      factor: "gasoline_car_epa2023_us",
      result: { kgCO2e: 4040, unit: "kg" },
    },
    {
      activity: "beef",
      input: 50,
      inputUnit: "kg",
      factor: "beef_ipcc2023_global",
      result: { kgCO2e: 1350, unit: "kg" },
    },
  ],
};

describe("ResultsPanel", () => {
  it("displays the total kgCO2e value", () => {
    render(<ResultsPanel summary={summary} />, { wrapper: createWrapper() });
    expect(screen.getByText("123.45")).toBeInTheDocument();
  });

  it("renders a row for each result", () => {
    render(<ResultsPanel summary={summary} />, { wrapper: createWrapper() });
    expect(screen.getByText("gasoline car")).toBeInTheDocument();
    expect(screen.getByText("beef")).toBeInTheDocument();
  });

  it("shows each result's kgCO2e value formatted to 2 decimals", () => {
    render(<ResultsPanel summary={summary} />, { wrapper: createWrapper() });
    expect(screen.getByText("4040.00 kg")).toBeInTheDocument();
    expect(screen.getByText("1350.00 kg")).toBeInTheDocument();
  });

  it("shows input quantity formatted to 2 decimals", () => {
    render(<ResultsPanel summary={summary} />, { wrapper: createWrapper() });
    expect(screen.getByText(/10000\.00.*mile/)).toBeInTheDocument();
  });

  it("shows the factor id as a hoverable tag", () => {
    render(<ResultsPanel summary={summary} />, { wrapper: createWrapper() });
    expect(screen.getByText("gasoline_car_epa2023_us")).toBeInTheDocument();
  });
});
