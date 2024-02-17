import { Hono } from "hono";
import { logger } from "hono/logger";
const app = new Hono();

app.use("*", logger());

app.get("/", async (c) => {
  return c.json({ hello: "world" });
});

app.all("/user/db/:namespace/*", async (c) => {
  const { namespace } = c.req.param();
  const path = c.req.path.split(`/user/db/${namespace}/`)[1] ?? "";

  const req = c.req.raw.clone();
  const body = JSON.stringify(await c.req.json());
  req.headers.set("host", `${namespace}.localhost:8000/${path}`);
  req.headers.set("Accept-Encoding", "identity"); //workaround: https://github.com/oven-sh/bun/issues/686#issuecomment-1301468824
  return fetch(`http://localhost:8000/${path}`, {
    method: req.method,
    mode: req.mode,
    body,
    headers: req.headers,
  });
});

export default app;
