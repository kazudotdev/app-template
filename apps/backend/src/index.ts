import { Hono } from "hono";
import { logger } from "hono/logger";
import db from "./db";
import user from "./user";
import { passkeys } from "./passkeys";
const app = new Hono();

app.use("*", logger());

app.get("/", async (c) => {
  return c.json({ hello: "world" });
});

app.route("/db", db.user);
app.route("/user", user);
app.route("/", passkeys);

export default app;

export type UserAppType = typeof user;
