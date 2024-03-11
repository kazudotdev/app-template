import { LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate as _migrate } from "drizzle-orm/libsql/migrator";

export const migrate = (db: LibSQLDatabase<any>) => {
  return _migrate(db, { migrationsFolder: "./drizzle" });
};
