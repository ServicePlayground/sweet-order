import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "./prisma/generated/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false; // 데이터베이스 연결 상태 추적

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>("DATABASE_URL");
    const nodeEnv = configService.get<string>("NODE_ENV");

    if (!databaseUrl) {
      throw new Error(
        `DATABASE_URL이 설정되어 있지 않습니다. .env.${nodeEnv} 파일 또는 환경 변수를 확인하세요.`,
      );
    }

    // 보안을 위해 Prisma 로그 레벨을 제한 (민감한 DB 정보 노출 방지)
    super({
      datasources: { db: { url: databaseUrl } },
      log: [
        { level: "error", emit: "stdout" }, // error 레벨만 출력
      ],
    });
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
        this.logger.log("✅ Prisma DB 연결 성공");
        return;
      } catch (e: any) {
        const code = e?.code || e?.name || "UNKNOWN";
        const msg = e?.message || e?.toString?.() || e;
        this.logger.warn(`⚠️ Prisma 연결 실패 (${i}/${retries}) - ${code}: ${msg}`);
        if (i === retries) {
          this.isConnected = false;
          
          this.logger.error("🚫 Prisma 연결 재시도 모두 실패 — 애플리케이션을 종료합니다.");
          throw new Error(
            `데이터베이스 연결에 실패했습니다. (${code}: ${msg})`,
          );
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
      this.logger.warn("데이터베이스 연결 상태 확인 실패:", error);
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
      this.logger.warn(`Prisma disconnect 중 경고: ${e}`);
    }
  }
}
