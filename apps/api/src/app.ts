import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { registerHealthRoutes } from "./routes/health.js";
import { registerRegistryRoutes } from "./routes/registry.js";
import { registerCalculateRoutes } from "./routes/calculate.js";

export const app = new OpenAPIHono();

app.use("*", cors());

registerHealthRoutes(app);
registerRegistryRoutes(app);
registerCalculateRoutes(app);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Sinai Carbon Footprint API",
    version: "1.0.0",
    description:
      "REST API for calculating personal carbon footprints using a modular pipeline: " +
      "CATEGORY → ACTIVITY → TRANSFORMATION → EMISSION FACTOR → RESULT. " +
      "Factors are independent objects keyed by region and year, sourced from the " +
      "EPA GHG Emission Factors Hub (2023) and EPA eGRID2023. " +
      "All results are in kg CO2 equivalent (IPCC AR5 GWP100).",
  },
  servers: [{ url: "http://localhost:4000", description: "Local development" }],
});

app.get("/docs", swaggerUI({ url: "/openapi.json" }));
