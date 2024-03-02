import { type Context } from "hono";
import { env } from "./env";
import { http } from "./http";
import type { PasscodeLoginResult } from "./type";

type PasscodeLoginParams = {
  email_id: string;
  user_id: string;
};
export const startPasscodeLogin = (
  c: Context,
  { email_id, user_id }: PasscodeLoginParams,
) =>
  http.post<PasscodeLoginResult>(
    env(c).PASSKEYS_URL + "/passcode/login/initialize",
    {
      body: {
        email_id,
        user_id,
      },
    },
  );

export const finalizePasscodeLogin = (
  c: Context,
  { id, code }: { id: string; code: string },
) =>
  http.post(env(c).PASSKEYS_URL + "/passcode/login/finalize", {
    body: {
      id,
      code,
    },
  });
