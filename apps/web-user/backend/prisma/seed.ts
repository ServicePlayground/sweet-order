import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// 시드 데이터 생성의 메인 로직 담당
async function main() {
  console.log("🌱 Starting database seeding...");

  // 기존 데이터 정리 (선택사항)
  console.log("🧹 Cleaning existing seed data...");
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ["user@example.com", "admin@example.com", "test@example.com"],
      },
    },
  });

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "user@example.com",
        name: "일반 사용자",
      },
    }),
    prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "관리자",
      },
    }),
    prisma.user.create({
      data: {
        email: "test@example.com",
        name: "테스트 사용자",
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);
  console.log("🎉 Database seeding completed!");
}

// 시드 데이터 생성 실행
main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
