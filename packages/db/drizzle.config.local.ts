import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/local.ts",
  verbose: true,
  driver: "expo",
  out: "./drizzle/local",
  strict: true,
});
