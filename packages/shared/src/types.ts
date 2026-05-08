export type EmissionCategory = "transportation" | "energy" | "diet" | "waste";

export interface EmissionFactor {
  category: EmissionCategory;
  unit: string;
  kgCO2ePerUnit: number;
  description: string;
}

export interface CalculationInput {
  category: EmissionCategory;
  quantity: number;
  unit: string;
}

export interface CalculationResult {
  category: EmissionCategory;
  kgCO2e: number;
  breakdown: Record<string, number>;
}

export interface FootprintSummary {
  totalKgCO2e: number;
  results: CalculationResult[];
}
