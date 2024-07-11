"use client";

import { ArticleDetails } from "@/app/article/actions/article";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { calculateReadTime, formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { ArticleViewer } from "./article-viewer";
import DOMPurify from "dompurify";
import Balancer from "react-wrap-balancer";
import { createBookmarkAction } from "@/app/bookmarks/bookmark";
import { generateRandomName } from "@/lib/names";
import { useToast } from "./ui/use-toast";
import { usePathname } from "next/navigation";
import useReadingProgress from "@/hooks/use-reading-progress";

export function Article({
  content,
  user,
}: {
  content: ArticleDetails;
  user: {
    email: string | null;
    id: number;
    emailVerified: Date | null;
  };
}) {
  const safeHTMLContent = DOMPurify.sanitize(content?.content || "", {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: [
      "class",
      "style",
      "src",
      "alt",
      "title",
      "href",
      "target",
      "rel",
      "data-src",
      "data-href",
      "data-title",
      "data-alt",
      "data-target",
      "status",
      "data-status",
      "previewListener",
      "data-previewListener",
      "data-embed",
      "data-embed-type",
      "data-embed-id",
      "data-embed-url",
      "data-embed-provider",
      "data-embed-thumbnail",
      "data-embed-title",
      "data-bg",
      "data-ll-status",
    ],
  });

  const { toast } = useToast();
  const pathname = usePathname();
  const { progress, articleRef } = useReadingProgress();

  return (
    <article className="w-full">
      <div
        style={{ width: `${progress}%` }}
        className="fixed top-0 left-0 h-1 bg-primary z-[1000]"
      />
      <section className="container px-0 md:px-8 flex flex-col items-center gap-12">
        <div className="w-full max-w-4xl">
          <AspectRatio ratio={16 / 9} className="w-full bg-muted">
            <Image
              src={
                content?.articleImageSrc
                  ? content?.articleImageSrc
                  : "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd"
              }
              alt="Photo for the article"
              fill
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>

        <article
          ref={articleRef}
          className="container px-0 md:px-8 max-w-3xl flex flex-col gap-6"
        >
          <div className="w-full flex justify-between">
            <div className="w-full flex gap-3">
              <Avatar className="w-11 h-11">
                <AvatarImage
                  src={
                    content?.authorInformation.authorImageURL ||
                    "https://illustrations.popsy.co/white/genius.svg"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link
                  href={
                    (content?.authorInformation.authorProfileURL as string) ||
                    "#"
                  }
                  className="font-medium"
                >
                  {content?.authorInformation?.authorName}
                </Link>
                <div className="text-muted-foreground text-sm">
                  {content?.publicationInformation?.readTime?.slice(1) ||
                    calculateReadTime(content?.content)}
                  {content?.publicationInformation?.publishDate && (
                    <span className="px-2">·</span>
                  )}
                  {content?.publicationInformation?.publishDate &&
                    formatDate(content?.publicationInformation?.publishDate)}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={async () => {
                const [data, err] = await createBookmarkAction({
                  path: pathname,
                  userId: user.id,
                  title: content?.title || generateRandomName(),
                  content: safeHTMLContent,
                  articleImageSrc: content?.articleImageSrc || "",
                  authorName: content?.authorInformation.authorName || "",
                  authorImageURL:
                    content?.authorInformation.authorImageURL || "",
                  authorProfileURL:
                    content?.authorInformation.authorProfileURL || "",
                  publicationName:
                    content?.publicationInformation.publicationName || "",
                  readTime:
                    content?.publicationInformation.readTime ||
                    calculateReadTime(content?.content),
                  publishDate:
                    content?.publicationInformation.publishDate || "",
                });

                if (err) {
                  toast({
                    title: "Failed to bookmark article",
                    description: "Please try again later",
                    variant: "destructive",
                  });
                  return;
                }

                toast({
                  title: "Article bookmarked",
                  description: "You can view it in your bookmarks",
                });
              }}
            >
              <Icons.bookmark className={`w-5 h-5 `} onLoad={async () => {}} />
            </Button>
          </div>
          <Balancer
            as="h1"
            className="font-heading text-2xl md:text-3xl lg:text-4xl"
          >
            {content?.title}
          </Balancer>
          {safeHTMLContent && <ArticleViewer content={safeHTMLContent} />}
        </article>
      </section>
    </article>
  );
}
