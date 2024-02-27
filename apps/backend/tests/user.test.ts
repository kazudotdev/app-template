import { test, expect } from "bun:test";
import { testClient } from "hono/testing";
import { Hono } from "hono";
import {
  //findUserByEmail,
  createUser,
  verifyUser,
  deleteUser,
} from "../src/user";
import { getPasscodeFromMail } from "./utils";

const newUser = "testuser1234@example.com";

test("create and verify new user", async () => {
  const app = new Hono()
    .post("/create_and_verify_user", async (c) => {
      const res = await createUser(c, { email: newUser }).then(async (r) => {
        const id = r.ok ? r.body.id : "";
        const code = (await getPasscodeFromMail()) || "";
        expect(code.length).toBeGreaterThan(1);
        return verifyUser(c, { id, code });
      });
      console.log({ res });
      return c.json(res);
    })
    .delete("/user", async (c) => {
      const { email, token } = await c.req.json<{
        email: string;
        token: string;
      }>();
      const res = await deleteUser(c, { email, token });
      expect(res.ok).toBe(true);
    });

  const { token } = await testClient(app)
    .create_and_verify_user.$post()
    .then((r) => r.json())
    .then((r) => {
      if (!r.ok) throw new Error("response error");
      const { body, token } = r;
      expect(token?.length).toBeGreaterThan(1);
      return {
        token,
        body,
      };
    });
  console.log({ token });
});
