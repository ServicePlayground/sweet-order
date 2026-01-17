import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

/**
 * 실패한 마이그레이션 해결
 * P3009 오류 발생 시 실패한 마이그레이션을 자동으로 해결
 */
function resolveFailedMigrations(projectRoot: string): string | null {
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
        `npx prisma migrate resolve --rolled-back ${failedMigrationName} --schema ./src/infra/database/prisma/schema.prisma`,
        {
          stdio: "inherit",
          cwd: projectRoot,
        },
      );
      console.log(
        `✅ Failed migration resolved: ${failedMigrationName}`,
      );
      return failedMigrationName;
    }
    return null;
  } catch (error: any) {
    // 마이그레이션 상태 확인 중 오류가 발생하면 오류 메시지에서 실패한 마이그레이션 추출 시도
    // P3009 오류가 발생하면 실패한 마이그레이션이 있는 것으로 간주
    const errorMessage = error?.message || String(error);
    // stdout과 stderr 모두 확인 (Prisma 오류는 stdout에 출력될 수 있음)
    const errorOutput = error?.output?.[1] || error?.output?.[2] || error?.stderr || error?.stdout || "";
    const fullErrorText = `${errorMessage} ${errorOutput}`;
    
    // P3009 오류가 포함되어 있으면 실패한 마이그레이션이 있는 것으로 간주
    if (
      fullErrorText.includes("P3009") ||
      fullErrorText.includes("failed migrations")
    ) {
      console.log(
        "⚠️  Failed migrations detected in status check. Attempting to resolve...",
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
      
      // 실패한 마이그레이션 이름을 찾았으면 해결 시도
      if (failedMigrationName) {
        try {
          console.log(
            `🔧 Resolving failed migration: ${failedMigrationName}`,
          );
          
          execSync(
            `npx prisma migrate resolve --rolled-back ${failedMigrationName} --schema ./src/infra/database/prisma/schema.prisma`,
            {
              stdio: "inherit",
              cwd: projectRoot,
            },
          );
          console.log(
            `✅ Failed migration resolved: ${failedMigrationName}`,
          );
          return failedMigrationName;
        } catch (resolveError) {
          console.error(
            `❌ Could not resolve failed migration: ${failedMigrationName}`,
            resolveError,
          );
          // 해결 실패해도 계속 진행 (다음 단계에서 다시 시도)
        }
      }
    }
    
    // 실패한 마이그레이션을 찾지 못했거나 해결하지 못한 경우 null 반환
    return null;
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
    const resolvedMigration = resolveFailedMigrations(projectRoot);

    console.log("🚀 Deploying migrations...");
    
    // db:migrate:deploy 실행 시 stdout/stderr를 캡처하여 오류 메시지 확인 가능하도록 함
    try {
      const deployOutput = execSync("yarn run db:migrate:deploy", {
        encoding: "utf-8",
        cwd: projectRoot,
        stdio: "pipe",
      });
      // 성공 시 출력 표시
      console.log(deployOutput);
      console.log("✅ Database migration completed successfully");
    } catch (deployError: any) {
      // deploy 오류 발생 시 오류 메시지 캡처
      const deployErrorMessage = deployError?.message || String(deployError);
      const deployErrorOutput = deployError?.output?.[1] || deployError?.output?.[2] || deployError?.stderr || deployError?.stdout || "";
      const deployFullErrorText = `${deployErrorMessage} ${deployErrorOutput}`;
      
      // 오류 메시지 출력 (디버깅용)
      console.error("Migration deploy error:", deployFullErrorText);
      
      // P3009 오류가 발생하면 실패한 마이그레이션 해결 시도
      if (
        deployFullErrorText.includes("P3009") ||
        deployFullErrorText.includes("failed migrations")
      ) {
        console.log(
          "⚠️  Migration failed due to failed migrations. Attempting to resolve...",
        );
        
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
          const match = deployFullErrorText.match(pattern);
          if (match && match[1]) {
            failedMigrationName = match[1];
            break;
          }
        }
        
        // 이전에 해결한 마이그레이션이 있으면 그것을 사용
        if (!failedMigrationName && resolvedMigration) {
          failedMigrationName = resolvedMigration;
        }
        
        // 마이그레이션 이름을 찾지 못한 경우 다시 확인 시도
        if (!failedMigrationName) {
          const retryResolved = resolveFailedMigrations(projectRoot);
          if (retryResolved) {
            failedMigrationName = retryResolved;
          }
        }
        
        if (failedMigrationName) {
          console.log(
            `🔧 Resolving failed migration: ${failedMigrationName}`,
          );
          
          try {
            execSync(
              `npx prisma migrate resolve --rolled-back ${failedMigrationName} --schema ./src/infra/database/prisma/schema.prisma`,
              {
                stdio: "inherit",
                cwd: projectRoot,
              },
            );
            console.log(
              `✅ Failed migration resolved: ${failedMigrationName}`,
            );
          } catch (resolveError) {
            console.error(
              `❌ Could not resolve failed migration: ${failedMigrationName}`,
              resolveError,
            );
            throw resolveError;
          }
          
          // 다시 마이그레이션 배포 시도
          console.log("🔄 Retrying migration deployment...");
          try {
            const retryOutput = execSync("yarn run db:migrate:deploy", {
              encoding: "utf-8",
              cwd: projectRoot,
              stdio: "pipe",
            });
            console.log(retryOutput);
            console.log("✅ Database migration completed successfully after resolution");
            return;
          } catch (retryError: any) {
            const retryErrorMessage = retryError?.message || String(retryError);
            const retryErrorOutput = retryError?.output?.[1] || retryError?.output?.[2] || retryError?.stderr || retryError?.stdout || "";
            console.error(
              "❌ Database migration failed even after resolving failed migrations:",
              `${retryErrorMessage} ${retryErrorOutput}`,
            );
            process.exit(1);
          }
        } else {
          console.error(
            "❌ Could not identify failed migration name from error message",
          );
          throw deployError;
        }
      } else {
        // P3009가 아닌 다른 오류인 경우
        console.error("❌ Database migration failed:", deployError);
        process.exit(1);
      }
    }
  } catch (error: any) {
    // resolveError나 다른 예상치 못한 오류 처리
    const errorMessage = error?.message || String(error);
    const errorOutput = error?.output?.[1] || error?.output?.[2] || error?.stderr || error?.stdout || "";
    const fullErrorText = `${errorMessage} ${errorOutput}`;
    
    // 이미 처리된 deployError가 아닌 경우에만 오류 출력
    if (!fullErrorText.includes("Migration deploy error")) {
      console.error("❌ Database migration failed:", error);
      process.exit(1);
    }
  }
}
