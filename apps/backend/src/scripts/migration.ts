import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

/**
 * 실패한 마이그레이션 해결
 * P3009 오류 발생 시 실패한 마이그레이션을 자동으로 해결
 */
function resolveFailedMigrations(projectRoot: string): void {
  try {
    console.log("🔍 Checking for failed migrations...");
    
    // 마이그레이션 상태 확인 (배포 환경용 - dotenv 없이 실행)
    const statusOutput = execSync("yarn run db:migrate:deploy:status", {
      encoding: "utf-8",
      cwd: projectRoot,
      stdio: "pipe",
    });

    // 실패한 마이그레이션 찾기 (여러 패턴으로 확인)
    // 백틱(`)으로 감싸진 마이그레이션 이름도 매칭
    const patterns = [
      /The\s+`(\d+_\d+)`\s+migration.*failed/i,
      /The\s+`(\d+_\w+)`\s+migration.*failed/i,
      /The\s+(\d+_\d+)\s+migration.*failed/i,
      /The\s+(\d+_\w+)\s+migration.*failed/i,
      /Failed migrations:\s*\n\s*(\d+_\d+)/i,
      /Failed migrations:\s*\n\s*(\d+_\w+)/i,
      /(\d{14}_\d+).*failed/i,
      /(\d{14}_\w+).*failed/i,
    ];
    
    let failedMigrationMatch: RegExpMatchArray | null = null;
    for (const pattern of patterns) {
      failedMigrationMatch = statusOutput.match(pattern);
      if (failedMigrationMatch) break;
    }
    
    if (failedMigrationMatch) {
      const failedMigrationName = failedMigrationMatch[1];
      console.log(
        `⚠️  Found failed migration: ${failedMigrationName}`,
      );
      console.log(
        `🔧 Resolving failed migration as rolled back...`,
      );

      // 실패한 마이그레이션을 rolled-back으로 해결
      // 주의: 이는 마이그레이션이 실제로 롤백되었다고 가정합니다
      // 만약 마이그레이션이 이미 적용되었다면 --applied 옵션을 사용해야 합니다
      execSync(
        `yarn prisma migrate resolve --rolled-back ${failedMigrationName} --schema ./src/infra/database/prisma/schema.prisma`,
        {
          stdio: "inherit",
          cwd: projectRoot,
        },
      );
      console.log(
        `✅ Failed migration resolved: ${failedMigrationName}`,
      );
    }
  } catch (error: any) {
    // 마이그레이션 상태 확인 중 오류가 발생하면 무시하고 계속 진행
    // (마이그레이션이 없거나 다른 이유로 실패할 수 있음)
    const errorMessage = error?.message || String(error);
    const errorOutput = error?.output?.[2] || error?.stderr || "";
    const fullErrorText = `${errorMessage} ${errorOutput}`;
    
    // P3009 오류가 포함되어 있으면 실패한 마이그레이션이 있는 것으로 간주
    if (
      fullErrorText.includes("P3009") ||
      fullErrorText.includes("failed migrations")
    ) {
      console.log(
        "⚠️  Failed migrations detected. Attempting to resolve...",
      );
      
      // 오류 메시지에서 직접 실패한 마이그레이션 이름 추출 시도
      // 백틱(`)으로 감싸진 마이그레이션 이름도 매칭
      const errorPatterns = [
        /The\s+`(\d+_\d+)`\s+migration.*failed/i,
        /The\s+`(\d+_\w+)`\s+migration.*failed/i,
        /The\s+(\d+_\d+)\s+migration.*failed/i,
        /The\s+(\d+_\w+)\s+migration.*failed/i,
        /(\d{14}_\d+).*failed/i,
        /(\d{14}_\w+).*failed/i,
      ];
      
      let failedMigrationName: string | null = null;
      for (const pattern of errorPatterns) {
        const match = fullErrorText.match(pattern);
        if (match && match[1]) {
          failedMigrationName = match[1];
          break;
        }
      }
      
      // 오류 메시지에서 찾지 못한 경우 마이그레이션 상태 확인 (배포 환경용)
      if (!failedMigrationName) {
        try {
          const statusOutput = execSync("yarn run db:migrate:deploy:status", {
            encoding: "utf-8",
            cwd: projectRoot,
            stdio: "pipe",
          });
          
          // 여러 패턴으로 실패한 마이그레이션 이름 찾기
          // 백틱(`)으로 감싸진 마이그레이션 이름도 매칭
          const statusPatterns = [
            /The\s+`(\d+_\d+)`\s+migration.*failed/i,
            /The\s+`(\d+_\w+)`\s+migration.*failed/i,
            /The\s+(\d+_\d+)\s+migration.*failed/i,
            /The\s+(\d+_\w+)\s+migration.*failed/i,
            /Failed migrations:\s*\n\s*(\d+_\d+)/i,
            /Failed migrations:\s*\n\s*(\d+_\w+)/i,
            /(\d{14}_\d+).*failed/i,
            /(\d{14}_\w+).*failed/i,
          ];
          
          for (const pattern of statusPatterns) {
            const match = statusOutput.match(pattern);
            if (match && match[1]) {
              failedMigrationName = match[1];
              break;
            }
          }
        } catch (statusError) {
          // 상태 확인 실패 시 무시하고 계속 진행
          console.warn("⚠️  Could not check migration status:", statusError);
        }
      }
      
      // 실패한 마이그레이션 이름을 찾았으면 해결 시도
      if (failedMigrationName) {
        try {
          console.log(
            `🔧 Resolving failed migration: ${failedMigrationName}`,
          );
          
          execSync(
            `yarn prisma migrate resolve --rolled-back ${failedMigrationName} --schema ./src/infra/database/prisma/schema.prisma`,
            {
              stdio: "inherit",
              cwd: projectRoot,
            },
          );
          console.log(
            `✅ Failed migration resolved: ${failedMigrationName}`,
          );
          return;
        } catch (resolveError) {
          console.error(
            `❌ Could not resolve failed migration: ${failedMigrationName}`,
            resolveError,
          );
          throw resolveError;
        }
      } else {
        console.error(
          "❌ Could not identify failed migration name from error message",
        );
        throw error;
      }
    }
  }
}

