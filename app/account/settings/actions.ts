"use server";

import { updateProfile } from "@/data-access/profiles";
import { getUser } from "@/data-access/users";
import { authenticatedAction } from "@/lib/safe-action";
import { deleteUserUseCase, getUserProfileUseCase } from "@/use-cases/users";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getUserProfileAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      path: z.string(),
      userId: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const profile = await getUserProfileUseCase(input.userId);
    revalidatePath(input.path);
    return profile;
  });

export const getUserAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number() }))
  .handler(async ({ input }) => {
    const user = await getUser(input.userId);
    return user;
  });

export const updateUserAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({ userId: z.number(), displayName: z.string(), path: z.string() }),
  )
  .handler(async ({ input }) => {
    const user = await updateProfile(input.userId, {
      displayName: input.displayName,
    });
    revalidatePath(input.path);
    return user;
  });

export const deleteUserAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number(), path: z.string() }))
  .handler(async ({ input }) => {
    await deleteUserUseCase({ id: input.userId }, input.userId);
    revalidatePath(input.path);
  });
