import { test, expect } from "bun:test";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import { createNamespace, deleteNamespace } from "../src/db";

test("create and delete namespacae", async () => {
  const app = new Hono()
    .post("/create", async (c) => {
      const res = await createNamespace(c);
      expect(res.ok).toBe(true);
      return c.json(res);
    })
    .post("/delete", async (c) => {
      const res = await deleteNamespace(c);
      return c.json(res);
    });
  const token =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImJhZDAwMzAwLWFkYjgtNDJkZC1hN2VkLWYxYmI4NDMxZjMxNCIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsibG9jYWxob3N0Il0sImV4cCI6MTcwOTM2MTUyNiwiaWF0IjoxNzA5MzU3OTI2LCJzdWIiOiI2MDZhNzg5MS1lYzNjLTRmMTktYjQ4Ni0yNzhkMTI1NTEzZmYifQ.qAgEEpwIsJZio-XbN20fmNBMr51MNAzNmfHTINxLTMYRjCwVZ51Niw2ikjJvMLxfBhsLGePPMLveDc2eJb1KZzNX1qrZcDT7j_7ugvKxIXQPRd-vj473a8SZ2h968T-4WNP1umzLjSdNpr6dU3EaIWugtrN_HtPbNrHz1OPsrb8F3DhCBEWmJO68Qkk7it943GTI4kBBSleMtS-5rLBE6XoNhYDB0F0xeTlWe5Ldt0V79I1qDGDW9B9YH7EhHXWVRcrBKP4zy1M1vJ3fWzK4_LJNc8uwHL4tkIYrxRLAb6IQCwKZ15h22DQ4v0AAKCIw5gWtYHto6UECR0lKrOv6wuLYP8z4CXZEfyGeV3im_HJhE85xwX7jCG1NMb6LJjusjlYBOZpnVl5pQ_CW6kvFch7QOvZEMgqc2lJwO0YcTjqxcR1BUoRJtDZgwnismc0ACATzOLy_5RkKXg4pN3X7o5t5zmusjbPrDpQzXViJdVFkspbimZv_1GCROcRMUEGiIUW1Lti5o8xlcCQnQ_sj4SC5VGotaWQvRzx4a_Iu87wAbmL4DEJk1wGribQeK9TSMex9CYiK2rgivuYCFCmD8qrYm6BMctW2AqENS3z5SAzyR3nupUkXLfBkBKeBBbBgaUhJqSejM9awxRWoh_wQvROtB9vxaZ591sIqKO5xQhY";
  const created = await testClient(app).create.$post(
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
  expect(created.ok).toBe(true);

  const deleted = await testClient(app).delete.$post(
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
  expect(deleted.ok).toBe(true);
});
