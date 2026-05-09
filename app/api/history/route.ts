import { getCurrentUser } from "@/lib/session";
import { getReadingHistoryUseCase } from "@/use-cases/article";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await getReadingHistoryUseCase(user.id);
  return Response.json(history);
}
