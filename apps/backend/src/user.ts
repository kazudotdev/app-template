import { Hono, type Context } from "hono";
import { validator } from "hono/validator";
import { env } from "./env";
import { http } from "./http";
import { createNamespace, deleteNamespace } from "./db";
import { verifyTokenMiddleware } from "./middleware";
import type {
  UserFindByEmailResult,
  UserCreateResult,
  PasscodeLoginResult,
  UserDeleteResult,
  ApiErrorResponse,
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
const user = new Hono()
  .use("/delete", verifyTokenMiddleware)
  .post(
    "/create",
    validator("json", (value: { email: string }, c) => {
      if (!value["email"] || typeof value["email"] !== "string")
        return c.json(
          {
            ok: false,
            body: {
              code: 401,
              message: "Invalid request body",
            },
          },
          401,
        );
      return value;
    }),
    async (c) => {
      const { email } = await c.req.json<{ email: string }>();
      return c.json(await createUser(c, { email }));
    },
  )
  .post(
    "/verify",
    validator("json", (value: { id: string; code: string }, c) => {
      if (
        !value["id"] ||
        !value["code"] ||
        typeof value["id"] !== "string" ||
        typeof value["code"] !== "string"
      ) {
        return c.json(
          {
            ok: false,
            body: {
              code: 401,
              message: "Invalid request body",
            },
          },
          401,
        );
      }
      return value;
    }),
    async (c) => {
      const { id, code } = await c.req.json<{ id: string; code: string }>();
      const res = await verifyUser(c, { id, code }).then(async (r) => {
        if (r.ok) {
          c.req.raw.headers.set("Authorization", `Bearer ${r.token}`);
          const created = await createNamespace(c);
          if (created.ok) {
            return r;
          }
        }
        const err: ApiErrorResponse = {
          ok: false,
          body: {
            code: 500,
            message: "cannot create namespace",
          },
        };
        return err;
      });
      return c.json(res);
    },
  )
  .delete(
    "/delete",
    validator("header", (value, c) => {
      const authorization = c.req.raw.headers.get("Authorization");
      if (authorization === null) {
        return c.text("no authorization in header");
      }
      return value;
    }),
    async (c) => {
      const deleted = await deleteUser(c).then(async (r) => {
        if (r.ok) {
          if ((await deleteNamespace(c)).ok) {
            return r;
          } else {
            // error: cannot delete namespace
            const err: ApiErrorResponse = {
              ok: false,
              body: {
                code: 500,
                message: "cannot delete namespace",
              },
            };
            return err;
          }
        }
        return r;
      });
      return c.json(deleted);
    },
  );

export default user;
