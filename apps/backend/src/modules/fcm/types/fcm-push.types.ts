export const FCM_PUSH_TYPE = {
  ORDER_NOTIFICATION: "ORDER_NOTIFICATION",
} as const;

export const FCM_ANDROID_CHANNEL_ID = {
  ORDER_NOTIFICATION: "order_notifications",
} as const;

export const FCM_MAX_MULTICAST_TOKENS = 500;

export type FcmPushType = (typeof FCM_PUSH_TYPE)[keyof typeof FCM_PUSH_TYPE];

export interface SendConsumerPushParams {
  consumerId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  androidChannelId?: string;
}

export interface SendConsumerOrderPushParams {
  consumerId: string;
  title: string;
  body: string;
  orderId: string;
}

export interface SendFcmTokensParams {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  androidChannelId?: string;
}

export interface SendFcmTokensResult {
  invalidTokens: string[];
  successCount: number;
  failureCount: number;
  failureCodes: string[];
}
