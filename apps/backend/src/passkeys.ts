import { Hono } from "hono";
import { env } from "./env";
const app = new Hono().basePath("/passkeys");

app.get("/.well-known/jwks.json", async (c) => {
  const url = env(c).PASSKEYS_URL;
  return fetch(`${url}/.well-known/jwks.json`)
    .then(async (r) => {
      if (r.ok) return c.json(await r.json());
      return c.json({ error: true }, r.status);
    })
    .catch((_) => c.json({ error: "cannot get jwks.json" }, 500));
});

app.all("/*", async (c) => {
  const url = new URL(env(c).PASSKEYS_URL + c.req.path.split("/passkeys")[1]);
  const body =
    c.req.raw.body == null ? undefined : JSON.stringify(await c.req.json());
  const req = new Request(url, {
    headers: c.req.raw.headers,
    method: c.req.raw.method,
    mode: c.req.raw.mode,
    body,
  });
  return fetch(req);
});

export { app as passkeys };
