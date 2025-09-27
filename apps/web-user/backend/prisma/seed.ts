import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// 시드 데이터 생성의 메인 로직 담당
async function main() {
  // 기존 데이터 정리
  await prisma.phoneVerification.deleteMany();
  await prisma.user.deleteMany();

  // 비밀번호 해싱
  const hashedPassword1 = await bcrypt.hash("Password123!", 12);
  const hashedPassword2 = await bcrypt.hash("Password456!", 12);

  /* ------------------------ 사용자 데이터 생성 ------------------------ */
  const users = await Promise.all([
    // 1. 완전한 정보
    prisma.user.create({
      data: {
        userId: "user001",
        phone: "01012345678",
        passwordHash: hashedPassword1,
        name: "김철수",
        nickname: "철수킹",
        email: "kimcs@example.com",
        profileImageUrl: "https://example.com/profile/kimcs.jpg",
        isPhoneVerified: true,
        isActive: true,
        createdAt: new Date("2024-01-15T10:30:00Z"),
        lastLoginAt: new Date("2024-01-20T14:25:00Z"),
      },
    }),

    // 2. 일반 회원가입 - 최소 정보
    prisma.user.create({
      data: {
        userId: "user002",
        phone: "01023456789",
        passwordHash: hashedPassword2,
        isPhoneVerified: true,
        isActive: true,
        createdAt: new Date("2024-01-16T09:15:00Z"),
      },
    }),

    // 3. 구글 소셜 로그인 사용자 - 최소 정보
    prisma.user.create({
      data: {
        phone: "01034567890",
        googleId: "google_123456789",
        googleEmail: "john.doe@gmail.com",
        isPhoneVerified: true,
        isActive: true,
        createdAt: new Date("2024-01-17T16:45:00Z"),
      },
    }),

    // 4. 일반 & 구글 사용자 - 최소 정보
    prisma.user.create({
      data: {
        userId: "user004",
        phone: "01078901234",
        passwordHash: hashedPassword1,
        googleId: "google_987654321",
        googleEmail: "jane.smith@gmail.com",
        isPhoneVerified: true,
        isActive: true,
        createdAt: new Date("2023-12-01T10:00:00Z"),
      },
    }),
  ]);

  /* ------------------------ 휴대폰 인증 데이터 생성 (샘플 사용자들과 연관)  ------------------------ */
  const phoneVerifications = await Promise.all([
    // 1. user001 (김철수) - 회원가입 시 사용한 인증번호 (완료됨)
    prisma.phoneVerification.create({
      data: {
        phone: "01012345678", // user001의 휴대폰
        verificationCode: "123456",
        expiresAt: new Date("2024-01-15T11:00:00Z"), // 회원가입 당시
        isVerified: true,
        purpose: "registration",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:35:00Z"),
      },
    }),

    // 2. user002 - 회원가입 시 사용한 인증번호 (완료됨)
    prisma.phoneVerification.create({
      data: {
        phone: "01023456789", // user002의 휴대폰
        verificationCode: "234567",
        expiresAt: new Date("2024-01-16T10:00:00Z"),
        isVerified: true,
        purpose: "registration",
        createdAt: new Date("2024-01-16T09:15:00Z"),
        updatedAt: new Date("2024-01-16T09:20:00Z"),
      },
    }),

    // 3. user001 - 비밀번호 찾기용 인증번호 (현재 유효)
    prisma.phoneVerification.create({
      data: {
        phone: "01012345678", // user001의 휴대폰
        verificationCode: "999999",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10분 후
        isVerified: false,
        purpose: "password_recovery",
        userId: "user001",
        createdAt: new Date(),
      },
    }),

    // 4. user002 - 아이디 찾기용 인증번호 (현재 유효)
    prisma.phoneVerification.create({
      data: {
        phone: "01023456789", // user002의 휴대폰
        verificationCode: "888888",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false,
        purpose: "id_find",
        createdAt: new Date(),
      },
    }),

    // 5. user004 - 회원가입 시도 중인 인증번호 (현재 유효)
    prisma.phoneVerification.create({
      data: {
        phone: "01078901234", // user004의 휴대폰
        verificationCode: "555555",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5분 후
        isVerified: false,
        purpose: "registration",
        createdAt: new Date(),
      },
    }),

    // 6. user004 - 이전에 실패한 인증번호들 (만료됨)
    prisma.phoneVerification.create({
      data: {
        phone: "01078901234", // user004의 휴대폰
        verificationCode: "777777",
        expiresAt: new Date("2024-01-01T00:00:00Z"), // 과거 시간
        isVerified: false,
        purpose: "registration",
        createdAt: new Date("2024-01-01T00:00:00Z"),
      },
    }),

    prisma.phoneVerification.create({
      data: {
        phone: "01078901234", // user004의 휴대폰
        verificationCode: "666666",
        expiresAt: new Date("2024-01-02T00:00:00Z"), // 과거 시간
        isVerified: false,
        purpose: "registration",
        createdAt: new Date("2024-01-02T00:00:00Z"),
      },
    }),

    // 7. 새로운 사용자 - 회원가입 시도 중 (현재 유효)
    prisma.phoneVerification.create({
      data: {
        phone: "01099999999", // 새로운 사용자
        verificationCode: "111111",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false,
        purpose: "registration",
        createdAt: new Date(),
      },
    }),

    // 8. 새로운 사용자 - 이전 시도 실패 (만료됨)
    prisma.phoneVerification.create({
      data: {
        phone: "01099999999", // 새로운 사용자
        verificationCode: "222222",
        expiresAt: new Date("2024-01-20T00:00:00Z"), // 과거 시간
        isVerified: false,
        purpose: "registration",
        createdAt: new Date("2024-01-20T00:00:00Z"),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);
  console.log(`✅ Created ${phoneVerifications.length} phone verifications`);
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
