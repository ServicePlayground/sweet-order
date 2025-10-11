import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "./prisma/generated/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>("DATABASE_URL");
    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL이 설정되어 있지 않습니다. .env.{NODE_ENV} 또는 런타임 ENV/Secrets를 확인하세요.",
      );
    }

    // 필요시 Prisma 로그 레벨 켜기(초기 오류 가시화)
    super({
      datasources: { db: { url: databaseUrl } },
      log: [
        { level: "warn", emit: "stdout" },
        { level: "error", emit: "stdout" },
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
        this.logger.log("✅ Prisma DB 연결 성공");
        return;
      } catch (e: any) {
        const code = e?.code || e?.name || "UNKNOWN";
        const msg = e?.message || e?.toString?.() || e;
        this.logger.warn(`⚠️ Prisma 연결 실패 (${i}/${retries}) - ${code}: ${msg}`);
        if (i === retries) {
          this.logger.error("🚫 Prisma 연결 재시도 모두 실패 — 앱은 계속 실행됩니다(헬스는 200).");
          // 마지막에도 throw 하지 않음: 프로세스는 살아 있어야 App Runner 헬스체크 통과
          return;
        }
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
    } catch (e) {
      this.logger.warn(`Prisma disconnect 중 경고: ${e}`);
    }
  }
}
