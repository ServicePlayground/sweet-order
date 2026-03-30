import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/apps/web-seller/features/notification/apis/notification.api";
import { notificationQueryKeys } from "@/apps/web-seller/features/notification/constants/notificationQueryKeys.constant";
import type { SellerNotificationSettings } from "@/apps/web-seller/features/notification/types/notification.dto";

// 스토어 알림 설정 저장
export function useUpdateNotificationPreferences(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<SellerNotificationSettings>) =>
      notificationApi.updatePreferences(storeId, patch),
    onSuccess: (data) => {
      queryClient.setQueryData(notificationQueryKeys.prefs(storeId), data);
    },
  });
}

// 단일 알림 읽음 처리
export function useMarkNotificationRead(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list(storeId) });
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unread(storeId) });
    },
  });
}

// 스토어 알림 전체 읽음 처리
export function useMarkAllNotificationsRead(storeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllRead(storeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list(storeId) });
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unread(storeId) });
    },
  });
}
