import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import * as schema from "./schema";

export function createClient(path: string, { logger }: { logger: boolean }) {
  const expo = openDatabaseSync(path);
  return drizzle(expo, { schema, logger });
}
