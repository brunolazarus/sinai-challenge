import type { CalculationInput, CalculationResult, FootprintSummary } from "@sinai/shared";
import { ACTIVITIES, TRANSFORMATIONS, FACTORS } from "./registry/index.js";

function applyTransformation(transformationId: string, input: number, factorValue: number): number {
  switch (transformationId) {
    case "simple_multiply":
      return input * factorValue;
    case "annualized":
      return input * 365 * factorValue;
    case "weekly_to_yearly":
      return input * 52 * factorValue;
    default:
      throw new Error(`Unknown transformation: ${transformationId}`);
  }
}

export function calculateSingle(input: CalculationInput): CalculationResult {
  const activity = ACTIVITIES.find((a) => a.id === input.activityId);
  if (!activity) throw new Error(`Unknown activity: ${input.activityId}`);

  const factor = input.factorId
    ? FACTORS.find((f) => f.id === input.factorId)
    : FACTORS.find((f) => f.activity === input.activityId);
  if (!factor) throw new Error(`No emission factor found for activity: ${input.activityId}`);

  const transformation = TRANSFORMATIONS.find((t) => t.id === activity.transformation);
  if (!transformation) throw new Error(`Unknown transformation: ${activity.transformation}`);

  const kgCO2e = applyTransformation(transformation.id, input.quantity, factor.value);

  return {
    activity: activity.id,
    input: input.quantity,
    inputUnit: activity.inputUnit,
    factor: factor.id,
    result: { kgCO2e, unit: "kg" },
  };
}

export function calculateFootprint(inputs: CalculationInput[]): FootprintSummary {
  const results = inputs.map(calculateSingle);
  const totalKgCO2e = results.reduce((sum, r) => sum + r.result.kgCO2e, 0);
  return { totalKgCO2e, results };
}
