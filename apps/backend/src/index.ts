import { Hono } from "hono";
import { logger } from "hono/logger";
import db from "@db";
import { notes, type NewNotes } from "@db/schema";
const app = new Hono();

app.use("*", logger());

app.get("/", async (c) => {
  const n = await db.select().from(notes);
  return c.json({ note: n });
});

app.post("/notes", async (c) => {
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();

  console.log({ title, content });
  const value: NewNotes = {
    title: title,
    content: content,
  };
  await db.insert(notes).values(value);

  return c.json({ status: "ok" });
});

export default app;
