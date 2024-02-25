import { Hono, type Context } from "hono";
import { env } from "hono/adapter";
const app = new Hono().basePath("/passkeys");

const apiUrl = (c: Context) => {
  const { PASSKEYS_URL } = env<{ PASSKEYS_URL?: string }>(c);
  return PASSKEYS_URL ?? "http://localhost:8001";
};

const secretKey = (c: Context) => {
  const { PASSKEYS_SECRET_KEY } = env<{ PASSKEYS_SECRET_KEY?: string }>(c);
  return PASSKEYS_SECRET_KEY ?? "secret_keys_does_not_publish";
};

app.get("/.well-known/jwks.json", async (c) => {
  const url = apiUrl(c);
  return fetch(`${url}/.well-known/jwks.json`)
    .then(async (r) => {
      if (r.ok) return c.json(await r.json());
      return c.json({ error: true }, r.status);
    })
    .catch((_) => c.json({ error: "cannot get jwks.json" }, 500));
});

app.all("/*", async (c) => {
  const url = new URL(apiUrl(c) + c.req.path.split("/passkeys")[1]);
  const body =
    c.req.raw.body == null ? undefined : JSON.stringify(await c.req.json());
  const req = new Request(url, {
    headers: c.req.raw.headers,
    method: c.req.raw.method,
    mode: c.req.raw.mode,
    body,
  });
  console.log({ req });
  return fetch(req);
});

export { app as passkeys };
