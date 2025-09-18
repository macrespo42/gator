import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  text,
  foreignKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable(
  "feeds",
  {
    id: uuid().primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    name: text("name").notNull(),
    url: text("url").notNull().unique(),
    user_id: uuid("user_id").notNull(),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.user_id],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  }),
);

export const feedsRelations = relations(feeds, ({ one }) => ({
  user: one(users, {
    fields: [feeds.user_id],
    references: [users.id],
  }),
}));

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferInsert;
