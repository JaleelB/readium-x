import { db } from "@/server/db/db";
import { sessions } from "@/server/db/schema";
import { UserId } from "@/use-cases/types";
import { eq } from "drizzle-orm";

export async function deleteSessionForUser(userId: UserId) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
