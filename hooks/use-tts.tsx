"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { WebTextToSpeechService as WebSpeechTextToSpeechService } from "../lib/tts";
import { toast } from "sonner";
import { fetchFromLocalStorage, updateLocalStorageGroup } from "@/lib/utils";

export const useTTS = () => {
  const [tts, setTts] = useState<WebSpeechTextToSpeechService | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [groupedVoices, setGroupedVoices] = useState<
    Record<string, SpeechSynthesisVoice[]>
  >({});
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentTextRef = useRef<string | null>(null);
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    const ttsService = new WebSpeechTextToSpeechService();
    setTts(ttsService);
    setSpeechSynthesis(window.speechSynthesis);

    const loadVoices = async () => {
      setIsLoading(true);
      const availableVoices = await ttsService.getVoices();
      const groupedAvailableVoices = await ttsService.getGroupedVoices();
      setVoices(availableVoices);
      setGroupedVoices(groupedAvailableVoices);

      // Load saved settings from localStorage
      const savedSettings = fetchFromLocalStorage(
        "readiumx-text-to-speech-settings",
      );
      const savedVoiceName = savedSettings?.browser?.voice;
      const savedRate = savedSettings?.browser?.rate;
      const savedPitch = savedSettings?.browser?.pitch;

      if (savedVoiceName) {
        const savedVoice = availableVoices.find(
          (voice) => voice.name === savedVoiceName,
        );
        setSelectedVoice(savedVoice || availableVoices[0]);
      } else {
        setSelectedVoice(availableVoices[0]);
      }

      if (savedRate) setRate(Number(savedRate));
      if (savedPitch) setPitch(Number(savedPitch));

      setIsLoading(false);
    };

    loadVoices();

    const currentAudioContext = audioContextRef.current;

    return () => {
      if (currentAudioContext) {
        currentAudioContext.close();
      }
    };
  }, []);

  const playAudio = useCallback(
    (articleText: string) => {
      if (tts && selectedVoice && speechSynthesis) {
        try {
          speechSynthesis.cancel(); // Cancel any ongoing speech
          const utterance = new SpeechSynthesisUtterance(articleText);
          utterance.voice = selectedVoice;
          utterance.rate = rate;
          utterance.pitch = pitch;
          speechSynthesis.speak(utterance);
          setIsPlaying(true);
          setIsPaused(false);
          currentTextRef.current = articleText;
        } catch (error) {
          toast.error("An error occurred while reading the article");
          setIsPlaying(false);
          setIsPaused(false);
        }
      }
    },
    [tts, selectedVoice, rate, pitch, speechSynthesis],
  );

  const pauseAudio = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [speechSynthesis]);

  const resumeAudio = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [speechSynthesis]);

  const stopAudio = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      currentTextRef.current = null;
    }
  }, [speechSynthesis]);

  const togglePlayPause = useCallback(
    (articleText: string) => {
      if (!isPlaying) {
        playAudio(articleText);
      } else if (isPaused) {
        resumeAudio();
      } else {
        pauseAudio();
      }
    },
    [isPlaying, isPaused, playAudio, resumeAudio, pauseAudio],
  );

  const updateRate = useCallback((newRate: number) => {
    setRate(newRate);
    updateLocalStorageGroup(
      "text-to-speech-settings",
      "browser",
      "rate",
      newRate.toString(),
    );
  }, []);

  const updatePitch = useCallback((newPitch: number) => {
    setPitch(newPitch);
    updateLocalStorageGroup(
      "text-to-speech-settings",
      "browser",
      "pitch",
      newPitch.toString(),
    );
  }, []);

  return {
    tts,
    voices,
    groupedVoices,
    selectedVoice,
    setSelectedVoice,
    isLoading,
    isPlaying,
    isPaused,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    togglePlayPause,
    rate,
    pitch,
    updateRate,
    updatePitch,
  };
};
