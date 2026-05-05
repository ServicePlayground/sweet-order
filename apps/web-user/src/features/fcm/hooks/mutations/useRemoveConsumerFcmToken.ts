"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import { fcmApi } from "@/apps/web-user/features/fcm/apis/fcm.api";
import type { FcmToken } from "@/apps/web-user/features/fcm/types/fcm.type";

export function useRemoveConsumerFcmToken() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: ({ deviceId }: Omit<FcmToken, "token">) =>
      fcmApi.syncConsumerFcmToken({ token: "", deviceId }),
    onSettled: () => {
      // 제거 요청은 API 결과와 무관하게 로그아웃을 보장합니다.
      // API 요청에 토큰이 필요하기 때문에, API 호출 이후에 로그아웃을 수행합니다.
      logout();
    },
  });
}
