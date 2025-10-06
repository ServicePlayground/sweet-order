import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@sweet-order/shared-database";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    const databaseUrl = configService.get<string>("DATABASE_URL");
    if (!databaseUrl) {
      throw new Error("DATABASE_URL이 설정되어 있지 않습니다. .env.{NODE_ENV} 파일을 확인하세요.");
    }

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
