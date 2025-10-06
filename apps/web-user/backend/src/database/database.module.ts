import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "@web-user/backend/database/prisma.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
