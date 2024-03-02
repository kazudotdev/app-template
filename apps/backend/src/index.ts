import { Hono } from "hono";
import { logger } from "hono/logger";
import { admin, user } from "./db";
import { passkeys } from "./passkeys";
const app = new Hono();

app.use("*", logger());

app.get("/", async (c) => {
  return c.json({ hello: "world" });
});

app.route("/db", admin);
app.route("/user", user);
app.route("/", passkeys);

export default app;
