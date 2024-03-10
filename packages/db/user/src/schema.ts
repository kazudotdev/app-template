import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

const commonColumns = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

export const notes = sqliteTable("notes", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  title: text("title"),
  content: text("content"),
  owner: text("owner").default("user"),
  public: integer("private", { mode: "boolean" }).default(false),
  ...commonColumns,
});

export type NewNotes = typeof notes.$inferInsert;
