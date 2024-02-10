import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  verbose: true,
  driver: "expo",
  out: "./drizzle",
  strict: true,
});
