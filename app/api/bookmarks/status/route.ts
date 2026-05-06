import { getCurrentUser } from "@/lib/session";
import { getBookmarksUseCase } from "@/use-cases/bookmarks";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const articleUrl = searchParams.get("articleUrl");
  if (!articleUrl) {
    return Response.json({ error: "Missing articleUrl" }, { status: 400 });
  }

  const bookmarks = await getBookmarksUseCase(user.id);
  const bookmark = bookmarks.find((item) => item.articleUrl === articleUrl);

  return Response.json({
    isBookmarked: Boolean(bookmark),
    bookmarkId: bookmark?.id ?? null,
  });
}
