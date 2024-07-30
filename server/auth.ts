import { GitHub, Google } from "arctic";
import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db/db";
import { sessions, users } from "./db/schema";
import { cookies } from "next/headers";
import { User } from "lucia";
import { Session } from "lucia";
import { env } from "@/env";
import { UserId as CustomUserId } from "@/types/index";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // Ensure the cookie is available for all paths
      // domain: process.env.NEXT_PUBLIC_DOMAIN
      //   ? env.NEXT_PUBLIC_DOMAIN
      //   : undefined,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
    };
  },
});

export const validateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  console.log("validate session result", result);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      console.log("session cookie when fresh", sessionCookie);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      console.log("session cookie when blank", sessionCookie);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch (error) {
    // console.log("error setting cookie:", result);
    if (error instanceof Error) {
      console.error("error setting cookie: ", error.message);
    }

    console.log("result of not being able to set cookie:", error);
  }
  return result;
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: CustomUserId;
    };
    UserId: CustomUserId;
  }
}

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
);

export const googleAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.HOST_NAME}/api/login/google/callback`,
);
