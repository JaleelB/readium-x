"use client";

import { Button } from "@/components/ui/button";
import { useTTS } from "@/hooks/use-tts";
import { Icons } from "./icons";
import { useRef } from "react";
import { useServerAction } from "zsa-react";
import { convertTextToSpeechAction } from "@/app/account/settings/tokens/actions";
import { toast } from "sonner";

export const TTS = ({
  text,
  userId,
  useIcon,
}: {
  text: string;
  userId?: number;
  useIcon?: boolean;
}) => {
  const { isPlaying, togglePlayPause, isPaused } = useTTS();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { execute, isPending } = useServerAction(convertTextToSpeechAction, {
    onSuccess: ({ data }) => {
      // Create a Blob from the base64 string
      const byteCharacters = atob(data.audioBuffer);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mp3" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Set the audio source and play
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    },
    onError: ({ err }) => {
      console.error("TTS Error:", err);
      toast.error(
        err.message || "An error occurred while processing your request",
      );
    },
  });

  const handleClick = async () => {
    const storedSettings = JSON.parse(
      localStorage.getItem("readiumx-text-to-speech-settings") || "{}",
    );
    const api = storedSettings.api || "browser";
    const settings = storedSettings[api] || {
      voice: "",
      rate: 0,
      pitch: 0,
    };

    console.log("Current TTS Settings:", { api, settings });

    if (api === "openai") {
      if (isPlaying) {
        togglePlayPause(text);
      } else {
        if (!userId || userId === undefined) {
          toast.error("User ID is required");
          return;
        }

        execute({
          userId: userId,
          text: text,
          model: (settings.model || "tts-1").toLowerCase(),
          voice: (settings.voice || "alloy").toLowerCase(),
          speed: parseFloat(settings.speed) || 1,
        });
      }
    } else {
      togglePlayPause(text);
    }
  };

  const renderButtonContent = () => {
    if (useIcon) {
      if (isPlaying) {
        return isPaused ? (
          <Icons.play className="h-4 w-4" />
        ) : (
          <Icons.pause className="h-4 w-4" />
        );
      } else if (isPending) {
        return <Icons.spinner className="h-4 w-4 animate-spin" />;
      } else {
        return <Icons.play className="h-4 w-4" />;
      }
    } else {
      if (isPlaying) {
        return isPaused ? (
          <div className="flex items-center justify-center gap-1">
            <Icons.play className="h-4 w-4" />
            <span>Resume Audio</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <Icons.pause className="h-4 w-4" />
            <span>Pause Audio</span>
          </div>
        );
      } else if (isPending) {
        return (
          <div className="flex items-center justify-center gap-1">
            <Icons.spinner className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center justify-center gap-1">
            <Icons.play className="h-4 w-4" />
            <span>Play Audio</span>
          </div>
        );
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} style={{ display: "none" }} />
      <Button
        onClick={async () => await handleClick()}
        variant={useIcon ? "outline" : "default"}
        size={useIcon ? "icon" : "default"}
        className={
          useIcon
            ? "h-10 w-10 rounded-full"
            : "rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        }
        disabled={isPending}
      >
        {renderButtonContent()}
      </Button>
    </>
  );
};
