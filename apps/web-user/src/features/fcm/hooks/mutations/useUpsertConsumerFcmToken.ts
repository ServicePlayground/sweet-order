"use client";

import { useMutation } from "@tanstack/react-query";
import { fcmApi } from "@/apps/web-user/features/fcm/apis/fcm.api";
import type { FcmToken } from "@/apps/web-user/features/fcm/types/fcm.type";

export function useUpsertConsumerFcmToken() {
  return useMutation({
    mutationFn: (requestDto: FcmToken) => fcmApi.syncConsumerFcmToken(requestDto),
  });
}
