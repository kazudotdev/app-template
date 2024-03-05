import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { MigrationMeta } from "drizzle-orm/migrator";
import { createClient } from "@libsql/client";
import config from "../migrations_remote";
import { sql } from "drizzle-orm";

interface MigrationJournal {
  version: string;
  dialect: string;
  entries: {
    idx: number;
    version: string;
    when: number;
    tag: string;
    breakpoints: boolean;
  }[];
}

interface MigrationConfig {
  journal: MigrationJournal;
  migrations: Record<string, string>;
}

export function createDatabase(url: string) {
  const client = createClient({
    url,
  });
  return drizzle(client, {logger: true});
}

//async function sha256(input: string) {
//  const textEncoder = new TextEncoder();
//  const uint8 = textEncoder.encode(input);
//  const hashBuffer = await crypto.subtle.digest("SHA-256", uint8);
//  const hashArray = Array.from(new Uint8Array(hashBuffer));
//  const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, "0"));
//  return hashHex.join("");
//}

// based on https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/expo-sqlite/migrator.ts
async function readMigrationFiles({
  journal,
  migrations,
}: MigrationConfig): Promise<MigrationMeta[]> {
  const migrationQueries: MigrationMeta[] = [];

  for await (const journalEntry of journal.entries) {
    const query =
      migrations[`m${journalEntry.idx.toString().padStart(4, "0")}`];

    if (!query) {
      throw new Error(`Missing migration: ${journalEntry.tag}`);
    }

    try {
      const result = query.split("--> statement-breakpoint").map((it) => {
        return it;
      });

      migrationQueries.push({
        sql: result,
        bps: journalEntry.breakpoints,
        folderMillis: journalEntry.when,
        hash: "",
      });
    } catch {
      throw new Error(`Failed to parse migration: ${journalEntry.tag}`);
    }
  }
  return migrationQueries;
}

export async function migrate(db: LibSQLDatabase) {
  const queries = await readMigrationFiles(config);

  const migrationTableCreate = sql`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
  `;
  await db.run(migrationTableCreate);
  const dbMigrations = await db.values<[number, string, string]>(
    sql`SELECT id, hash, created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1`,
  );
  const lastDbMigration = dbMigrations[0] ?? undefined;
  const queriesToRun: string[] = [];

  for (const query of queries) {
    if (!lastDbMigration || Number(lastDbMigration[2])! < query.folderMillis) {
      queriesToRun.push(
        ...query.sql,
        `INSERT INTO "__drizzle_migrations" ("hash", "created_at") VALUES('${query.hash}', '${query.folderMillis}')`,
      );
    }
  }
  for (const q of queriesToRun) {
    await db.run(sql.raw(q));
  }
}
