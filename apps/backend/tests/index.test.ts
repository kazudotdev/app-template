import { test, expect } from "bun:test";
import { testClient } from "hono/testing";
import appUser from "../src/user";
import { getPasscodeFromMail } from "./utils";

test("create test user", async () => {
  const id = await testClient(appUser)
    .create.$post({
      json: { email: "test@user.com" },
    })
    .then((r) => r.json())
    .then((r) => {
      console.log({r})
      expect(r.ok).toBe(true);
      expect(r).toHaveProperty("body.id");
      return r.ok ? r.body.id : undefined;
    });
  expect(id).not.toBeUndefined();

  const res = await getPasscodeFromMail()
    .then((code) => {
      expect(code).not.toBeNull();
      return code!;
    })
    .then(async (code) => {
      return await testClient(appUser).verify.$post({
        json: {
          id,
          code,
        },
      });
    })
    .then((r) => r.json())
    .then((r) => {
      expect(r.ok).toBe(true);
      return r.ok ? { id: r.body.id, token: r.token } : undefined;
    });
  expect(res).not.toBeUndefined();
  console.log(res)
});
