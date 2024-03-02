import { type Context } from "hono";
import { getCookie } from "hono/cookie";
import { decode, verify } from "hono/jwt";

export const getToken = (c: Context) => {
  if (
    c.req.raw.headers.get("authorization") &&
    c.req.raw.headers.get("authorization")?.split(" ")[0] === "Bearer"
  ) {
    return c.req.raw.headers.get("authorization")?.split(" ")[1] || undefined;
  } else if (getCookie(c, "hanko")) {
    return getCookie(c, "hanko") || undefined;
  } else {
    return undefined;
  }
};

export const getUserIdFromToken = (
  token: Context | string,
): { ok: boolean; userId?: string } => {
  try {
    const { payload }: { payload: { sub: string } } = ((
      token: Context | string,
    ) => {
      const jwt = (() => {
        switch (typeof token) {
          case "string":
            return token;
          default:
            return getToken(token) || "";
        }
      })();
      const decoded = decode(jwt);
      return decoded;
    })(token);
    if (payload.sub === undefined) {
      return {
        ok: false,
      };
    }
    return {
      ok: true,
      userId: payload.sub,
    };
  } catch (err) {
    return {
      ok: false,
    };
  }
};
