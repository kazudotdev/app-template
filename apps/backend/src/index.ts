import { Hono } from "hono";
import { logger } from "hono/logger";
const app = new Hono();

app.use("*", logger());

app.get("/", async (c) => {
  return c.json({ hello: "world" });
});

app.post("/user/db/v1/namespaces/:namespace/create", async (c) => {
  const { namespace } = c.req.param();
  const url = new URL(
    `http://localhost:8033/v1/namespaces/${namespace}/create`,
  );
  const req = new Request(url, {
    headers: c.req.raw.headers,
    method: c.req.raw.method,
    mode: c.req.raw.mode,
    body: "{}",
  });
  req.headers.set("host", url.host);
  req.headers.set("content-type", "application/json");
  return fetch(url, req).catch((e) => c.json({ error: e }));
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
