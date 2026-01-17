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

    // package.json 파일이 존재하는지 확인
    const packageJsonPath = path.join(projectRoot, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`❌ package.json not found at: ${packageJsonPath}`);
      throw new Error(`package.json not found at ${projectRoot}`);
    }

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
