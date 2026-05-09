import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./server/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "development"
        ? "file:./server/db/local.db"
        : process.env.DATABASE_URL!,
    authToken:
      process.env.NODE_ENV === "development"
        ? undefined
        : process.env.DB_AUTH_TOKEN,
  },
});
