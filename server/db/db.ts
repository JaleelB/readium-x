import * as schema from "./schema";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { env } from "@/env";

const url =
  process.env.NODE_ENV === "development"
    ? "file:./server/db/local.db"
    : env.DATABASE_URL;
const authToken =
  process.env.NODE_ENV === "development" ? undefined : env.DB_AUTH_TOKEN;

export const client = createClient({
  url: url!,
  authToken: authToken,
});

export const db = drizzle(client, { schema });
