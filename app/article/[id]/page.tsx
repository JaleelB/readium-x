import { getUrlWithoutPaywall } from "@/app/_actions/url";
import UrlForm from "@/components/url-form";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ArticleWrapper } from "@/components/article-wrapper";

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

  const urlWithoutPaywall = await getUrlWithoutPaywall(url);
  if (urlWithoutPaywall instanceof Error) {
    notFound();
  }

  return (
    <main className="container py-[22vh] pt-6 flex flex-col gap-12 items-center justify-center">
      <UrlForm inputValue={url as string} />
      <ArticleWrapper url={urlWithoutPaywall} />
    </main>
  );
}
