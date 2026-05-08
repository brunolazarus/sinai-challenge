import type { Transformation } from "@sinai/shared";

export const TRANSFORMATIONS: Transformation[] = [
  {
    id: "simple_multiply",
    label: "Simple Multiply",
    formula: "input * factor",
  },
  // Future slots — add without changing existing activities:
  // { id: "annualized",      label: "Annualized",      formula: "input * 365 * factor" }
  // { id: "weekly_to_yearly", label: "Weekly to Yearly", formula: "input * 52 * factor" }
  // { id: "spend_based",     label: "Spend-Based",      formula: "input * factor" }
];
