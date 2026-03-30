import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "@/apps/web-seller/features/notification/apis/notification.api";
import { notificationQueryKeys } from "@/apps/web-seller/features/notification/constants/notificationQueryKeys.constant";
import type {
  NotificationListResponseDto,
  SellerNotificationSettings,
} from "@/apps/web-seller/features/notification/types/notification.dto";

// 스토어 알림 목록 조회
export function useNotificationList(storeId: string, page: number = 1, limit: number = 100) {
  return useQuery<NotificationListResponseDto>({
    queryKey: notificationQueryKeys.list(storeId),
    queryFn: () => notificationApi.getNotifications({ storeId, page, limit }),
    enabled: !!storeId,
  });
}

// 스토어 알림 미읽음 개수 조회
export function useNotificationUnreadCount(storeId: string) {
  return useQuery<number>({
    queryKey: notificationQueryKeys.unread(storeId),
    queryFn: () => notificationApi.getUnreadCount(storeId),
    enabled: !!storeId,
  });
}

// 스토어 알림 설정 조회
export function useNotificationPreferences(storeId: string) {
  return useQuery<SellerNotificationSettings>({
    queryKey: notificationQueryKeys.prefs(storeId),
    queryFn: () => notificationApi.getPreferences(storeId),
    enabled: !!storeId,
    staleTime: 30_000,
  });
}
