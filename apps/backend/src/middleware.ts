import { type Context } from "hono";
import { env } from "./env";
import { getToken } from "./utils";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { ApiErrorResponse } from "./type";

export const verifyTokenMiddleware = async (c: Context, next: Function) => {
  const token = getToken(c);
  if (!token) {
    console.log("no token");
    return new Response("Unauthorizaed", { status: 401 });
  }

  const base = env(c).PASSKEYS_URL;
  if (!base) return new Response("Internal server error", { status: 500 });
  const apiUrl = new URL(base + "/.well-known/jwks.json");
  const jwks =
    //@ts-ignore
    createRemoteJWKSet(apiUrl);
  const ok = await jwtVerify(token, jwks)
    .then((_) => true)
    .catch((_) => false);
  if (!ok) {
    console.log("authenticate jwt is failed");
    //throw new Response("Token is invalid", { status: 401 });
    const err: ApiErrorResponse = {
      ok: false,
      body: {
        code: 401,
        message: "authenticate jwt is failed",
      },
    };
    return c.json(err, 401);
  }
  await next();
};
