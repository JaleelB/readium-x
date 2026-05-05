import { useUser } from "@clerk/nextjs";

export function useAuth() {
  const { isLoaded, isSignedIn, user } = useUser();

  return {
    isSignedIn: isSignedIn ?? false,
    isLoaded,
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? null,
        }
      : null,
    sessionId: null,
  };
}
