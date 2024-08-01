import React from "react";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import Nav from "./nav";
import { User } from "@/server/db/schema";

export type UserInfo =
  | { id: number; email: string | null; emailVerified: Date | null }
  | null
  | undefined;

async function SiteHeader() {
  let userSession = await getCurrentUser();
  let user: User | undefined = undefined;

  if (!userSession) {
    user = undefined;
  }

  if (userSession) {
    user = await getUser(userSession.id);
  }

  return <Nav user={user} />;
}

export default SiteHeader;
