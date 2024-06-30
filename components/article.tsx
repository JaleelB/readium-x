import { ArticleDetails } from "@/app/_actions/article";

export function Article({ content }: { content: ArticleDetails }) {
  return (
    <section className="flex flex-col items-center justify-center">
      {JSON.stringify(content, null, 2)}
    </section>
  );
}
