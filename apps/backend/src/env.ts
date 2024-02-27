import { type Context } from "hono";
import { env as _env } from "hono/adapter";

type Env = Partial<{
  PASSKEYS_URL: string;
  PASSKEYS_ADMIN_URL: string;
}>;

export const env = (c: Context) => _env<Env>(c);
