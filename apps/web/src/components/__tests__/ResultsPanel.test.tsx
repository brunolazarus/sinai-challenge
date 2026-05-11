import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { FootprintSummary } from "@sinai/shared";
import { ResultsPanel } from "../ResultsPanel";

afterEach(cleanup);

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
    render(<ResultsPanel summary={summary} />);
    expect(screen.getByText("123.45")).toBeInTheDocument();
  });

  it("renders a row for each result", () => {
    render(<ResultsPanel summary={summary} />);
    expect(screen.getByText("gasoline car")).toBeInTheDocument();
    expect(screen.getByText("beef")).toBeInTheDocument();
  });

  it("shows each result's kgCO2e value", () => {
    render(<ResultsPanel summary={summary} />);
    expect(screen.getByText("4040.00 kg")).toBeInTheDocument();
    expect(screen.getByText("1350.00 kg")).toBeInTheDocument();
  });

  it("shows input quantity and unit for each result", () => {
    render(<ResultsPanel summary={summary} />);
    expect(screen.getByText(/10000.*mile.*gasoline_car_epa2023_us/)).toBeInTheDocument();
    expect(screen.getByText(/^50\s.*beef_ipcc2023_global/)).toBeInTheDocument();
  });
});
