import { createRoute, z } from "@hono/zod-openapi";
import type { OpenAPIHono } from "@hono/zod-openapi";

const HealthResponseSchema = z
  .object({ status: z.literal("ok") })
  .openapi("HealthResponse");

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["System"],
  summary: "Health check",
  responses: {
    200: {
      content: { "application/json": { schema: HealthResponseSchema } },
      description: "Service is healthy",
    },
  },
});

export function registerHealthRoutes(app: OpenAPIHono) {
  app.openapi(healthRoute, (c) => c.json({ status: "ok" as const }));
}
