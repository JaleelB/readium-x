"use client";

import { ArticleDetails } from "@/app/_actions/article";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { calculateReadTime, formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { ArticleViewer } from "./article-viewer";

export function Article({ content }: { content: ArticleDetails }) {
  return (
    <article className="w-full">
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

        <article className="container px-0 md:px-8 max-w-3xl flex flex-col gap-6">
          <div className="w-full flex justify-between">
            <div className="w-full flex gap-3">
              <Avatar className="w-11 h-11">
                <AvatarImage
                  src={
                    content?.authorInformation.authorImageURL ||
                    "https://github.com/shadcn.png"
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
            <Button variant="outline" className="rounded-full">
              Bookmark
              <Icons.bookmark className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl">
            {content?.title}
          </h1>
          {content?.content && <ArticleViewer content={content.content} />}
        </article>
      </section>
    </article>
  );
}
