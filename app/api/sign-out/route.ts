import { lucia, validateRequest } from "@/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(): Promise<Response> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { session } = await validateRequest();
  if (!session) {
    redirect("/signin");
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect("/signin");
}
