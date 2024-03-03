import { Hono, type Context } from "hono";
import { env } from "./env";
import { http } from "./http";
import { getUserIdFromToken } from "./utils";
import type { ApiErrorResponse } from "./type";
const appDB = new Hono();
const adminDB = new Hono();

export const createNamespace = async (c: Context) => {
  const { ok, userId } = getUserIdFromToken(c);
  if (!ok) {
    const err: ApiErrorResponse = {
      ok: false,
      body: {
        code: 500,
        message: "Invalid token",
      },
    };
    return err;
  }
  const headers = c.req.raw.headers;
  headers.set("Content-Type", "application-json");
  return http.post<unknown>(
    `${env(c).LIBSQL_ADMIN_URL}/v1/namespaces/${userId}/create`,
    {
      body: {},
      //@ts-ignore
      headers,
    },
  );
};

export const deleteNamespace = async (c: Context) => {
  const { ok, userId } = getUserIdFromToken(c);
  if (!ok) {
    const err: ApiErrorResponse = {
      ok: false,
      body: {
        code: 500,
        message: "Invalid token",
      },
    };
    return err;
  }
  return http.delete(`${env(c).LIBSQL_ADMIN_URL}/v1/namespaces/${userId}`, {
    //@ts-ignore
    headers: c.req.raw.headers,
  });
};

adminDB.on(
  ["POST", "DELETE"],
  "/v1/namespaces/:namespace/:operation?",
  async (c) => {
    console.log("call admin api");
    const { namespace, operation } = c.req.param();
    if (operation && operation === "create" && c.req.raw.method === "DELETE") {
      throw new Error("no supported");
    }
    const url = new URL(
      `${env(c).LIBSQL_ADMIN_URL}/v1/namespaces/${namespace}/${
        operation ?? ""
      }`.replace(/(.+)\/$/, "$1"),
    );
    const req = new Request(url, {
      headers: c.req.raw.headers,
      method: c.req.raw.method,
      mode: c.req.raw.mode,
      body: "{}",
    });
    req.headers.set("host", url.host);
    req.headers.set("content-type", "application/json");
    return fetch(req)
      .catch((e) => c.json({ error: e }))
      .then(async (r) => {
        console.log(await r.json());
        return r;
      });
  },
);

appDB.on(["POST"], "/:namespace/*", async (c) => {
  const { namespace } = c.req.param();
  c.req.path;
  const path = c.req.path.split(`/${namespace}/`)[1] ?? "";
  const body = JSON.stringify(await c.req.json());

  const url = new URL(env(c).LIBSQL_URL + "/" + path);
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

const db = {
  user: appDB,
};

export default db;
