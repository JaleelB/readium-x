import { integer, text, sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const accountTypeEnum = ["email", "google", "github"] as const;

const sqliteTable = sqliteTableCreator((name) => `app_${name}`);

export const users = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
});

export const accounts = sqliteTable("accounts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
  githubId: text("github_id").unique(),
  googleId: text("google_id").unique(),
  password: text("password"),
  salt: text("salt"),
});

export const magicLinks = sqliteTable("magic_links", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const resetTokens = sqliteTable("reset_tokens", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const verifyEmailTokens = sqliteTable("verify_email_tokens", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const profiles = sqliteTable("profile", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  displayName: text("display_name"),
  imageId: text("image_id"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  expiresAt: integer("expires_at").notNull(),
});

// Article schemas
export const bookmarks = sqliteTable("bookmark", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  articleImageSrc: text("article_image_src"),
  authorName: text("author_name"),
  authorImageURL: text("author_image_url"),
  authorProfileURL: text("author_profile_url"),
  publicationName: text("publication_name"),
  readTime: text("read_time"),
  publishDate: text("publish_date"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
