import { Hono, type Context } from "hono";
import { env } from "./env";
import { http } from "./http";
import { verifyTokenMiddleware } from "./middleware";
import type {
  UserFindByEmailResult,
  UserCreateResult,
  PasscodeLoginResult,
  UserDeleteResult,
} from "./type";

export const createUser = async (c: Context, { email }: { email: string }) => {
  return http
    .post<UserCreateResult>(env(c).PASSKEYS_URL + "/users", {
      body: {
        email,
      },
    })
    .then((r) => {
      if (!r.ok) return r; // cannot create user. for example, this email has already been registered
      const { body } = r;
      return http.post<PasscodeLoginResult>(
        env(c).PASSKEYS_URL + "/passcode/login/initialize",
        {
          body,
        },
      );
    });
};

export const verifyUser = async (
  c: Context,
  { id, code }: { id: string; code: string },
) => {
  return http.post<PasscodeLoginResult>(
    env(c).PASSKEYS_URL + "/passcode/login/finalize",
    {
      body: {
        code,
        id,
      },
    },
  );
};

export const findUserByEmail = async (
  c: Context,
  { email }: { email: string },
) => {
  return http.post<UserFindByEmailResult>(env(c).PASSKEYS_URL + "/user", {
    body: {
      email,
    },
  });
};

export const deleteUser = async (c: Context) => {
  return http.delete<UserDeleteResult>(env(c).PASSKEYS_URL + "/user", {
    //@ts-ignore
    headers: c.req.raw.headers,
  });
};

// Endpoint
const appUser = new Hono()
  .use("/delete", verifyTokenMiddleware)
  .post("/create", async (c) => {
    const { email } = await c.req.json<{ email: string }>();
    return c.json(await createUser(c, { email }));
  })
  .post("/verify", async (c) => {
    const { id, code } = await c.req.json<{ id: string; code: string }>();
    return c.json(await verifyUser(c, { id, code }));
  })
  .delete("/delete", async (c) => {
    return c.json(await deleteUser(c));
  });

export default appUser;
