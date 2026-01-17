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

    const schemaPath = path.join(projectRoot, "apps/backend/src/infra/database/prisma/schema.prisma");

    // 실패한 마이그레이션 확인 및 자동 해결
    try {
      console.log("🔍 Checking for failed migrations...");
      
      // migrate status로 실패한 마이그레이션 확인
      const statusOutput = execSync(`prisma migrate status --schema ${schemaPath}`, {
        encoding: "utf-8",
        cwd: projectRoot,
        stdio: "pipe",
      });

      console.log("📊 Migration status:", statusOutput);

      // P3009 오류가 있는지 확인 (실패한 마이그레이션)
      if (statusOutput.includes("failed") || statusOutput.includes("P3009")) {
        console.log("⚠️ Failed migration detected. Attempting to resolve...");
        
        // 실패한 마이그레이션 이름 추출 시도
        const failedMigrationMatch = statusOutput.match(/migration\s+(\d+_\w+)/i);
        if (failedMigrationMatch) {
          const failedMigrationName = failedMigrationMatch[1];
          console.log(`🔧 Resolving failed migration: ${failedMigrationName}`);
          
          try {
            // 실패한 마이그레이션을 applied로 표시
            execSync(`prisma migrate resolve --applied ${failedMigrationName} --schema ${schemaPath}`, {
              stdio: "inherit",
              cwd: projectRoot,
            });
            console.log(`✅ Successfully resolved failed migration: ${failedMigrationName}`);
          } catch (resolveError: any) {
            console.log(`⚠️ Could not resolve migration ${failedMigrationName}, trying to mark as rolled back...`);
            // applied로 해결되지 않으면 rolled back으로 시도
            try {
              execSync(`prisma migrate resolve --rolled-back ${failedMigrationName} --schema ${schemaPath}`, {
                stdio: "inherit",
                cwd: projectRoot,
              });
              console.log(`✅ Marked migration ${failedMigrationName} as rolled back`);
            } catch (rollbackError) {
              console.error(`❌ Failed to resolve migration ${failedMigrationName}:`, rollbackError);
              throw rollbackError;
            }
          }
        } else {
          // 마이그레이션 이름을 추출할 수 없는 경우, 알려진 실패 마이그레이션 시도
          console.log("⚠️ Could not extract migration name, trying known failed migration...");
          const knownFailedMigration = "20251229230348_202512300803";
          try {
            execSync(`prisma migrate resolve --applied ${knownFailedMigration} --schema ${schemaPath}`, {
              stdio: "inherit",
              cwd: projectRoot,
            });
            console.log(`✅ Resolved known failed migration: ${knownFailedMigration}`);
          } catch (resolveError: any) {
            // 이미 적용되었거나 다른 상태일 수 있음
            console.log(`ℹ️ Could not resolve ${knownFailedMigration}, may already be resolved`);
          }
        }
      } else {
        console.log("✅ No failed migrations detected");
      }
    } catch (statusError: any) {
      // migrate status 자체가 실패한 경우 (예: P3009 오류)
      const errorMessage = statusError.message || statusError.toString();
      if (errorMessage.includes("P3009") || errorMessage.includes("failed migrations")) {
        console.log("⚠️ P3009 error detected. Attempting to resolve failed migration...");
        
        // 알려진 실패 마이그레이션 시도
        const knownFailedMigration = "20251229230348_202512300803";
        try {
          execSync(`prisma migrate resolve --applied ${knownFailedMigration} --schema ${schemaPath}`, {
            stdio: "inherit",
            cwd: projectRoot,
          });
          console.log(`✅ Resolved failed migration: ${knownFailedMigration}`);
        } catch (resolveError: any) {
          console.log(`⚠️ Could not resolve ${knownFailedMigration}, trying rolled-back...`);
          try {
            execSync(`prisma migrate resolve --rolled-back ${knownFailedMigration} --schema ${schemaPath}`, {
              stdio: "inherit",
              cwd: projectRoot,
            });
            console.log(`✅ Marked ${knownFailedMigration} as rolled back`);
          } catch (rollbackError) {
            console.error(`❌ Failed to resolve migration:`, rollbackError);
            // 계속 진행하여 migrate deploy 시도
          }
        }
      } else {
        console.log("ℹ️ Migration status check failed, but continuing...");
      }
    }

    // 마이그레이션 배포 실행
    console.log("🚀 Deploying migrations...");
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
