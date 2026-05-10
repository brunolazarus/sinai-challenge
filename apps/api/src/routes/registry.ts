import { createRoute, z } from "@hono/zod-openapi";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { EMISSION_CATEGORIES, type EmissionCategory } from "@sinai/shared";

const EMISSION_CATEGORY_VALUES = Object.values(EMISSION_CATEGORIES) as [EmissionCategory, ...EmissionCategory[]];
import {
  CATEGORIES,
  ACTIVITIES,
  TRANSFORMATIONS,
  FACTORS,
} from "../lib/registry/index.js";

// ── Schemas ───────────────────────────────────────────────────────────────────

const CategorySchema = z
  .object({ id: z.string(), label: z.string() })
  .openapi("Category");

const ActivitySchema = z
  .object({
    id: z.string(),
    category: z.string(),
    label: z.string(),
    inputUnit: z.string(),
    transformation: z.string(),
  })
  .openapi("Activity");

const TransformationSchema = z
  .object({ id: z.string(), label: z.string(), formula: z.string() })
  .openapi("Transformation");

const EmissionFactorSchema = z
  .object({
    id: z.string(),
    activity: z.string(),
    value: z.number(),
    unit: z.string(),
    region: z.string(),
    year: z.number(),
    source: z.string(),
    methodology: z.string(),
  })
  .openapi("EmissionFactor");

const CategoryFilterSchema = z.object({
  category: z.enum(EMISSION_CATEGORY_VALUES).optional().openapi({
    description: "Filter by emission category",
    example: "transportation",
  }),
});

// ── Routes Definition────────────────────────────────────────────────────────────────────

const categoriesRoute = createRoute({
  method: "get",
  path: "/v1/categories",
  tags: ["Registry"],
  summary: "List categories",
  description:
    "Logical groupings for activities. Categories contain no formulas or factors.",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ categories: z.array(CategorySchema) }),
        },
      },
      description: "All emission categories",
    },
  },
});

const activitiesRoute = createRoute({
  method: "get",
  path: "/v1/activities",
  tags: ["Registry"],
  summary: "List activities",
  description:
    "Activities define what is being measured, the accepted input unit, and which transformation to apply. " +
    "Use the `id` as `activityId` in POST /v1/calculate.",
  request: { query: CategoryFilterSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ activities: z.array(ActivitySchema) }),
        },
      },
      description: "Activities, optionally filtered by category",
    },
  },
});

const transformationsRoute = createRoute({
  method: "get",
  path: "/v1/transformations",
  tags: ["Registry"],
  summary: "List transformations",
  description: "Reusable calculation formulas referenced by activities.",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ transformations: z.array(TransformationSchema) }),
        },
      },
      description: "All available transformations",
    },
  },
});

const factorsRoute = createRoute({
  method: "get",
  path: "/v1/factors",
  tags: ["Registry"],
  summary: "List emission factors",
  description:
    "Emission factors are independent objects keyed by region and year, replaceable without touching activities. " +
    "Each factor includes its EPA source and full methodology. Use the `id` as `factorId` in POST /v1/calculate to override the default.",
  request: { query: CategoryFilterSchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ factors: z.array(EmissionFactorSchema) }),
        },
      },
      description: "Emission factors, optionally filtered by category",
    },
  },
});

// ── Route Registration ──────────────────────────────────────────────────────────────

export function registerRegistryRoutes(app: OpenAPIHono) {
  app.openapi(categoriesRoute, (context) =>
    context.json({ categories: CATEGORIES }),
  );

  app.openapi(activitiesRoute, (c) => {
    const { category } = c.req.valid("query");
    const activities = category
      ? ACTIVITIES.filter((a) => a.category === category)
      : ACTIVITIES;
    return c.json({ activities });
  });

  app.openapi(transformationsRoute, (context) =>
    context.json({ transformations: TRANSFORMATIONS }),
  );

  app.openapi(factorsRoute, (context) => {
    const { category } = context.req.valid("query");
    if (!category) return context.json({ factors: FACTORS });
    const activityIds = new Set(
      ACTIVITIES.filter((a) => a.category === category).map((a) => a.id),
    );
    return context.json({
      factors: FACTORS.filter((f) => activityIds.has(f.activity)),
    });
  });
}
