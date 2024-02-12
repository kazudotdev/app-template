import { test, expect } from "bun:test";
import { createDatabase, migrate } from "./index";
import { notes } from "../schema";
import { sql } from "drizzle-orm";

const db = createDatabase(":memory:");

test("migration test", async () => {
  await migrate(db);
  const result = await db.run(sql`SELECT * from __drizzle_migrations`);
  expect(result.columns.length).toBeGreaterThan(0);

  await db.insert(notes).values({ title: "test", content: "hogehoge" });
  const _notes = await db.select().from(notes);
  expect(_notes.length).toBe(1);
  expect(_notes[0].title).toBe("test");
  expect(_notes[0].content).toBe("hogehoge");
});
