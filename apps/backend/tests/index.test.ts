import { test, expect } from "bun:test";
import { testClient } from "hono/testing";
import appUser from "../src/user";
import { getPasscodeFromMail } from "./utils";

test("create test user", async () => {
  const email = "test@user.com";
  const id = await testClient(appUser)
    .create.$post({
      json: { email },
    })
    .then((r) => r.json())
    .then((r) => {
      console.log({ r });
      expect(r.ok).toBe(true);
      expect(r).toHaveProperty("body.id");
      return r.ok ? r.body.id : undefined;
    });
  expect(id).not.toBeUndefined();
  console.log({ id });

  const verified = await getPasscodeFromMail()
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
  expect(verified).not.toBeUndefined();

  if (!verified) throw new Error("verify email error");
  console.log({ token: verified.token });
  const deleted = await testClient(appUser)
    .delete.$delete(
      {
        json: {
          email,
        },
      },
      {
        headers: {
          Authorization: "Bearer " + verified.token,
        },
      },
    )
    .then((r) => r.json());

  expect(deleted.ok).toBe(true);
});
