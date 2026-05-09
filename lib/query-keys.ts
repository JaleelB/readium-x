export const queryKeys = {
  bookmarks: ["bookmarks"] as const,
  history: ["history"] as const,
  bookmarkStatus: (articleUrl: string) =>
    ["bookmarkStatus", articleUrl] as const,
  readingProgress: (readingHistoryId: number) =>
    ["readingProgress", readingHistoryId] as const,
};
