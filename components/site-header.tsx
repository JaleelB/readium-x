import React from "react";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import Nav from "./nav";
import { Profile, User } from "@/server/db/schema";
import { getUserProfileUseCase } from "@/use-cases/users";

export type UserInfo =
  | { id: number; email: string | null; emailVerified: Date | null }
  | null
  | undefined;

async function SiteHeader() {
  let userSession = await getCurrentUser();
  let user: User | undefined = undefined;
  let profile: Profile | undefined = undefined;

  if (!userSession) {
    user = undefined;
  }

  if (userSession) {
    user = await getUser(userSession.id);
    profile = await getUserProfileUseCase(userSession.id);
  }

  return <Nav user={user} profile={profile as Profile} />;
}

export default SiteHeader;
