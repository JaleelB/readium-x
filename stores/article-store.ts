import { create } from "zustand";
import { useMemo } from "react";

interface ArticleState {
  zoom: number;
  summary: string | null;
  translatedContent: string | null;
  selectedLanguage: string;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setSummary: (summary: string | null) => void;
  setTranslatedContent: (content: string | null) => void;
  setSelectedLanguage: (language: string) => void;
}

const useArticleStore = create<ArticleState>((set) => ({
  zoom: 1,
  summary: null,
  translatedContent: null,
  selectedLanguage: "en",
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + 0.1, 5) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - 0.1, 0.5) })),
  resetZoom: () => set({ zoom: 1 }),
  setSummary: (summary) => set({ summary }),
  setTranslatedContent: (content) => set({ translatedContent: content }),
  setSelectedLanguage: (language) => set({ selectedLanguage: language }),
}));

export const useZoom = () => useArticleStore((state) => state.zoom);
export const useZoomActions = () => {
  const store = useArticleStore();
  return useMemo(
    () => ({
      zoomIn: store.zoomIn,
      zoomOut: store.zoomOut,
      resetZoom: store.resetZoom,
    }),
    [store.zoomIn, store.zoomOut, store.resetZoom],
  );
};
export const useSummary = () => useArticleStore((state) => state.summary);
export const useTranslatedContent = () =>
  useArticleStore((state) => state.translatedContent);
export const useSelectedLanguage = () =>
  useArticleStore((state) => state.selectedLanguage);
export const useSetSummary = () => useArticleStore((state) => state.setSummary);
export const useSetTranslatedContent = () =>
  useArticleStore((state) => state.setTranslatedContent);
export const useSetSelectedLanguage = () =>
  useArticleStore((state) => state.setSelectedLanguage);

export { useArticleStore };
