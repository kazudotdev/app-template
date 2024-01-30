import db from "./";
import { migrate } from "drizzle-orm/libsql/migrator";

export default async function migration() {
  return migrate(db, { migrationsFolder: "./migrations" });
}
