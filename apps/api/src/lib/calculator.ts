import type {
  CalculationInput,
  CalculationResult,
  FootprintSummary,
} from "@sinai/shared";
import { ACTIVITIES, TRANSFORMATIONS, FACTORS } from "./registry/index.js";

export function calculateSingle(input: CalculationInput): CalculationResult {
  // activity layer
  const activity = ACTIVITIES.find(
    (activity) => activity.id === input.activityId,
  );
  if (!activity) throw new Error(`Unknown activity: ${input.activityId}`);

  // factor layer
  const factor = input.factorId
    ? FACTORS.find((factor) => factor.id === input.factorId)
    : FACTORS.find((factor) => factor.activity === input.activityId);
  if (!factor)
    throw new Error(
      `No emission factor found for activity: ${input.activityId}`,
    );

  // transformation layer
  const transformation = TRANSFORMATIONS.find(
    (transformation) => transformation.id === activity.transformation,
  );
  if (!transformation)
    throw new Error(`Unknown transformation: ${activity.transformation}`);

  // kg of CO2 emitted
  const kgCO2e = transformation.apply(input.quantity, factor.value);

  return {
    activity: activity.id,
    input: input.quantity,
    inputUnit: activity.inputUnit,
    factor: factor.id,
    result: { kgCO2e, unit: "kg" },
  };
}

export function calculateFootprint(
  inputs: CalculationInput[],
): FootprintSummary {
  const results = inputs.map(calculateSingle);
  const totalKgCO2e = results.reduce((sum, r) => sum + r.result.kgCO2e, 0);
  return { totalKgCO2e, results };
}
