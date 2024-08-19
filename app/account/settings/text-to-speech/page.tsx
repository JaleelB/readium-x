"use client";

import Balancer from "react-wrap-balancer";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipSlider } from "@/components/tooltip-slider";
import { Input } from "@/components/ui/input";
import {
  fetchFromLocalStorage,
  setLocalStorageItem,
  updateLocalStorageGroup,
} from "@/lib/utils";
import { useTTS } from "@/hooks/use-tts";
import { TTS } from "@/components/tts-button";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import { revalidatePath } from "next/cache";

type ApiOptions = "browser" & "openai";

export type VoiceOptions =
  | "Onyx"
  | "Alloy"
  | "Echo"
  | "Fable"
  | "Nova"
  | "Shimmer";

type ModelOptions = "tts-1" | "tts-1-hd";

type OpenAIOptions = {
  api: "openai";
  settings: {
    voice: VoiceOptions;
    model: ModelOptions;
    speed: number;
  };
};

type BrowserOptions = {
  api: "browser";
  settings: {
    voice: string;
    rate: number;
    pitch: number;
  };
};

export type TTSSettings = BrowserOptions | OpenAIOptions;

export default function TextToSpeechPage() {
  const { user } = useAuth();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [ttsSettings, setTTSSettings] = useState<TTSSettings>({
    api: "browser",
    settings: {
      voice: "Samantha",
      rate: 1,
      pitch: 1,
    },
  });
  const [testText, setTestText] = useState<string>(
    "Hello, this is the test audio for the text to speech assistant.",
  );

  const {
    voices,
    groupedVoices,
    setSelectedVoice,
    isLoading,
    updateRate,
    updatePitch,
  } = useTTS();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadSettings = () => {
      const storedSettings =
        fetchFromLocalStorage("readiumx-text-to-speech-settings") || {};
      const api = storedSettings.api || "browser";

      const defaultSettings = {
        browser: { voice: "Samantha", rate: 1, pitch: 1 },
        openai: { voice: "Alloy", model: "tts-1", speed: 1 },
      };

      const settings =
        storedSettings[api] ||
        defaultSettings[api as keyof typeof defaultSettings];

      const updatedSettings = {
        ...storedSettings,
        api,
        [api]: settings,
      };

      setLocalStorageItem(
        "readiumx-text-to-speech-settings",
        JSON.stringify(updatedSettings),
      );
      setTTSSettings({ api, settings });
    };

    loadSettings();
    setMounted(true);
  }, []);

  // Effect to update localStorage when settings change
  useEffect(() => {
    if (mounted) {
      const currentSettings =
        fetchFromLocalStorage("readiumx-text-to-speech-settings") || {};
      const updatedSettings = {
        ...currentSettings,
        api: ttsSettings.api,
        [ttsSettings.api]:
          ttsSettings.api === "browser"
            ? (ttsSettings.settings as BrowserOptions["settings"])
            : (ttsSettings.settings as OpenAIOptions["settings"]),
      };

      setLocalStorageItem(
        "readiumx-text-to-speech-settings",
        JSON.stringify(updatedSettings),
      );
    }
  }, [mounted, ttsSettings.api, ttsSettings.settings]);

  const handleApiChange = (value: ApiOptions) => {
    const storedSettings =
      fetchFromLocalStorage("readiumx-text-to-speech-settings") || {};

    const defaultSettings = {
      browser: { voice: "Samantha", rate: 1, pitch: 1 },
      openai: { voice: "Alloy", model: "tts-1", speed: 1 },
    };

    // Ensure settings exist for the selected API
    if (!storedSettings[value]) {
      storedSettings[value] = defaultSettings[value];
    }

    const updatedSettings = {
      ...storedSettings,
      api: value,
    };

    setLocalStorageItem(
      "readiumx-text-to-speech-settings",
      JSON.stringify(updatedSettings),
    );

    setTTSSettings({
      api: value,
      settings: storedSettings[value],
    });
  };

  if (!mounted) return <TextToSpeechSkeleton />;

  return (
    <div className="h-full w-full flex-1 pb-8">
      <main className="flex-1 space-y-12">
        <div className="flex flex-col space-y-2">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Text to speech
          </Balancer>
          <Balancer as="p" className="text-muted-foreground">
            Turn your text into speech. Selections are applied immediately and
            saved automatically.
          </Balancer>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-4">
            <div>
              <Balancer as="h2" className="mb-4 font-medium">
                Voice Settings
              </Balancer>
              <div className="mb-4 flex flex-col gap-4 border-b-[1px] pb-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col space-y-0.5">
                  <Label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="match-switch"
                  >
                    Speech API
                  </Label>
                  <Balancer as="p" className="text-sm text-muted-foreground">
                    Select the speech API to use.
                  </Balancer>
                </div>
                <Select
                  defaultValue={ttsSettings.api}
                  onValueChange={handleApiChange}
                >
                  <SelectTrigger className="w-full md:max-w-[300px]">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent className="z-[300]">
                    <SelectItem value="browser">
                      Browser (Web Speech API)
                    </SelectItem>
                    <SelectItem value="openai">
                      OpenAI Text to Speech
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {ttsSettings.api === "browser" && (
                <div className="flex flex-col space-y-6 py-4">
                  <div className="flex flex-col gap-1 border-b-[1px] pb-4">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-col space-y-0.5">
                        <Label
                          htmlFor="browser-voice-select"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Voice
                        </Label>
                        <Balancer
                          as="p"
                          className="text-sm text-muted-foreground"
                        >
                          Select a voice for your text to speech.
                        </Balancer>
                      </div>
                      {/* <LanguageDropdown /> */}
                      <div id="browser-voice-select">
                        <Select
                          defaultValue={ttsSettings.settings.voice}
                          // value={selectedVoice?.name}
                          onValueChange={(value) => {
                            const newVoice = voices.find(
                              (v) => v.name === value,
                            );
                            if (newVoice) {
                              setSelectedVoice(newVoice);
                              updateLocalStorageGroup(
                                "text-to-speech-settings",
                                "browser",
                                "voice",
                                newVoice.name,
                              );
                              setTTSSettings({
                                ...ttsSettings,
                                settings: {
                                  ...ttsSettings.settings,
                                  voice: newVoice.name,
                                },
                              });
                              revalidatePath(pathname);
                            }
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-full md:w-[300px]">
                            <SelectValue
                              placeholder="Select a voice"
                              className="pr-2"
                            />
                          </SelectTrigger>
                          <SelectContent className="z-[300] max-h-[300px] overflow-y-auto">
                            {isLoading ? (
                              <SelectItem value="loading">
                                Loading voices...
                              </SelectItem>
                            ) : (
                              Object.entries(groupedVoices).map(
                                ([group, groupVoices]) => (
                                  <SelectGroup key={group}>
                                    <SelectLabel className="capitalize underline underline-offset-2">
                                      {group}
                                    </SelectLabel>
                                    {groupVoices.map((voice) => (
                                      <SelectItem
                                        key={voice.name}
                                        value={voice.name}
                                      >
                                        {voice.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                ),
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Balancer as="p" className="text-xs">
                      Note: some voices have different character limits.
                    </Balancer>
                  </div>
                  <div className="flex flex-row items-center justify-between border-b-[1px] pb-4">
                    <div className="flex flex-col space-y-0.5">
                      <Label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="browser-rate-slider"
                      >
                        Rate
                      </Label>
                      <Balancer
                        as="p"
                        className="text-sm text-muted-foreground"
                      >
                        Select the rate of speech to use.
                      </Balancer>
                    </div>
                    <div className="flex w-full max-w-[300px] gap-2">
                      <span className="text-xs text-muted-foreground">
                        <span className="font-medium">0</span>
                      </span>
                      <TooltipSlider
                        id="browser-rate-slider"
                        defaultValue={[ttsSettings.settings.rate]}
                        max={2}
                        step={0.1}
                        className="w-full"
                        onValueChange={(value: number[]) => {
                          updateRate(value[0]);
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        <span className="font-medium">2</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between border-b-[1px] pb-4">
                    <div className="flex flex-col space-y-0.5">
                      <Label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="browser-pitch-slider"
                      >
                        Pitch
                      </Label>
                      <Balancer
                        as="p"
                        className="text-sm text-muted-foreground"
                      >
                        Select the pitch of the voice.
                      </Balancer>
                    </div>
                    <div className="flex w-full max-w-[300px] gap-2">
                      <span className="text-xs text-muted-foreground">
                        <span className="font-medium">0</span>
                      </span>
                      <TooltipSlider
                        id="browser-pitch-slider"
                        defaultValue={[ttsSettings.settings.pitch]}
                        max={2}
                        step={0.1}
                        className="w-full"
                        onValueChange={(value: number[]) => {
                          updatePitch(value[0]);
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        <span className="font-medium">2</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {ttsSettings.api === "openai" && (
                <div className="flex flex-col space-y-6 border-b-[1px] py-4 pb-8">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                      <div className="flex flex-col space-y-0.5">
                        <Label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="openai-voice-select"
                        >
                          Voice
                        </Label>
                        <Balancer
                          as="p"
                          className="text-sm text-muted-foreground"
                        >
                          Select a voice for your text to speech.
                        </Balancer>
                      </div>
                      <div id="openai-voice-select">
                        <Select
                          defaultValue={ttsSettings.settings.voice.toUpperCase()}
                          onValueChange={(value) => {
                            setTTSSettings({
                              ...ttsSettings,
                              settings: {
                                ...ttsSettings.settings,
                                voice: value.toLowerCase() as
                                  | "Onyx"
                                  | "Alloy"
                                  | "Echo"
                                  | "Fable"
                                  | "Nova"
                                  | "Shimmer",
                              },
                            });
                          }}
                        >
                          <SelectTrigger className="w-full md:w-[300px]">
                            <SelectValue placeholder="Select a voice" />
                          </SelectTrigger>
                          <SelectContent className="z-[300]">
                            {[
                              "ONYX",
                              "ALLOY",
                              "ECHO",
                              "FABLE",
                              "NOVA",
                              "SHIMMER",
                            ].map((voice) => (
                              <SelectItem
                                key={voice}
                                value={voice}
                                className="capitalize"
                              >
                                {voice}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-3 md:flex-row md:justify-between">
                      <div className="flex flex-col space-y-0.5">
                        <Label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="openai-model-select"
                        >
                          Model
                        </Label>
                        <Balancer
                          as="p"
                          className="text-sm text-muted-foreground"
                        >
                          Select a model for your text to speech.
                        </Balancer>
                      </div>
                      <div id="openai-model-select">
                        <Select
                          defaultValue={ttsSettings.settings.model}
                          onValueChange={(value) => {
                            setTTSSettings({
                              ...ttsSettings,
                              settings: {
                                ...ttsSettings.settings,
                                model: value as "tts-1" | "tts-1-hd",
                              },
                            });
                          }}
                        >
                          <SelectTrigger className="w-full md:w-[300px]">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                          <SelectContent className="z-[300]">
                            {["tts-1", "tts-1-hd"].map((model) => (
                              <SelectItem
                                key={model}
                                value={model}
                                className="uppercase"
                              >
                                {model === "tts-1" ? "TTS-1" : "TTS-1-HD"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col space-y-0.5">
                      <Label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="openai-speed-slider"
                      >
                        Speed
                      </Label>
                      <Balancer
                        as="p"
                        className="text-sm text-muted-foreground"
                      >
                        Select the speed of the voice.
                      </Balancer>
                    </div>
                    <div className="flex w-full gap-2 md:max-w-[300px]">
                      <span className="text-xs text-muted-foreground">
                        <span className="font-medium">0</span>
                      </span>
                      <TooltipSlider
                        id="openai-speed-slider"
                        defaultValue={[ttsSettings.settings.speed]}
                        max={2}
                        step={0.1}
                        className="w-full"
                        onValueChange={(value: number[]) => {
                          if (typeof value[0] === "number") {
                            updateLocalStorageGroup(
                              "text-to-speech-settings",
                              "openai",
                              "speed",
                              value[0].toString(),
                            );
                            setTTSSettings((prev) => {
                              if (prev.api === "openai") {
                                return {
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    speed: value[0],
                                  },
                                };
                              }
                              return prev;
                            });
                          }
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        <span className="font-medium">2</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-3">
              <Balancer as="h2" className="mb-4 font-medium">
                Playback Settings
              </Balancer>
              <div className="mb-4 flex flex-col items-start gap-4 border-b-[1px] pb-8">
                <div className="flex flex-col space-y-0.5">
                  <Label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="test-audio-input"
                  >
                    Test audio
                  </Label>
                  <Balancer as="p" className="text-sm text-muted-foreground">
                    Enter text to test the text to speech settings.
                  </Balancer>
                </div>
                <Input
                  id="test-audio-input"
                  type="text"
                  placeholder="Enter text to test"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                />
                {/* <Button
                  className="rounded-lg"
                  onClick={() => playAudio(testText)}
                >
                  Play Test Audio
                </Button> */}
                <TTS text={testText} userId={user?.id} useIcon={false} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TextToSpeechSkeleton() {
  return (
    <div className="h-full w-full flex-1 pb-8">
      <main className="flex-1 space-y-12">
        <div className="flex flex-col space-y-2">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Text to speech
          </Balancer>
          <Balancer as="p" className="text-muted-foreground">
            Turn your text into speech. Selections are applied immediately and
            saved automatically.
          </Balancer>
        </div>
        <div className="flex h-[450px] flex-col space-y-4 rounded-lg bg-muted p-6" />
      </main>
    </div>
  );
}
