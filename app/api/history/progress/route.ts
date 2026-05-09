import { getCurrentUser } from "@/lib/session";
import { getReadingHistoryProgressUseCase } from "@/use-cases/article";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const readingHistoryId = Number(searchParams.get("readingHistoryId"));
  if (!Number.isFinite(readingHistoryId)) {
    return Response.json(
      { error: "Missing readingHistoryId" },
      { status: 400 },
    );
  }

  const progress = await getReadingHistoryProgressUseCase(
    readingHistoryId,
    user.id,
  );

  return Response.json({ progress: progress ?? null });
}
