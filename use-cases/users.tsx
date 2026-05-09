import { deleteUser } from "@/data-access/users";
import { UserId, UserSession } from "@/use-cases/types";
import { AuthenticationError, NotFoundError } from "./errors";
import { getProfile } from "@/data-access/profiles";

export async function deleteUserUseCase(
  authenticatedUser: UserSession,
  userToDeleteId: UserId,
): Promise<void> {
  if (authenticatedUser.id !== userToDeleteId) {
    throw new AuthenticationError();
  }

  await deleteUser(userToDeleteId);
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new NotFoundError();
  }

  return profile;
}
