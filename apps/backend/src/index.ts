import { Hono } from "hono";
import { logger } from "hono/logger";
import { admin, user } from "./db";
const app = new Hono();

app.use("*", logger());

app.get("/", async (c) => {
  return c.json({ hello: "world" });
});

app.route("/db", admin);
app.route("/db", user);
export default app;
