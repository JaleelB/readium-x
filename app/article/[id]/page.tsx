import UrlForm from "@/components/url-form";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import { ArticleWrapper } from "../article-wrapper";

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  if (!params.id) {
    redirect("/");
  }

  const articleId = params.id;
  const cookieStore = cookies();

  const url = cookieStore.get(articleId)?.value;

  if (!url) {
    redirect("/");
  }

  const userSession = await getCurrentUser();
  let user = true;

  if (!userSession) {
    user = false;
    redirect("/signin");
  }

  return (
    <main className="container mt-12 flex flex-col items-center justify-center gap-12 py-[22vh] pt-6">
      <UrlForm inputValue={url as string} isUser={user} />
      <ArticleWrapper url={url} />
    </main>
  );
}
