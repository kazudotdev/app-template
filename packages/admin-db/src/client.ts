import { drizzle } from "drizzle-orm/libsql";
import { createClient as _createClient } from "@libsql/client";
import * as schema from "./schema";

export const createClient = (url: string, options?: { logger?: boolean }) => {
  const logger = options?.logger;
  return drizzle(_createClient({ url }), { schema, logger });
};
