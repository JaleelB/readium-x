export type LanguageGroup = {
  [key: string]: string[];
};

export const languageGroups: LanguageGroup = {
  English: ["en", "en-US", "en-GB", "en-AU"],
  Spanish: ["es", "es-ES", "es-MX"],
  French: ["fr", "fr-FR", "fr-CA"],
  German: ["de", "de-DE"],
  Italian: ["it", "it-IT"],
  Japanese: ["ja", "ja-JP"],
  Korean: ["ko", "ko-KR"],
  Chinese: ["zh", "zh-CN", "zh-TW"],
  Other: [],
};

export function getLanguageGroupForVoice(voice: SpeechSynthesisVoice): string {
  const lang = voice.lang.split("-")[0];
  for (const [group, langs] of Object.entries(languageGroups)) {
    if (langs.includes(lang) || langs.includes(voice.lang)) {
      return group;
    }
  }
  return "Other";
}

export function groupVoicesByLanguage(
  voices: SpeechSynthesisVoice[],
): Record<string, SpeechSynthesisVoice[]> {
  const grouped: Record<string, SpeechSynthesisVoice[]> = {};
  voices.forEach((voice) => {
    const group = getLanguageGroupForVoice(voice);
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(voice);
  });
  return grouped;
}

export class WebTextToSpeechService {
  private synthesis: SpeechSynthesis | undefined;
  private voices: SpeechSynthesisVoice[] | undefined;
  private groupedVoices: Record<string, SpeechSynthesisVoice[]> | undefined;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis;
      this.voices = [];
      this.loadVoices();
    }
  }

  private loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const loadVoicesCallback = () => {
        this.voices = this.synthesis?.getVoices() ?? [];
        this.groupedVoices = groupVoicesByLanguage(this.voices);
        resolve(this.voices);
      };

      if (
        this.synthesis !== undefined &&
        this.synthesis.onvoiceschanged !== undefined
      ) {
        this.synthesis.onvoiceschanged = loadVoicesCallback;
      }

      // Try to load voices immediately
      const voices = this.synthesis?.getVoices() ?? [];
      if (voices.length > 0) {
        loadVoicesCallback();
      }
    });
  }

  public async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.voices || this.voices.length === 0) {
      await this.loadVoices();
    }
    return this.voices ?? [];
  }

  public async getGroupedVoices(): Promise<
    Record<string, SpeechSynthesisVoice[]>
  > {
    if (!this.groupedVoices) {
      await this.loadVoices();
    }
    return this.groupedVoices ?? {};
  }

  public speak(
    text: string,
    voice: SpeechSynthesisVoice,
    rate: number = 1,
    pitch: number = 1,
  ): void {
    if (!this.synthesis) {
      throw new Error("Speech synthesis not supported");
    }

    if (this.currentUtterance) {
      this.synthesis.cancel();
    }

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.voice = voice;
    this.currentUtterance.rate = rate;
    this.currentUtterance.pitch = pitch;

    this.synthesis.speak(this.currentUtterance);
  }

  public pause(): void {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  public stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }
}
