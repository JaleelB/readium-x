import React from "react";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import Nav from "./nav";
import { Profile } from "@/server/db/schema";
import { getUserProfileUseCase } from "@/use-cases/users";

export type UserInfo =
  | { id: string; email: string | null }
  | null
  | undefined;

async function SiteHeader() {
  const userSession = await getCurrentUser();

  const [user, profile] = await Promise.all([
    userSession ? getUser(userSession.id) : Promise.resolve(undefined),
    userSession
      ? getUserProfileUseCase(userSession.id)
      : Promise.resolve(undefined),
  ]);

  // If there's no user or profile, they will be undefined
  // The Nav component should handle these cases appropriately

  return <Nav user={user} profile={profile} />;
}

export default SiteHeader;
