export type EmissionCategory = "transportation" | "energy" | "diet" | "waste";

export interface Category {
  id: EmissionCategory;
  label: string;
}

export interface Activity {
  id: string;
  category: EmissionCategory;
  label: string;
  inputUnit: string;
  transformation: string;
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
  inputUnit: string;
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
