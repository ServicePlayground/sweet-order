import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

/**
 * 데이터베이스 마이그레이션 실행
 * 배포 환경에서 런타임 시 자동으로 실행되는 마이그레이션 스크립트
 */
export async function runMigration(): Promise<void> {
  try {
    // 배포 환경에서는 Docker 컨테이너의 /app 디렉토리에서 실행
    const projectRoot = "/app";

    console.log(`📁 Running migration from: ${projectRoot}`);
    console.log(`📁 Current working directory: ${process.cwd()}`);
    console.log(`📁 __dirname: ${__dirname}`);

    // package.json 파일이 존재하는지 확인
    const packageJsonPath = path.join(projectRoot, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`❌ package.json not found at: ${packageJsonPath}`);
      console.log(`📁 Available files in ${projectRoot}:`, fs.readdirSync(projectRoot));
      throw new Error(`package.json not found at ${projectRoot}`);
    }

    console.log(`✅ Found package.json at: ${packageJsonPath}`);

    // 실패한 마이그레이션이 있는지 확인하고 resolve 시도
    try {
      const schemaPath = path.join(projectRoot, "apps/backend/src/infra/database/prisma/schema.prisma");
      execSync(`prisma migrate resolve --applied 20251229230348_202512300803 --schema ${schemaPath}`, {
        stdio: "pipe",
        cwd: projectRoot,
      });
      console.log("✅ Resolved failed migration: 20251229230348_202512300803");
    } catch (resolveError: any) {
      // 실패한 마이그레이션이 없거나 이미 resolve된 경우 무시
      if (!resolveError.message?.includes("P3009") && !resolveError.message?.includes("not found")) {
        console.log("ℹ️ No failed migration to resolve or already resolved");
      }
    }

    execSync("yarn run db:migrate:deploy", {
      stdio: "inherit",
      cwd: projectRoot,
    });
    console.log("✅ Database migration completed successfully");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  }
}
