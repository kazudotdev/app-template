import { test, expect } from "bun:test";
import { createDatabase, migrate } from "../libsql";
import { sql } from "drizzle-orm";
import { users } from "../schema/remote";
//const db = createDatabase("http://localhost:8000/dev/testdb/");
const db = createDatabase(":memory:", { logger: false });

test("migration test", async () => {
  await migrate(db);
  const result = await db.run(sql`SELECT * from __drizzle_migrations`);
  expect(result.columns.length).toBeGreaterThan(0);
  console.log({ rows: result.toJSON() });
});

test("insert dummy user data", async () => {
  const result = await db
    .insert(users)
    .values({ id: "test-user-id", email: "test@user.com" })
    .returning();
  expect(result.length).toBe(1);
  expect(result[0].id).toBe("test-user-id");
  expect(result[0].email).toBe("test@user.com");
});
