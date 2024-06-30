import { AspectRatio } from "./ui/aspect-ratio";
import { Avatar } from "./ui/avatar";

export function ArticleSkeleton() {
  return (
    <section className="container px-0 md:px-8 flex flex-col items-center gap-12">
      <div className="w-full max-w-4xl">
        <AspectRatio ratio={16 / 9} className="bg-muted w-full animate-pulse" />
      </div>
      <div className="container px-0 md:px-8 max-w-3xl flex flex-col gap-12">
        <div className="w-full flex justify-between">
          <div className="w-full flex gap-3">
            <Avatar className="w-11 h-11 bg-muted" />
            <div className="flex flex-col gap-3">
              <div className="font-medium bg-muted w-16 h-3 animate-pulse" />
              <div className="font-medium bg-muted w-32 h-3 animate-pulse" />
            </div>
          </div>
          <div className="rounded-full bg-muted text-muted px-5">Bookmark</div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
          <div className="font-medium bg-muted w-full h-3 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
