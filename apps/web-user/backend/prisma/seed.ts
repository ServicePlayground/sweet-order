import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

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

  // 비밀번호 해싱
  const hashedPassword1 = await bcrypt.hash("Password123!", 12);
  const hashedPassword2 = await bcrypt.hash("Password456!", 12);

  // Create sample users
  const users = await Promise.all([
    // 일반 회원가입
    prisma.user.create({
      data: {
        userId: "user123",
        phone: "01012345678",
        passwordHash: hashedPassword1,
        isPhoneVerified: true,
      },
    }),
    // 일반 회원가입
    prisma.user.create({
      data: {
        userId: "user456",
        phone: "01012345679",
        passwordHash: hashedPassword2,
        isPhoneVerified: true,
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
