import { integer, text, sqliteTableCreator } from "drizzle-orm/sqlite-core";

const sqliteTable = sqliteTableCreator((name) => `app_${name}`);

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  openaiApiKey: text("openai_api_key"),
});

export const profiles = sqliteTable("profile", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  displayName: text("display_name"),
  imageId: text("image_id"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

// Article schemas
export const bookmarks = sqliteTable("bookmark", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content").notNull(),
  authorName: text("author_name"),
  authorImageURL: text("author_image_url"),
  authorProfileURL: text("author_profile_url"),
  articleUrl: text("article_url").notNull(),
  publicationName: text("publication_name"),
  readTime: text("read_time"),
  publishDate: text("publish_date"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const readingHistory = sqliteTable("reading_history", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  authorName: text("author_name").notNull(),
  articleUrl: text("article_url").notNull(),
  articleTitle: text("article_title").notNull(),
  authorImageURL: text("author_image_url"),
  authorProfileURL: text("author_profile_url"),
  readTime: text("read_time").notNull(),
  accessTime: integer("access_time", { mode: "timestamp" }).notNull(), // When the article was accessed
  progress: text("progress"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
