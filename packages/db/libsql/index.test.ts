import { test, expect } from "bun:test";
import { createDatabase, migrate } from "./index";
import { notes } from "../schema";
import { sql } from "drizzle-orm";

//const db = createDatabase("http://localhost:8000/dev/testdb/");
const db = createDatabase("http://localhost:3000/user/db/testdb/");

test("migration test", async () => {
  await migrate(db);
  const result = await db.run(sql`SELECT * from __drizzle_migrations`);
  expect(result.columns.length).toBeGreaterThan(0);

  await db.insert(notes).values({ title: "test", content: "hogehoge" });
  const _notes = await db.select().from(notes);
  expect(_notes.length).toBeGreaterThan(0);
  expect(_notes[0].title).toBe("test");
  expect(_notes[0].content).toBe("hogehoge");
});
