import db from "./";
import { migrate } from "drizzle-orm/libsql/migrator";

function migration() {
  return migrate(db, { migrationsFolder: "./migrations" });
}

await migration();
