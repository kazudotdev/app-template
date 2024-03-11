import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { useMigrations as _migration } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../dist/migrations";

export function useMigrations(db: ExpoSQLiteDatabase) {
  return _migration(db, migrations);
}
