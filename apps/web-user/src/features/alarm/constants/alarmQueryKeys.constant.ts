/**
 * 알림(주문 실시간 알림·목록) React Query 키
 */
export const alarmQueryKeys = {
  all: ["alarm"] as const,
  list: () => [...alarmQueryKeys.all, "list"] as const,
  unread: () => [...alarmQueryKeys.all, "unread"] as const,
};
