import React from "react";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import Nav from "./nav";
import { Profile, User } from "@/server/db/schema";
import { getUserProfileUseCase } from "@/use-cases/users";
import { redirect } from "next/navigation";

export type UserInfo =
  | { id: number; email: string | null; emailVerified: Date | null }
  | null
  | undefined;

async function SiteHeader() {
  const userSession = await getCurrentUser();

  if (!userSession) {
    redirect("/signin");
  }

  const [user, profile] = await Promise.all([
    getUser(userSession.id),
    getUserProfileUseCase(userSession.id),
  ]);

  if (!user || !profile) {
    redirect("/signin");
  }

  return <Nav user={user} profile={profile as Profile} />;
}

export default SiteHeader;
