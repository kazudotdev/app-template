import { test, expect, beforeAll, afterAll } from "bun:test";
import { unlinkSync } from "node:fs";
import { createClient } from "./client";
import { migrate } from "./migrate";
import { users, groups, usersToGroups } from "./schema";
import { eq } from "drizzle-orm";

const URL = Bun.env.LIBSQL_URL;
if (!URL) throw new Error("LIBSQL_URL is not in .env.test");
const db = createClient(URL, { logger: false });

beforeAll(async () => {
  await migrate(db);
  console.log("finish migrations");
});

afterAll(() => {
  if (URL.includes("file:")) {
    const path = URL.split("file:")[1];
    unlinkSync(path);
  }
});

test("users table", async () => {
  const result = await db
    .insert(users)
    .values({
      id: "12345",
      email: "test@user.com",
    })
    .returning();
  expect(result.length).toBe(1);

  const { id, email } = result[0];
  const selected = await db.select().from(users);
  expect(selected.length).toBe(1);
  const { id: actId, email: actEmail } = selected[0];

  expect(actId).toBe(id);
  expect(actEmail).toBe(email);
});

test("groups table", async () => {
  const result = await db
    .insert(groups)
    .values({
      id: "54321",
      name: "testgroup1",
    })
    .returning();
  expect(result.length).toBe(1);

  const { id, name } = result[0];

  const selected = await db.select().from(groups);
  expect(selected.length).toBe(1);
  const { id: actId, name: actName } = selected[0];
  expect(actId).toBe(id);
  expect(actName).toBe(name);
});

test("user joins 2 groups", async () => {
  const testUser2 = {
    id: "2345",
    email: "test2@user.com",
  };
  const testUser3 = {
    id: "3456",
    email: "test3@user.com",
  };
  const testGroup2 = {
    id: "2345",
    name: "testgroup2",
  };
  const testGroup3 = {
    id: "3456",
    name: "testgroup3",
  };
  const userIds = await db
    .insert(users)
    .values([testUser2, testUser3])
    .returning({ id: users.id });
  const groupIds = await db
    .insert(groups)
    .values([testGroup2, testGroup3])
    .returning({ id: groups.id });

  expect(userIds[0].id).toBe(testUser2.id);
  expect(userIds[1].id).toBe(testUser3.id);
  expect(groupIds[0].id).toBe(testGroup2.id);
  expect(groupIds[1].id).toBe(testGroup3.id);

  await db.insert(usersToGroups).values([
    {
      userId: userIds[0].id, //2345
      groupId: groupIds[0].id, // 2345
    },
    {
      userId: userIds[0].id, // 2345
      groupId: groupIds[1].id, // 3456
    },
  ]);
  const user2 = await db.query.users.findFirst({
    where: eq(users.id, testUser2.id),
    with: {
      usersToGroups: {},
    },
  });
  expect(user2?.usersToGroups.length).toBe(2);
});
