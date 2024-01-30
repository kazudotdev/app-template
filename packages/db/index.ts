import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "http://localhost:8000",
});

const db = drizzle(client, { logger: true });

export default db;
