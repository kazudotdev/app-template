import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  out: "./migrations",
  verbose: true,
  strict: true,
});
