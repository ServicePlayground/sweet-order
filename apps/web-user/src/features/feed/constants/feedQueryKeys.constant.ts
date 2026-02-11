export const feedQueryKeys = {
  storeFeeds: (storeId: string, page: number, limit: number) =>
    ["feed", "store", storeId, page, limit] as const,
} as const;
