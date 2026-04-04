"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore, useAuthHasHydrated } from "@/apps/web-user/common/store/auth.store";
import { useAlertStore } from "@/apps/web-user/common/store/alert.store";
import { connectAlarmSocket } from "@/apps/web-user/features/alarm/services/alarm-socket.service";
import { alarmQueryKeys } from "@/apps/web-user/features/alarm/constants/alarmQueryKeys.constant";

/**
 * 로그인 시 주문 알림 소켓을 붙이고, 수신 시 목록·미읽음 쿼리를 갱신·토스트를 띄웁니다.
 */
export function AlarmRealtimeListener() {
  const queryClient = useQueryClient();
  const hasHydrated = useAuthHasHydrated();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!hasHydrated || !accessToken || !isAuthenticated) {
      return;
    }

    return connectAlarmSocket({
      onNotification: (item) => {
        void queryClient.invalidateQueries({ queryKey: alarmQueryKeys.list() });
        void queryClient.invalidateQueries({ queryKey: alarmQueryKeys.unread() });
        useAlertStore.getState().showAlert({
          type: "info",
          title: item.title,
          message: item.body,
        });
      },
    });
  }, [hasHydrated, accessToken, isAuthenticated, queryClient]);

  return null;
}
