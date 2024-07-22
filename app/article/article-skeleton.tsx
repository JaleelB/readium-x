import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar } from "@/components/ui/avatar";

export function ArticleSkeleton() {
  return (
    <section className="container flex flex-col items-center gap-12 px-0 md:px-8">
      <div className="w-full max-w-4xl">
        <AspectRatio ratio={16 / 9} className="w-full animate-pulse bg-muted" />
      </div>
      <div className="container flex max-w-3xl flex-col gap-12 px-0 md:px-8">
        <div className="flex w-full justify-between">
          <div className="flex w-full gap-3">
            <Avatar className="h-11 w-11 bg-muted" />
            <div className="flex flex-col gap-3">
              <div className="h-3 w-16 animate-pulse bg-muted font-medium" />
              <div className="h-3 w-32 animate-pulse bg-muted font-medium" />
            </div>
          </div>
          <div className="rounded-full bg-muted px-5 text-muted">Bookmark</div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
          <div className="h-3 w-full animate-pulse bg-muted font-medium" />
        </div>
      </div>
    </section>
  );
}
