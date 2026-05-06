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
    onSuccess: (_data, variables) => {
      alert(
        `[임시] FcmToken.remove API 성공\n${JSON.stringify(
          { deviceId: variables.deviceId },
          null,
          2,
        )}`,
      );
    },
    onError: (error: unknown, variables) => {
      const err = error as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };
      console.error("[WebViewBridge] FCM remove API 실패", error);
      alert(
        `[임시] FcmToken.remove API 실패\n${JSON.stringify(
          {
            deviceId: variables.deviceId,
            status: err.response?.status ?? null,
            message: err.message ?? "unknown",
          },
          null,
          2,
        )}`,
      );
    },
    onSettled: () => {
      // 제거 요청은 API 결과와 무관하게 로그아웃을 보장합니다.
      // API 요청에 토큰이 필요하기 때문에, API 호출 이후에 로그아웃을 수행합니다.
      logout();
    },
  });
}
