import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { commonColumns } from "./common";

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
