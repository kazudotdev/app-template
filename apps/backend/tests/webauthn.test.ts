import { describe, expect, test } from "bun:test";
import { getPasscodeFromMail, deleteAllMails } from "./utils";

const deleteAllUsers = async () => {
  // admin api :8034
  const adminApi = "http://localhost:8034";
  const ok = await fetch(adminApi + "/users")
    .then((r) => r.json() as Promise<{ id: string }[]>)
    .then((d) => {
      return d.every(async ({ id }) => {
        const r = await fetch(adminApi + "/users/" + id, {
          method: "DELETE",
        });
        return r.status === 204;
      });
    });
  if (!ok) {
    throw new Error("cannot delete all users");
  }
};

const baseUrl = "http://localhost:3000/webauthn";
describe("register and verify email by passcode", async () => {
  await deleteAllMails();
  await deleteAllUsers();

  test("create user", async () => {
    const res = await fetch(baseUrl + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "testuser@example.com",
      }),
    }).then(async (r) => {
      const data = (await r.json()) as {
        user_id: string;
        email_id: string;
      };
      return {
        status: r.status,
        uid: data.user_id,
        data,
      };
    });
    expect(res.status).toBe(200);
    const data = res.data;

    const { id, code } = await fetch(baseUrl + "/passcode/login/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((r) => r.json() as Promise<{ id?: string }>)
      .then(async ({ id }) => {
        if (!id) throw new Error("invalid passcode");
        const code = await getPasscodeFromMail().then((c) => {
          if (!c) throw new Error("cannot obtain valid passcode");
          return c;
        });
        return { id, code };
      });

    const { status, token } = await fetch(
      baseUrl + "/passcode/login/finalize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          code,
        }),
      },
    ).then(async (r) => {
      return {
        status: r.status,
        token: r.headers.get("X-Auth-Token"),
      };
    });
    expect(status).toBe(200);
    expect(token).toBeString();

    const userId = await fetch(baseUrl + "/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json() as Promise<{ id?: string }>)
      .then(({ id }) => id);
    expect(userId).not.toBeUndefined();
    expect(userId).toBe(res.uid);
  });
});
