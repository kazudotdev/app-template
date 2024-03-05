import { drizzle, ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations as _migration } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../migrations_local";
export { TextEncording } from "text-encoding";
export * from "../schema/local";

export function createDatabase(path: string) {
  const expo = openDatabaseSync(path);
  return drizzle(expo);
}

export function useMigrations(db: ExpoSQLiteDatabase) {
  return _migration(db, migrations);
}
