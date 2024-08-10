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
  ): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Speech synthesis not supported"));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;

      const audioContext = new AudioContext();
      const source = audioContext.createBufferSource();
      const streamDestination = audioContext.createMediaStreamDestination();
      source.connect(streamDestination);

      const chunks: Float32Array[] = [];

      const mediaRecorder = new MediaRecorder(streamDestination.stream);
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const dataView = new DataView(arrayBuffer);
            const floatArray = new Float32Array(dataView.byteLength / 4);
            for (let i = 0; i < floatArray.length; i++) {
              floatArray[i] = dataView.getFloat32(i * 4, true);
            }
            chunks.push(floatArray);
          };
          reader.onerror = (error) => {
            console.error("Error reading audio data:", error);
          };
          reader.readAsArrayBuffer(event.data);
        } else {
          console.warn("Received empty audio data");
        }
      };

      mediaRecorder.onstop = () => {
        if (chunks.length === 0) {
          reject(new Error("No audio data was recorded"));
          return;
        }

        const totalLength = chunks.reduce(
          (acc, chunk) => acc + chunk.length,
          0,
        );
        const audioBuffer = audioContext.createBuffer(
          1,
          totalLength,
          audioContext.sampleRate,
        );
        const channelData = audioBuffer.getChannelData(0);

        let offset = 0;
        chunks.forEach((chunk) => {
          channelData.set(chunk, offset);
          offset += chunk.length;
        });

        resolve(audioBuffer);
      };

      mediaRecorder.onerror = (event: Event) => {
        if (event instanceof ErrorEvent) {
          reject(new Error(`MediaRecorder error: ${event.message}`));
        } else {
          reject(new Error("Unknown MediaRecorder error"));
        }
      };

      try {
        mediaRecorder.start(100); // Start recording, call ondataavailable every 100ms
        this.synthesis.speak(utterance);

        utterance.onend = () => {
          mediaRecorder.stop();
        };

        utterance.onerror = (event) => {
          mediaRecorder.stop();
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };
      } catch (error) {
        reject(new Error(`Failed to start recording: ${error}`));
      }
    });
  }
}
