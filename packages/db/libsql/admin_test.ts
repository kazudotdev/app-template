import { test, expect } from "bun:test";
import { createDatabase, migrate } from "./index";
import AdminClient from "./admin";

const db = createDatabase("http://localhost:8033");

test("create and delete namespace", async () => {
  const admin = new AdminClient("http://localhost:8033");
  {
    const res = await admin.createNamespace("test1234");
    expect(res).toBe(true);
  }
  {
    const res = await admin.deleteNamespace("test1234");
    expect(res).toBe(true);
  }
});
