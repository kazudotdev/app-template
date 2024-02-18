import { Hono } from "hono";

const user = new Hono();
const admin = new Hono();

const adminURL = process.env.DB_ADMIN_API ?? "http://localhost:8033";
const userURL = process.env.DB_USER_API ?? "http://localhost:8000";

admin.on(
  ["POST", "DELETE"],
  "/v1/namespaces/:namespace/:operation?",
  async (c) => {
    const { namespace, operation } = c.req.param();
    if (operation && operation === "create" && c.req.raw.method === "DELETE") {
      throw new Error("no supported");
    }
    const url = new URL(
      `${adminURL}/v1/namespaces/${namespace}/${operation ?? ""}`.replace(
        /(.+)\/$/,
        "$1",
      ),
    );
    const req = new Request(url, {
      headers: c.req.raw.headers,
      method: c.req.raw.method,
      mode: c.req.raw.mode,
      body: "{}",
    });
    req.headers.set("host", url.host);
    req.headers.set("content-type", "application/json");
    return fetch(req).catch((e) => c.json({ error: e }));
  },
);

user.on(["POST"], "/:namespace/*", async (c) => {
  const { namespace } = c.req.param();
  c.req.path;
  const path = c.req.path.split(`/${namespace}/`)[1] ?? "";
  const body = JSON.stringify(await c.req.json());

  const url = new URL(userURL + "/" + path);
  const req = new Request(url, {
    headers: c.req.raw.headers,
    method: c.req.raw.method,
    mode: c.req.raw.mode,
    body,
  });
  req.headers.set("host", `${namespace}.localhost:8000/${path}`);
  req.headers.set("Accept-Encoding", "identity"); //workaround: https://github.com/oven-sh/bun/issues/686#issuecomment-1301468824
  console.log({ req });
  return fetch(req).catch((e) => c.json({ error: e }));
});

export { admin, user };
