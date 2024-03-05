import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { commonColumns } from "./common";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull().unique(),
  email: text("email", { mode: "text" }).notNull().unique(),
  ...commonColumns,
});

export const groups = sqliteTable("groups", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull()
    .unique(),
  name: text("name", { mode: "text" }).notNull(),
  ...commonColumns,
});

export const usersToGroups = sqliteTable("users_to_groups", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export type UserParam = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
