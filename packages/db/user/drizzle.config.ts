import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  breakpoints: true,
  driver: "expo",
  out: "./drizzle",
  strict: true,
});
