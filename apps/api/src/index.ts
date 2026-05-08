import { serve } from "@hono/node-server";
import { app } from "./app.js";

const PORT = Number(process.env["PORT"] ?? 4000);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`API running at http://localhost:${PORT}`);
  console.log(`OpenAPI spec  http://localhost:${PORT}/openapi.json`);
  console.log(`Swagger UI    http://localhost:${PORT}/docs`);
});
