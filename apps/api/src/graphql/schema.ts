import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Query {
    health: String
  }
`);
