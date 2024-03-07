import { Hono, type Context } from "hono";
import { env } from "./env";
import { http } from "./http";
import { getUserIdFromToken } from "./utils";
import type { ApiErrorResponse } from "./type";
const user = new Hono();
//const adminDB = new Hono();

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

user.on(["POST"], "/:namespace/*", async (c) => {
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
  req.headers.set("host", `${namespace}.${env(c).LIBSQL_URL}/${path}`);
  req.headers.set("Accept-Encoding", "identity"); //workaround: https://github.com/oven-sh/bun/issues/686#issuecomment-1301468824
  console.log({ req });
  return fetch(req).catch((e) => c.json({ error: e }));
});

const db = {
  user,
};

export default db;
