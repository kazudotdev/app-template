import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  breakpoints: true,
  out: "./drizzle",
  strict: true,
});
