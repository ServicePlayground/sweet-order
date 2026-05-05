import { Injectable } from "@nestjs/common";
import { PrismaService } from "@apps/backend/infra/database/prisma.service";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

/**
 * 구매자 FCM 토큰 영속성 계층.
 * - 동기화: user + deviceId 단위 upsert (같은 디바이스면 token 갱신)
 * - 동기화(빈 token): user + deviceId 단위 삭제 (로그아웃 시)
 * - 조회: 특정 소비자의 유효 토큰 목록
 */
@Injectable()
export class ConsumerFcmTokenService {
  constructor(private readonly prisma: PrismaService) {}

  private static normalizeToken(token: string): string {
    return token.trim();
  }

  private static normalizeDeviceId(deviceId: string): string {
    return deviceId.trim();
  }

  async syncToken(consumerId: string, deviceId: string, token: string): Promise<void> {
    const normalizedDeviceId = ConsumerFcmTokenService.normalizeDeviceId(deviceId);
    const normalizedToken = ConsumerFcmTokenService.normalizeToken(token);
    if (!normalizedDeviceId) {
      return;
    }

    if (!normalizedToken) {
      await this.prisma.consumerFcmToken.deleteMany({
        where: { consumerId, deviceId: normalizedDeviceId },
      });
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      // 동일 token이 다른 사용자/디바이스에 귀속된 경우 제거 (토큰 재발급/계정 전환 시나리오)
      await tx.consumerFcmToken.deleteMany({
        where: {
          token: normalizedToken,
          NOT: {
            consumerId,
            deviceId: normalizedDeviceId,
          },
        },
      });

      await tx.consumerFcmToken.upsert({
        where: {
          consumerId_deviceId: {
            consumerId,
            deviceId: normalizedDeviceId,
          },
        },
        create: { consumerId, deviceId: normalizedDeviceId, token: normalizedToken },
        update: { token: normalizedToken, updatedAt: new Date() },
      });
    });
  }

  /**
   * 해당 소비자의 모든 FCM 토큰을 반환합니다.
   */
  async getTokensByConsumerId(consumerId: string): Promise<string[]> {
    const rows = await this.prisma.consumerFcmToken.findMany({
      where: { consumerId },
      select: { token: true },
    });
    return rows.map((r) => r.token);
  }

  /**
   * 만료·무효 토큰을 일괄 삭제합니다 (FCM 발송 실패 후 정리).
   */
  async removeInvalidTokens(tokens: string[]): Promise<void> {
    const uniqueTokens = Array.from(
      new Set(tokens.map((token) => ConsumerFcmTokenService.normalizeToken(token)).filter(Boolean)),
    );
    if (uniqueTokens.length === 0) return;

    await this.prisma.consumerFcmToken.deleteMany({
      where: { token: { in: uniqueTokens } },
    });
    LoggerUtil.log(`[ConsumerFcmTokenService] 무효 토큰 ${uniqueTokens.length}개 삭제`);
  }
}