/**
 * 데이터베이스 마이그레이션 실행
 * 배포 환경에서 런타임 시 자동으로 실행되는 마이그레이션 스크립트
 */
export async function runMigration(): Promise<void> {
  // 배포 환경에서는 Docker 컨테이너의 /app 디렉토리에서 실행
  const projectRoot = "/app";

  try {
    console.log(`📁 Running migration from: ${projectRoot}`);

    // package.json 파일이 존재하는지 확인
    const packageJsonPath = path.join(projectRoot, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`❌ package.json not found at: ${packageJsonPath}`);
      throw new Error(`package.json not found at ${projectRoot}`);
    }

    // 먼저 실패한 마이그레이션이 있는지 확인하고 해결
    resolveFailedMigrations(projectRoot);

    console.log("🚀 Deploying migrations...");
    execSync("yarn run db:migrate:deploy", {
      stdio: "inherit",
      cwd: projectRoot,
    });
    console.log("✅ Database migration completed successfully");
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    // stdout과 stderr 모두 확인 (Prisma 오류는 stdout에 출력될 수 있음)
    const errorOutput = error?.output?.[1] || error?.output?.[2] || error?.stderr || error?.stdout || "";
    const fullErrorText = `${errorMessage} ${errorOutput}`;
    
    // P3009 오류가 발생하면 실패한 마이그레이션 해결 시도
    if (
      fullErrorText.includes("P3009") ||
      fullErrorText.includes("failed migrations")
    ) {
      console.log(
        "⚠️  Migration failed due to failed migrations. Attempting to resolve...",
      );
      
      try {
        // 오류 메시지에서 실패한 마이그레이션 이름 추출하여 해결
        // 백틱(`)으로 감싸진 마이그레이션 이름도 매칭
        const errorPatterns = [
          /The\s+`(\d+_\d+)`\s+migration.*failed/i,
          /The\s+`(\d+_\w+)`\s+migration.*failed/i,
          /The\s+(\d+_\d+)\s+migration.*failed/i,
          /The\s+(\d+_\w+)\s+migration.*failed/i,
          /(\d{14}_\d+).*failed/i,
          /(\d{14}_\w+).*failed/i,
        ];
        
        let failedMigrationName: string | null = null;
        for (const pattern of errorPatterns) {
          const match = fullErrorText.match(pattern);
          if (match && match[1]) {
            failedMigrationName = match[1];
            break;
          }
        }
        
        if (failedMigrationName) {
          console.log(
            `🔧 Resolving failed migration: ${failedMigrationName}`,
          );
          
          execSync(
            `yarn prisma migrate resolve --rolled-back ${failedMigrationName} --schema ./src/infra/database/prisma/schema.prisma`,
            {
              stdio: "inherit",
              cwd: projectRoot,
            },
          );
          console.log(
            `✅ Failed migration resolved: ${failedMigrationName}`,
          );
        } else {
          // 마이그레이션 이름을 찾지 못한 경우 일반적인 해결 시도
          resolveFailedMigrations(projectRoot);
        }
        
        // 다시 마이그레이션 배포 시도
        console.log("🔄 Retrying migration deployment...");
        execSync("yarn run db:migrate:deploy", {
          stdio: "inherit",
          cwd: projectRoot,
        });
        console.log("✅ Database migration completed successfully after resolution");
        return;
      } catch (retryError) {
        console.error(
          "❌ Database migration failed even after resolving failed migrations:",
          retryError,
        );
        process.exit(1);
      }
    }
    
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  }
}
