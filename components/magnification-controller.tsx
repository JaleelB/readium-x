import { Icons } from "./icons";
import { Button } from "./ui/button";

export function MagnificationController({
  zoom,
  zoomIn,
  zoomOut,
}: {
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
}) {
  return (
    <div className="fixed left-6 bottom-6 bg-background shadow-sm flex gap-2 items-center justify-between h-12 border rounded-md">
      <Button
        onClick={zoomOut}
        variant="ghost"
        size="icon"
        className="text-xl h-full hover:bg-transparent"
      >
        <Icons.zoomOut className="w-5 h-5" />
        <span className="sr-only">Zoom out</span>
      </Button>
      <span className="text-sm px-2 py-1 font-medium bg-muted rounded-md">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        onClick={zoomIn}
        variant="ghost"
        size="icon"
        className="text-xl hover:bg-transparent h-full"
      >
        <Icons.zoomIn className="w-5 h-5" />
        <span className="sr-only">Zoom in</span>
      </Button>
    </div>
  );
}
