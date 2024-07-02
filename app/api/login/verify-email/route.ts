import { verifyEmailUseCase } from "@/use-cases/users";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/sign-in",
        },
      });
    }

    await verifyEmailUseCase(token);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/verify-success",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/sign-in",
      },
    });
  }
}
