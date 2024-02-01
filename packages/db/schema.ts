import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const notes = sqliteTable("notes", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  title: text("title"),
  content: text("content"),
  created_at: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
  public: integer("private", { mode: "boolean" }).default(false),
});

export type NewNotes = typeof notes.$inferInsert;
