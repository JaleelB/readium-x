"use client";

import { Button } from "@/components/ui/button";
import { useTTS } from "@/hooks/use-tts";
import { Icons } from "./icons";

export const ReadArticleButton = ({ articleText }: { articleText: string }) => {
  const { isPlaying, togglePlayPause, isPaused } = useTTS();

  return (
    <Button
      onClick={() => togglePlayPause(articleText)}
      variant="outline"
      size="icon"
      className="h-10 w-10 rounded-full"
    >
      {isPlaying ? (
        isPaused ? (
          <Icons.play className="h-5 w-5" />
        ) : (
          <Icons.pause className="h-5 w-5" />
        )
      ) : (
        <Icons.play className="h-5 w-5" />
      )}
    </Button>
  );
};
