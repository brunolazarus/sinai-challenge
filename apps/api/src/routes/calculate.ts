import { createRoute, z } from "@hono/zod-openapi";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { ACTIVITIES, FACTORS } from "../lib/registry/index.js";
import { calculateFootprint } from "../lib/calculator.js";

// ── Schemas ───────────────────────────────────────────────────────────────────

const CalculationInputSchema = z
  .object({
    activityId: z.string().openapi({
      description: "Activity identifier from GET /v1/activities.",
      example: "gasoline_car",
    }),
    quantity: z.number().nonnegative().openapi({
      description:
        "Amount of the activity in its native inputUnit (see GET /v1/activities).",
      example: 100,
    }),
    factorId: z
      .string()
      .optional()
      .openapi({
        description:
          "Override the default emission factor (e.g. to pick a different region or year). " +
          "Omit to use the primary US 2023 factor. Browse options at GET /v1/factors.",
        example: "gasoline_car_epa2023_us",
      }),
  })
  .openapi("CalculationInput");

const CalculationResultSchema = z
  .object({
    activity: z.string().openapi({ description: "Activity identifier" }),
    input: z.number().openapi({ description: "Original quantity submitted" }),
    inputUnit: z
      .string()
      .openapi({ description: "Unit of the original quantity" }),
    factor: z
      .string()
      .openapi({ description: "Emission factor ID used for this result" }),
    result: z.object({
      kgCO2e: z
        .number()
        .openapi({ description: "Calculated emissions in kg CO2 equivalent" }),
      unit: z.literal("kg"),
    }),
  })
  .openapi("CalculationResult");

const FootprintSummarySchema = z
  .object({
    totalKgCO2e: z.number().openapi({
      description: "Sum of all results in kg CO2 equivalent",
    }),
    results: z.array(CalculationResultSchema),
  })
  .openapi("FootprintSummary");

const CalculateRequestSchema = z
  .object({
    inputs: z.array(CalculationInputSchema).min(1),
  })
  .openapi("CalculateRequest");

const ErrorSchema = z.object({ error: z.string() }).openapi("Error");

// ── Route Definition ─────────────────────────────────────────────────────────────────────

const calculateRoute = createRoute({
  method: "post",
  path: "/v1/calculate",
  tags: ["Emissions"],
  summary: "Calculate carbon footprint",
  description:
    "Executes the CATEGORY → ACTIVITY → TRANSFORMATION → EMISSION FACTOR → RESULT pipeline " +
    "for one or more inputs and returns a provenance-preserving summary. " +
    "All factors default to EPA GHG Emission Factors Hub (2023) US values. " +
    "Supply `factorId` to override with a region- or year-specific factor from GET /v1/factors.",
  request: {
    body: {
      content: { "application/json": { schema: CalculateRequestSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: FootprintSummarySchema } },
      description: "Calculated footprint summary with full provenance",
    },
    400: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Unknown activityId or factorId",
    },
  },
});

// ── Route Registration ──────────────────────────────────────────────────────────────

const validActivityIds = new Set(ACTIVITIES.map((a) => a.id));
const validFactorIds = new Set(FACTORS.map((f) => f.id));

export function registerCalculateRoutes(app: OpenAPIHono) {
  app.openapi(calculateRoute, (context) => {
    const { inputs } = context.req.valid("json");

    const unknownActivities = inputs.filter(
      (input) => !validActivityIds.has(input.activityId),
    );
    if (unknownActivities.length > 0) {
      return context.json(
        {
          error: `Unknown activityId(s): ${unknownActivities.map((activity) => activity.activityId).join(", ")}. See GET /v1/activities.`,
        },
        400 as const,
      );
    }

    const unknownFactors = inputs.filter(
      (input) => input.factorId && !validFactorIds.has(input.factorId),
    );
    if (unknownFactors.length > 0) {
      return context.json(
        {
          error: `Unknown factorId(s): ${unknownFactors.map((input) => input.factorId).join(", ")}. See GET /v1/factors.`,
        },
        400 as const,
      );
    }

    return context.json(calculateFootprint(inputs), 200 as const);
  });
}
