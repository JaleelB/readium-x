import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.string().optional(),
    DATABASE_URL: z.string().min(1),
    DB_AUTH_TOKEN: z.string().optional(),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().optional(),
    UMAMI_URL: z.string().min(1),
    UMAMI_DATA_WEBSITE_ID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    DB_AUTH_TOKEN: process.env.DB_AUTH_TOKEN,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    UMAMI_URL: process.env.UMAMI_URL,
    UMAMI_DATA_WEBSITE_ID: process.env.UMAMI_DATA_WEBSITE_ID,
  },
});
