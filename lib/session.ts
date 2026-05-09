import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { createProfile, getProfile } from "@/data-access/profiles";
import { getUser, upsertUser } from "@/data-access/users";
import { generateRandomName } from "@/lib/names";
import { AuthenticationError } from "../use-cases/errors";

function getDisplayName(user: Awaited<ReturnType<typeof currentUser>>) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return fullName || user?.username || generateRandomName();
}

export const ensureAppUser = cache(async () => {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) {
    return undefined;
  }

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress ??
    null;

  const user = await upsertUser({ id: userId, email });
  const profile = await getProfile(userId);

  if (!profile) {
    await createProfile(userId, getDisplayName(clerkUser), clerkUser?.imageUrl);
  }

  return user;
});

export const getCurrentUser = cache(async () => {
  const appUser = await ensureAppUser();
  if (!appUser) {
    return undefined;
  }

  return (await getUser(appUser.id)) ?? appUser;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};
