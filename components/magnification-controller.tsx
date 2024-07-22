import { Icons } from "./icons";
import { Button } from "./ui/button";

export function MagnificationController({
  zoom,
  zoomIn,
  zoomOut,
  resetZoom,
}: {
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-6 flex h-12 items-center justify-between gap-2 rounded-md border bg-background shadow-sm">
      <Button
        onClick={zoomOut}
        variant="ghost"
        size="icon"
        className="h-full text-xl hover:bg-transparent"
      >
        <Icons.zoomOut className="h-5 w-5" />
        <span className="sr-only">Zoom out</span>
      </Button>
      <span className="rounded-md bg-muted px-2 py-1 text-sm font-medium">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        onClick={zoomIn}
        variant="ghost"
        size="icon"
        className="h-full text-xl hover:bg-transparent"
      >
        <Icons.zoomIn className="h-5 w-5" />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button
        onClick={resetZoom}
        variant="ghost"
        size="icon"
        className="h-full text-xl hover:bg-transparent"
      >
        <Icons.retry className="h-5 w-5" />
        <span className="sr-only">Reset zoom</span>
      </Button>
    </div>
  );
}
