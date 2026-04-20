import { consumerClient } from "@/apps/web-user/common/config/axios.config";
import type {
  AlarmNotificationItem,
  AlarmNotificationListResult,
} from "@/apps/web-user/features/alarm/types/alarm.type";

export const alarmApi = {
  // 주문 알림 목록 (`/v1/consumer/notifications`)
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<AlarmNotificationListResult> => {
    const response = await consumerClient.get("/notifications", { params });
    const payload = response.data.data as {
      data: AlarmNotificationItem[];
      meta: AlarmNotificationListResult["meta"];
    };
    return { items: payload.data, meta: payload.meta };
  },

  // 미읽음 개수
  getUnreadCount: async (): Promise<number> => {
    const response = await consumerClient.get("/notifications/unread-count");
    return (response.data.data as { count: number }).count;
  },

  // 단일 읽음
  markRead: async (notificationId: string): Promise<void> => {
    await consumerClient.patch(`/notifications/${notificationId}/read`);
  },

  // 전체 읽음
  markAllRead: async (): Promise<void> => {
    await consumerClient.patch("/notifications/read-all");
  },
};
