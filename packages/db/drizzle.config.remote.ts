import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema/remote.ts",
  verbose: true,
  driver: "expo",
  out: "./drizzle/remote",
  strict: true,
});
