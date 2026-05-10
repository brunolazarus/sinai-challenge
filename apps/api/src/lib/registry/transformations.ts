import type { Transformation, TransformationId } from "@sinai/shared";
import { TRANSFORMATION_IDS } from "@sinai/shared";

// Backend-only extension — `apply` is dropped when serialized to JSON by c.json()
export interface TransformationDef extends Omit<Transformation, "id"> {
  id: TransformationId;
  apply: (input: number, factor: number) => number;
}

export const TRANSFORMATIONS: TransformationDef[] = [
  {
    id: TRANSFORMATION_IDS.SIMPLE_MULTIPLY,
    label: "Simple Multiply",
    formula: "input × factor",
    apply: (input, factor) => input * factor,
  },
  {
    id: TRANSFORMATION_IDS.ANNUALIZED,
    label: "Daily to Annual",
    formula: "input × 365 × factor",
    apply: (input, factor) => input * 365 * factor,
  },
  {
    id: TRANSFORMATION_IDS.WEEKLY_TO_YEARLY,
    label: "Weekly to Annual",
    formula: "input × 52 × factor",
    apply: (input, factor) => input * 52 * factor,
  },
  {
    id: TRANSFORMATION_IDS.INPUT_KM,
    label: "Kilometres input (factor per mile)",
    formula: "(input / 1.60934) × factor",
    apply: (input, factor) => (input / 1.60934) * factor,
  },
  {
    id: TRANSFORMATION_IDS.INPUT_LBS,
    label: "Pounds input (factor per kg)",
    formula: "(input / 2.20462) × factor",
    apply: (input, factor) => (input / 2.20462) * factor,
  },
];
