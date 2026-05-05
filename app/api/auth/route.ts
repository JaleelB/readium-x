import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const { isAuthenticated, sessionId, userId } = await auth();

  if (isAuthenticated && userId) {
    const user = await currentUser();

    return Response.json({
      isSignedIn: true,
      user: {
        id: userId,
        email: user?.primaryEmailAddress?.emailAddress ?? null,
      },
      sessionId,
    });
  }

  return Response.json({
    isSignedIn: false,
    user: null,
    sessionId: null,
  });
}
