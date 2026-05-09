import { getCurrentUser } from "@/lib/session";
import { getBookmarksUseCase } from "@/use-cases/bookmarks";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await getBookmarksUseCase(user.id);
  return Response.json(bookmarks);
}
