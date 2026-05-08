import express from "express";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

const app = express();
const PORT = process.env["PORT"] ?? 4000;

app.use(cors());
app.use(express.json());

app.use(
  "/graphql",
  createHandler({
    schema,
    rootValue: resolvers,
  })
);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}/graphql`);
});
