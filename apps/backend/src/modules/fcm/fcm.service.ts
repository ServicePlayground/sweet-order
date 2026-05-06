import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";
import { SentryUtil } from "@apps/backend/common/utils/sentry.util";
import {
  FCM_MAX_MULTICAST_TOKENS,
  SendFcmTokensParams,
  SendFcmTokensResult,
} from "@apps/backend/modules/fcm/types/fcm-push.types";

/**
 * Firebase Admin SDK 래퍼 (Flutter 네이티브 앱 대상).
 *
 * - 환경변수(FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY) 미설정 시 자동 비활성화.
 * - Flutter `firebase_messaging` 플러그인이 수신하는 구조에 맞게 android/apns 채널을 사용합니다.
 * - `sendToTokens()` 응답에서 만료·무효 토큰을 반환하므로, 호출자가 DB 정리에 활용합니다.
 */
@Injectable()
export class FcmService implements OnModuleInit {
  private app: admin.app.App | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const projectId = this.configService.get<string>("FIREBASE_PROJECT_ID");
    const clientEmail = this.configService.get<string>("FIREBASE_CLIENT_EMAIL");
    const privateKey = this.configService.get<string>("FIREBASE_PRIVATE_KEY");

    if (!projectId || !clientEmail || !privateKey) {
      LoggerUtil.log("[FcmService] Firebase 환경변수 미설정 — FCM 비활성화");
      SentryUtil.captureMessage("[FcmService] Firebase 환경변수 미설정 — FCM 비활성화", "warning", {
        module: "fcm",
        operation: "firebase-admin-init",
        status: "disabled",
      });
      return;
    }

    try {
      // 동일 앱이 이미 초기화된 경우(hot-reload 등) 재사용
      this.app =
        admin.apps.find((a: admin.app.App | null) => a?.name === "[DEFAULT]") ??
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            // 환경변수 개행 이스케이프 처리 (\n → 실제 개행)
            privateKey: privateKey.replace(/\\n/g, "\n"),
          }),
        });
      LoggerUtil.log("[FcmService] Firebase Admin SDK 초기화 완료");
      SentryUtil.captureMessage("[FcmService] Firebase Admin SDK 초기화 완료", "info", {
        module: "fcm",
        operation: "firebase-admin-init",
        status: "success",
      });
    } catch (e) {
      LoggerUtil.log(
        `[FcmService] Firebase Admin SDK 초기화 실패: ${e instanceof Error ? e.message : String(e)}`,
      );
      SentryUtil.captureMessage("[FcmService] Firebase Admin SDK 초기화 실패", "error", {
        module: "fcm",
        operation: "firebase-admin-init",
        status: "failure",
      });
      SentryUtil.captureException(e, "error", {
        module: "fcm",
        operation: "firebase-admin-init",
      });
    }
  }

  get isEnabled(): boolean {
    return this.app !== null;
  }

  private static sanitizeTokens(tokens: string[]): string[] {
    return Array.from(new Set(tokens.map((token) => token.trim()).filter(Boolean)));
  }

  private static splitIntoChunks(tokens: string[], chunkSize: number): string[][] {
    const chunks: string[][] = [];
    for (let idx = 0; idx < tokens.length; idx += chunkSize) {
      chunks.push(tokens.slice(idx, idx + chunkSize));
    }
    return chunks;
  }

  /**
   * 여러 FCM 토큰에 푸시 알림을 발송합니다 (Flutter 네이티브 대상).
   *
   * - notification: 시스템 트레이에 표시되는 제목/본문
   * - data: Flutter `firebase_messaging`의 `RemoteMessage.data`로 전달 (화면 이동 등에 활용)
   * - android: 안드로이드 알림 채널 및 우선순위 설정
   * - apns: iOS 알림 배지·사운드 설정
   *
   * @returns 만료·무효로 판별된 토큰 목록 (DB 정리용)
   */
  async sendToTokens(params: SendFcmTokensParams): Promise<SendFcmTokensResult> {
    if (!this.app) {
      return { invalidTokens: [], successCount: 0, failureCount: 0, failureCodes: [] };
    }

    const tokens = FcmService.sanitizeTokens(params.tokens);
    if (tokens.length === 0) {
      return { invalidTokens: [], successCount: 0, failureCount: 0, failureCodes: [] };
    }

    const invalidTokenSet = new Set<string>();
    const failureCodeSet = new Set<string>();
    const tokenChunks = FcmService.splitIntoChunks(tokens, FCM_MAX_MULTICAST_TOKENS);
    let successCount = 0;
    let failureCount = 0;

    try {
      for (const chunk of tokenChunks) {
        const response = await admin.messaging(this.app).sendEachForMulticast({
          tokens: chunk,
          notification: {
            title: params.title,
            body: params.body,
          },
          data: params.data,
          android: {
            priority: "high",
            notification: {
              channelId: params.androidChannelId ?? "order_notifications",
              priority: "high",
              defaultSound: true,
            },
          },
          apns: {
            payload: {
              aps: {
                sound: "default",
                badge: 1,
              },
            },
          },
        });

        successCount += response.successCount;
        failureCount += response.failureCount;

        response.responses.forEach((resp: admin.messaging.SendResponse, idx: number) => {
          if (!resp.success && resp.error?.code) {
            failureCodeSet.add(resp.error.code);
          }
          if (
            !resp.success &&
            (resp.error?.code === "messaging/invalid-registration-token" ||
              resp.error?.code === "messaging/registration-token-not-registered")
          ) {
            invalidTokenSet.add(chunk[idx]);
          }
        });
      }

      if (failureCount > 0) {
        const invalidTokens = Array.from(invalidTokenSet);
        const failureCodes = Array.from(failureCodeSet);
        LoggerUtil.log(
          `[FcmService] 발송 결과 success=${successCount} failure=${failureCount} invalidTokens=${invalidTokens.length} failureCodes=${failureCodes.join(",")}`,
        );
      }
    } catch (e) {
      failureCodeSet.add("exception/send-to-tokens");
      failureCount += tokens.length;
      LoggerUtil.log(
        `[FcmService] sendToTokens 실패: ${e instanceof Error ? e.message : String(e)}`,
      );
      SentryUtil.captureException(e, "error", {
        module: "fcm",
        operation: "send-to-tokens",
      });
    }

    return {
      invalidTokens: Array.from(invalidTokenSet),
      successCount,
      failureCount,
      failureCodes: Array.from(failureCodeSet),
    };
  }
}
