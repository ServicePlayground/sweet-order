import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 시드 데이터 생성의 메인 로직 담당
async function main() {
  // 기존 데이터 정리
  await prisma.user.deleteMany({
    where: {
      userId: {
        in: ["user123", "admin123", "test123"],
      },
    },
  });

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        userId: "user123",
        phone: "01012345678",
        name: "일반 사용자",
      },
    }),
    prisma.user.create({
      data: {
        userId: "admin123",
        phone: "01012345679",
        name: "관리자",
      },
    }),
    prisma.user.create({
      data: {
        userId: "test123",
        phone: "01012345680",
        name: "테스트 사용자",
      },
    }),
  ]);

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
