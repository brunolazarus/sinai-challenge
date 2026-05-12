import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Activity, EmissionFactor } from "@sinai/shared";
import { EMISSION_CATEGORIES, TRANSFORMATION_IDS } from "@sinai/shared";
import { useActivityInputPresenter } from "../ActivityInput/useActivityInputPresenter";

const mileActivity: Activity = {
  id: "gasoline_car",
  category: EMISSION_CATEGORIES.TRANSPORTATION,
  label: "Gasoline Car",
  inputUnit: "mile",
  transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
};

const flightActivity: Activity = {
  id: "short_haul_flight",
  category: EMISSION_CATEGORIES.TRANSPORTATION,
  label: "Short Haul Flight",
  inputUnit: "flight/year",
  transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
};

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
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe("useActivityInputPresenter", () => {
  it("returns unit options for mile activity", () => {
    const { result } = renderHook(
      () => useActivityInputPresenter(mileActivity, "100", vi.fn()),
      { wrapper: createWrapper() },
    );
    expect(result.current.unitOptions).toHaveLength(2);
    expect(result.current.unitOptions![0]!.label).toBe("miles");
    expect(result.current.unitOptions![1]!.label).toBe("km");
  });

  it("returns null unitOptions for activity with no alternatives", () => {
    const { result } = renderHook(
      () => useActivityInputPresenter(flightActivity, "2", vi.fn()),
      { wrapper: createWrapper() },
    );
    expect(result.current.unitOptions).toBeNull();
  });

  it("initialises displayValue from the quantity prop", () => {
    const { result } = renderHook(
      () => useActivityInputPresenter(mileActivity, "100", vi.fn()),
      { wrapper: createWrapper() },
    );
    expect(result.current.displayValue).toBe("100");
  });

  it("switchUnit does not change displayValue", () => {
    const { result } = renderHook(
      () => useActivityInputPresenter(mileActivity, "100", vi.fn()),
      { wrapper: createWrapper() },
    );
    act(() => result.current.switchUnit(1));
    expect(result.current.displayValue).toBe("100");
  });

  it("switchUnit calls onChange with base-converted value", () => {
    const onChange = vi.fn();
    const { result } = renderHook(
      () => useActivityInputPresenter(mileActivity, "100", onChange),
      { wrapper: createWrapper() },
    );
    act(() => result.current.switchUnit(1)); // switch to km
    expect(onChange).toHaveBeenCalledWith(String(100 / 1.60934));
  });

  it("toBase is a passthrough when the activity has no unit alternatives", () => {
    const { result } = renderHook(
      () => useActivityInputPresenter(flightActivity, "2", vi.fn()),
      { wrapper: createWrapper() },
    );
    expect(result.current.toBase("2")).toBe("2");
  });

  it("exposes methodology from seeded factors", () => {
    const { result } = renderHook(
      () => useActivityInputPresenter(mileActivity, "100", vi.fn()),
      { wrapper: createWrapper() },
    );
    expect(result.current.methodology).toBe(
      "Based on average US fleet fuel economy of 22 MPG.",
    );
  });
});
