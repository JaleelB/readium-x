"use server";

import { updateProfile } from "@/data-access/profiles";
import { getUser } from "@/data-access/users";
import { authenticatedAction } from "@/lib/safe-action";
import { deleteUserUseCase, getUserProfileUseCase } from "@/use-cases/users";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getUserProfileAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      path: z.string(),
      userId: z.string(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const profile = await getUserProfileUseCase(ctx.user.id);
    revalidatePath(input.path);
    return profile;
  });

export const getUserAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.string() }))
  .handler(async ({ ctx }) => {
    const user = await getUser(ctx.user.id);
    return user;
  });

export const updateUserAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({ userId: z.string(), displayName: z.string(), path: z.string() }),
  )
  .handler(async ({ input, ctx }) => {
    const user = await updateProfile(ctx.user.id, {
      displayName: input.displayName,
    });
    revalidatePath(input.path);
    return user;
  });

export const deleteUserAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.string(), path: z.string() }))
  .handler(async ({ input, ctx }) => {
    await deleteUserUseCase({ id: ctx.user.id }, ctx.user.id);
    const client = await clerkClient();
    await client.users.deleteUser(ctx.user.id);
    revalidatePath(input.path);
  });
