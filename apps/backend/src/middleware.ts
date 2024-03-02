import { type Context } from "hono";
import { getCookie } from "hono/cookie";
import { env } from "./env";
import { createRemoteJWKSet, jwtVerify } from "jose";

export const verifyTokenMiddleware = async (c: Context, next: Function) => {
  const token = (() => {
    if (
      c.req.header("authorization") &&
      c.req.header("authorization")?.split(" ")[0] === "Bearer"
    ) {
      return c.req.header("authorization")?.split(" ")[1] || undefined;
    } else if (getCookie(c, "hanko")) {
      return getCookie(c, "hanko") || undefined;
    } else {
      return undefined;
    }
  })();
  if (!token) {
    console.log("no token")
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
  if (!ok) throw new Response("Token is invalid", { status: 401 });
  await next();
};
