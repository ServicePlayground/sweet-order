import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "./prisma/generated/client";
import { SentryUtil } from "@apps/backend/common/utils/sentry.util";
import { LoggerUtil } from "@apps/backend/common/utils/logger.util";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private isConnected = false; // 데이터베이스 연결 상태 추적
  private readonly nodeEnv: string;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>("DATABASE_URL");
    const nodeEnv = configService.get<string>("NODE_ENV", "development");

    if (!databaseUrl) {
      const errorMessage = `DATABASE_URL이 설정되어 있지 않습니다. .env.${nodeEnv} 파일 또는 환경 변수를 확인하세요.`;
      LoggerUtil.log(errorMessage);
      throw new Error(errorMessage);
    }

    // 보안을 위해 Prisma 로그 레벨을 제한 (민감한 DB 정보 노출 방지)
    super({
      datasources: { db: { url: databaseUrl } },
      log: [
        { level: "error", emit: "stdout" }, // error 레벨만 출력
      ],
    });

    // super() 호출 후에 this.nodeEnv 할당
    this.nodeEnv = nodeEnv;
  }

  async onModuleInit(): Promise<void> {
    // 부팅-차단을 피하면서도 연결을 시도
    await this.connectWithRetry(10, 3000); // 10회, 3초 간격
  }

  private async connectWithRetry(retries = 10, delayMs = 3000): Promise<void> {
    for (let i = 1; i <= retries; i++) {
      try {
        await this.$connect();
        this.isConnected = true;
        LoggerUtil.log("✅ Prisma DB 연결 성공");
        return;
      } catch (e: any) {
        const code = e?.code || e?.name || "UNKNOWN";
        const msg = e?.message || e?.toString?.() || e;
        LoggerUtil.log(`⚠️ Prisma 연결 실패 (${i}/${retries}) - ${code}: ${msg}`);
        if (i === retries) {
          this.isConnected = false;

          LoggerUtil.log("🚫 Prisma 연결 재시도 모두 실패 — 애플리케이션을 종료합니다.");
          SentryUtil.captureException(e, "error", {
            module: "prisma-service",
            operation: "connect-with-retry",
            attempt: String(i),
            retries: String(retries),
          });
          throw new Error(`데이터베이스 연결에 실패했습니다. (${code}: ${msg})`);
        }
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  /**
   * 데이터베이스 연결 상태 확인
   * @returns 연결 상태 (true: 연결됨, false: 연결 안됨)
   */
  async checkConnection(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      // 간단한 쿼리로 연결 상태 확인
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.isConnected = false;
      LoggerUtil.log(
        `데이터베이스 연결 상태 확인 실패: ${error instanceof Error ? error.message : String(error)}`,
      );

      // 연결 실패는 중요한 이벤트이므로 Sentry로 전송
      SentryUtil.captureException(error, "error", {
        module: "prisma-service",
        operation: "check-connection",
      });

      return false;
    }
  }

  /**
   * 데이터베이스 연결 상태 반환 (동기)
   * @returns 연결 상태
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
    } catch (e) {
      LoggerUtil.log(`Prisma disconnect 중 경고: ${e}`);
    }
  }
}
