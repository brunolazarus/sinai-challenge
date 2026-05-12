import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type Activity,
  TRANSFORMATION_IDS,
  EMISSION_CATEGORIES,
} from "@sinai/shared";
import { CategorySection } from "../CategorySection";

const activities: Activity[] = [
  {
    id: "gasoline_car",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    label: "Gasoline Car",
    inputUnit: "mile",
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
  {
    id: "electric_car",
    category: EMISSION_CATEGORIES.TRANSPORTATION,
    label: "Electric Car",
    inputUnit: "mile",
    transformation: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["activities"], { activities });
  queryClient.setQueryData(["factors"], { factors: [] });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

const renderSection = (
  quantities: Record<string, string> = {},
  onQuantityChange = vi.fn(),
  isExpanded = false,
  onToggle = vi.fn(),
) =>
  render(
    <CategorySection
      categoryId={EMISSION_CATEGORIES.TRANSPORTATION}
      quantities={quantities}
      onQuantityChange={onQuantityChange}
      isExpanded={isExpanded}
      onToggle={onToggle}
    />,
    { wrapper: createWrapper() },
  );

describe("CategorySection", () => {
  it("renders the category label", () => {
    renderSection();
    expect(screen.getByText("Transportation")).toBeInTheDocument();
  });

  it("hides the filled count when no quantities are set", () => {
    renderSection();
    expect(screen.queryByText(/filled/)).not.toBeInTheDocument();
  });

  it("shows singular filled count for one non-zero activity", () => {
    renderSection({ gasoline_car: "100" });
    expect(screen.getByText("1 activity filled")).toBeInTheDocument();
  });

  it("shows plural filled count for multiple non-zero activities", () => {
    renderSection({ gasoline_car: "100", electric_car: "50" });
    expect(screen.getByText("2 activities filled")).toBeInTheDocument();
  });

  it("does not count zero or empty quantities as filled", () => {
    renderSection({ gasoline_car: "0", electric_car: "" });
    expect(screen.queryByText(/filled/)).not.toBeInTheDocument();
  });

  it("renders an input for each activity when expanded", () => {
    renderSection({}, vi.fn(), true);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(activities.length);
  });

  it("calls onQuantityChange with the correct activityId when input changes", async () => {
    const user = userEvent.setup();
    const onQuantityChange = vi.fn();
    renderSection({}, onQuantityChange, true);

    const inputs = screen.getAllByRole("spinbutton");
    await user.type(inputs[0]!, "42");

    expect(onQuantityChange).toHaveBeenCalledWith(
      "gasoline_car",
      expect.any(String),
    );
  });
});
