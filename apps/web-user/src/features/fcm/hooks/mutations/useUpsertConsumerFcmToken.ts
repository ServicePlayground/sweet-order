"use client";

import { useMutation } from "@tanstack/react-query";
import { fcmApi } from "@/apps/web-user/features/fcm/apis/fcm.api";
import type { FcmToken } from "@/apps/web-user/features/fcm/types/fcm.type";

export function useUpsertConsumerFcmToken() {
  return useMutation({
    mutationFn: (requestDto: FcmToken) => fcmApi.syncConsumerFcmToken(requestDto),
    onSuccess: (_data, variables) => {
      alert(
        `[임시] FcmToken.upsert API 성공\n${JSON.stringify(
          {
            deviceId: variables.deviceId,
            tokenLength: variables.token.length,
          },
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
      console.error("[WebViewBridge] FCM upsert API 실패", error);
      alert(
        `[임시] FcmToken.upsert API 실패\n${JSON.stringify(
          {
            deviceId: variables.deviceId,
            tokenLength: variables.token.length,
            status: err.response?.status ?? null,
            message: err.message ?? "unknown",
          },
          null,
          2,
        )}`,
      );
    },
  });
}
