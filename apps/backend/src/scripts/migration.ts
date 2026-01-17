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
    const schemaPath = path.join(
      projectRoot,
      "apps/backend/src/infra/database/prisma/schema.prisma",
    );

    console.log(`📁 Running migration from: ${projectRoot}`);

    // package.json 파일이 존재하는지 확인
    const packageJsonPath = path.join(projectRoot, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`❌ package.json not found at: ${packageJsonPath}`);
      throw new Error(`package.json not found at ${projectRoot}`);
    }

    // 실패한 마이그레이션이 있는 경우 자동으로 해결 시도
    // P3009 오류는 실패한 마이그레이션이 있을 때 발생
    try {
      console.log("🚀 Deploying migrations...");
      execSync("yarn run db:migrate:deploy", {
        stdio: "inherit",
        cwd: projectRoot,
      });
      console.log("✅ Database migration completed successfully");
    } catch (migrateError: any) {
      const errorOutput = migrateError.message || migrateError.toString();

      // P3009 오류: 실패한 마이그레이션이 있는 경우
      if (errorOutput.includes("P3009") || errorOutput.includes("failed migrations")) {
        console.log("⚠️ Failed migration detected. Attempting to resolve...");

        // 실패한 마이그레이션 이름 추출 (오류 메시지에서)
        const failedMigrationMatch = errorOutput.match(/(\d+_\w+)/);
        if (failedMigrationMatch) {
          const failedMigrationName = failedMigrationMatch[1];
          console.log(`🔧 Resolving failed migration: ${failedMigrationName}`);

          try {
            // 실패한 마이그레이션을 applied로 표시
            execSync(
              `prisma migrate resolve --applied ${failedMigrationName} --schema ${schemaPath}`,
              {
                stdio: "inherit",
                cwd: projectRoot,
              },
            );
            console.log(`✅ Successfully resolved failed migration: ${failedMigrationName}`);

            // 다시 마이그레이션 배포 시도
            console.log("🚀 Retrying migration deployment...");
            execSync("yarn run db:migrate:deploy", {
              stdio: "inherit",
              cwd: projectRoot,
            });
            console.log("✅ Database migration completed successfully");
          } catch (resolveError: any) {
            console.error(`❌ Failed to resolve migration: ${resolveError.message}`);
            throw resolveError;
          }
        } else {
          console.error("❌ Could not extract failed migration name from error");
          throw migrateError;
        }
      } else {
        // 다른 종류의 오류인 경우 그대로 throw
        throw migrateError;
      }
    }
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  }
}
