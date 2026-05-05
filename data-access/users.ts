import { db } from "@/server/db/db";
import { User, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { UserId } from "@/use-cases/types";

export async function deleteUser(userId: UserId) {
  await db.delete(users).where(eq(users.id, userId));
}

export async function getUser(userId: UserId) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function upsertUser(user: Pick<User, "id"> & Partial<User>) {
  const [savedUser] = await db
    .insert(users)
    .values(user)
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: user.email ?? null,
      },
    })
    .returning();

  return savedUser;
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await db.update(users).set(updatedUser).where(eq(users.id, userId));
}
