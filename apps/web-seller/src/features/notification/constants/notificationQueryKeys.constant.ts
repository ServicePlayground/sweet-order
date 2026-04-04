/**
 * Notification 관련 쿼리 키 상수
 */
export const notificationQueryKeys = {
  all: ["notification"] as const,
  lists: () => ["notification", "list"] as const,
  list: (storeId: string) => ["notification", "list", storeId] as const,
  unread: (storeId: string) => ["notification", "unread", storeId] as const,
  prefs: (storeId: string) => ["notification", "prefs", storeId] as const,
} as const;
