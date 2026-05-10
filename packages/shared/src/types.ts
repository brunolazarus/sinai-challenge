import type {
  EMISSION_CATEGORIES,
  INPUT_UNITS,
  TRANSFORMATION_IDS,
} from "./constants.js";

export type EmissionCategory =
  (typeof EMISSION_CATEGORIES)[keyof typeof EMISSION_CATEGORIES];
export type TransformationId =
  (typeof TRANSFORMATION_IDS)[keyof typeof TRANSFORMATION_IDS];
export type InputUnit = (typeof INPUT_UNITS)[keyof typeof INPUT_UNITS];

export interface Category {
  id: EmissionCategory;
  label: string;
}

export interface Activity {
  id: string;
  category: EmissionCategory;
  label: string;
  inputUnit: InputUnit;
  transformation: TransformationId;
}

export interface Transformation {
  id: string;
  label: string;
  formula: string;
}

export interface EmissionFactor {
  id: string;
  activity: string;
  value: number;
  unit: string;
  region: string;
  year: number;
  source: string;
  methodology: string;
}

export interface CalculationInput {
  activityId: string;
  quantity: number;
  factorId?: string;
}

export interface CalculationResult {
  activity: string;
  input: number;
  inputUnit: InputUnit;
  factor: string;
  result: {
    kgCO2e: number;
    unit: "kg";
  };
}

export interface FootprintSummary {
  totalKgCO2e: number;
  results: CalculationResult[];
}
