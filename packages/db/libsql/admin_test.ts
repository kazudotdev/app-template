import { test, expect } from "bun:test";
import { createDatabase, migrate } from "./index";
import AdminClient from "./admin";

const db = createDatabase("http://localhost:8000");

test("create new namespace", async () => {
  const admin = new AdminClient("http://localhost:8033");
  await admin.createNamespace("testdb");
});
