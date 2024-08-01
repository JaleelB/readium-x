import { validateRequest } from "@/server/auth";

export async function GET() {
  const { session, user } = await validateRequest();

  if (user && session) {
    return Response.json({
      isSignedIn: true,
      user: user,
      sessionId: session.id,
    });
  }

  return Response.json({
    isSignedIn: false,
    user: null,
    sessionId: null,
  });
}
