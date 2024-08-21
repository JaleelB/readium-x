"use client";

import { Button } from "@/components/ui/button";
import { useTTS } from "@/hooks/use-tts";
import { Icons } from "./icons";
import { useEffect, useRef, useState } from "react";
import { useServerAction } from "zsa-react";
import { convertTextToSpeechAction } from "@/app/account/settings/tokens/actions";
import { toast } from "sonner";
import { TTSSettings } from "@/app/account/settings/text-to-speech/page";

const useTTSSettings = () => {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(
        localStorage.getItem("readiumx-text-to-speech-settings") ||
          `{"api":"browser","settings":{"voice":"Samantha","rate":1,"pitch":1}}`,
      );
    }
    return {
      api: "browser",
      settings: { voice: "Samantha", rate: 1, pitch: 1 },
    };
  });

  useEffect(() => {
    const handleStorageChange = (event: CustomEvent<TTSSettings>) => {
      const settings = event.detail;
      const api = settings.api;
      const apiSettings = settings[api as keyof TTSSettings];
      const newSettings = {
        api,
        settings: apiSettings,
      };

      setSettings(newSettings);
    };

    window.addEventListener(
      "ttsSettingsChanged",
      handleStorageChange as EventListener,
    );
    return () =>
      window.removeEventListener(
        "ttsSettingsChanged",
        handleStorageChange as EventListener,
      );
  }, []);

  return settings;
};

export const TTS = ({
  text,
  userId,
  useIcon,
}: {
  text: string;
  userId?: number;
  useIcon?: boolean;
}) => {
  const {
    isPlaying: isWebTTSPlaying,
    togglePlayPause: toggleWebTTS,
    isPaused: isWebTTSPaused,
    isCompleted: isWebTTSCompleted,
  } = useTTS();
  const [isOpenAIPlaying, setIsOpenAIPlaying] = useState(false);
  const [isOpenAIPaused, setIsOpenAIPaused] = useState(false);
  const [isOpenAICompleted, setIsOpenAICompleted] = useState(false);
  const ttsSettings = useTTSSettings();
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
        setIsOpenAIPlaying(true);
        setIsOpenAIPaused(false);
        setIsOpenAICompleted(false);
      }
    },
    onError: ({ err }) => {
      console.error("TTS Error:", err);
      toast.error(
        err.message || "An error occurred while processing your request",
      );
    },
  });

  const toggleOpenAIPlayPause = () => {
    if (audioRef.current) {
      if (isOpenAIPlaying) {
        if (isOpenAIPaused) {
          audioRef.current.play();
          setIsOpenAIPaused(false);
        } else {
          audioRef.current.pause();
          setIsOpenAIPaused(true);
        }
      } else {
        if (isOpenAICompleted) {
          setIsOpenAICompleted(false);
          audioRef.current.currentTime = 0;
        }
        if (!userId) {
          toast.error("User ID is required");
          return;
        }

        execute({
          userId: userId,
          text: text,
          model:
            ttsSettings.settings &&
            ttsSettings.api === "openai" &&
            "model" in ttsSettings.settings
              ? (ttsSettings.settings.model || "tts-1").toLowerCase()
              : "tts-1",
          voice:
            ttsSettings.settings &&
            ttsSettings.api === "openai" &&
            "voice" in ttsSettings.settings
              ? (ttsSettings.settings.voice || "alloy").toLowerCase()
              : "alloy",
          speed:
            ttsSettings.settings &&
            ttsSettings.api === "openai" &&
            "speed" in ttsSettings.settings
              ? Number(ttsSettings.settings.speed) || 1
              : 1,
        });
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onended = () => {
        setIsOpenAIPlaying(false);
        setIsOpenAIPaused(false);
        setIsOpenAICompleted(true);
      };
    }
    return () => {
      if (audio) {
        audio.onended = null;
      }
    };
  }, []);

  const renderOpenAIButtonContent = () => {
    if (useIcon) {
      if (isOpenAIPlaying) {
        return isOpenAIPaused ? (
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
      if (isOpenAIPlaying) {
        return isOpenAIPaused ? (
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
            <span>{isOpenAICompleted ? "Play Again" : "Play Audio"}</span>
          </div>
        );
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} style={{ display: "none" }} />
      {/* button for browser tts */}
      {ttsSettings.api === "browser" && (
        <Button
          onClick={() => toggleWebTTS(text)}
          variant={useIcon ? "outline" : "default"}
          size={useIcon ? "icon" : "default"}
          className={
            useIcon
              ? "h-10 w-10 rounded-full"
              : "rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          }
        >
          {useIcon ? (
            isWebTTSPlaying ? (
              isWebTTSPaused ? (
                <Icons.play className="h-4 w-4" />
              ) : (
                <Icons.pause className="h-4 w-4" />
              )
            ) : (
              <Icons.play className="h-4 w-4" />
            )
          ) : isWebTTSPlaying ? (
            isWebTTSPaused ? (
              <div className="flex items-center justify-center gap-1">
                <Icons.play className="h-4 w-4" />
                <span>Resume Audio</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <Icons.pause className="h-4 w-4" />
                <span>Pause Audio</span>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center gap-1">
              <Icons.play className="h-4 w-4" />
              <span>Play Audio</span>
            </div>
          )}
        </Button>
      )}
      {ttsSettings.api === "openai" && (
        <Button
          onClick={toggleOpenAIPlayPause}
          variant={useIcon ? "outline" : "default"}
          size={useIcon ? "icon" : "default"}
          className={
            useIcon
              ? "h-10 w-10 rounded-full"
              : "rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          }
          disabled={isPending}
        >
          {renderOpenAIButtonContent()}
        </Button>
      )}
    </>
  );
};
