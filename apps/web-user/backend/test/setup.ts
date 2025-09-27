import { PrismaClient } from "@prisma/client";

// 테스트 전후에 데이터베이스 정리
const prisma = new PrismaClient();

beforeAll(async () => {
  // 테스트 시작 전 데이터베이스 정리
  await prisma.user.deleteMany();
  await prisma.phoneVerification.deleteMany();
});

afterAll(async () => {
  // 테스트 종료 후 데이터베이스 정리
  await prisma.user.deleteMany();
  await prisma.phoneVerification.deleteMany();
  await prisma.$disconnect();
});

afterEach(async () => {
  // 각 테스트 후 데이터베이스 정리
  await prisma.user.deleteMany();
  await prisma.phoneVerification.deleteMany();
});
