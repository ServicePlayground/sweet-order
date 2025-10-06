import { PrismaClient } from "@sweet-order/shared-database";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.phoneVerification.deleteMany();
  await prisma.productLike.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword1 = await bcrypt.hash("Password123!", 12);
  const hashedPassword2 = await bcrypt.hash("Password456!", 12);

  const users = await Promise.all([
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

  const phoneVerifications = await Promise.all([
    prisma.phoneVerification.create({
      data: {
        phone: "01012345678",
        verificationCode: "123456",
        expiresAt: new Date("2024-01-15T11:00:00Z"),
        isVerified: true,
        purpose: "registration",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:35:00Z"),
      },
    }),
    prisma.phoneVerification.create({
      data: {
        phone: "01023456789",
        verificationCode: "234567",
        expiresAt: new Date("2024-01-16T10:00:00Z"),
        isVerified: true,
        purpose: "registration",
        createdAt: new Date("2024-01-16T09:15:00Z"),
        updatedAt: new Date("2024-01-16T09:20:00Z"),
      },
    }),
    prisma.phoneVerification.create({
      data: {
        phone: "01012345678",
        verificationCode: "999999",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false,
        purpose: "password_recovery",
        userId: "user001",
        createdAt: new Date(),
      },
    }),
    prisma.phoneVerification.create({
      data: {
        phone: "01023456789",
        verificationCode: "888888",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false,
        purpose: "id_find",
        createdAt: new Date(),
      },
    }),
    prisma.phoneVerification.create({
      data: {
        phone: "01078901234",
        verificationCode: "555555",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: false,
        purpose: "registration",
        createdAt: new Date(),
      },
    }),
    prisma.phoneVerification.create({
      data: {
        phone: "01078901234",
        verificationCode: "777777",
        expiresAt: new Date("2024-01-01T00:00:00Z"),
        isVerified: false,
        purpose: "registration",
        createdAt: new Date("2024-01-01T00:00:00Z"),
      },
    }),
    prisma.phoneVerification.create({
      data: {
        phone: "01078901234",
        verificationCode: "666666",
        expiresAt: new Date("2024-01-02T00:00:00Z"),
        isVerified: false,
        purpose: "registration",
        createdAt: new Date("2024-01-02T00:00:00Z"),
      },
    }),
    prisma.phoneVerification.create({
      data: {
        phone: "01099999999",
        verificationCode: "111111",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false,
        purpose: "registration",
        createdAt: new Date(),
      },
    }),
    prisma.phoneVerification.create({
      data: {
        phone: "01099999999",
        verificationCode: "222222",
        expiresAt: new Date("2024-01-20T00:00:00Z"),
        isVerified: false,
        purpose: "registration",
        createdAt: new Date("2024-01-20T00:00:00Z"),
      },
    }),
  ]);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "프리미엄 초콜릿 케이크",
        description: "벨기에산 고급 초콜릿으로 만든 달콤한 케이크입니다.",
        originalPrice: 50000,
        salePrice: 45000,
        notice: "주문 후 1-2일 내 제작 완료",
        caution: "알레르기 주의: 우유, 계란, 밀 함유",
        basicIncluded: "케이크, 촛불, 포크",
        location: "서울시 강남구",
        likeCount: 25,
        orderFormSchema: {
          title: "케이크 커스터마이징",
          description: "원하시는 옵션을 선택해주세요",
          fields: [],
        },
        detailDescription: "<p>고급 초콜릿으로 만든 프리미엄 케이크입니다.</p>",
        productNumber: "CAKE-001",
        foodType: "케이크류",
        producer: "스위트오더",
        manufactureDate: "제조일로부터 3일",
        packageInfo: "1개",
        calories: "350kcal",
        ingredients: "초콜릿, 밀가루, 설탕, 우유, 계란",
        origin: "국내산",
        customerService: "1588-1234",
        mainCategory: ["PRODUCT"],
        subCategory: ["CAKE"],
        targetAudience: ["ADULT", "CHILD"],
        sizeRange: ["ONE_TO_TWO", "TWO_TO_THREE"],
        deliveryMethod: ["PICKUP", "DELIVERY"],
        deliveryDays: ["ONE_TO_TWO", "TWO_TO_THREE"],
        hashtags: ["케이크", "초콜릿", "생일", "기념일"],
        status: "ACTIVE",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      },
    }),
  ]);

  const productImages = await Promise.all([
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/chocolate-cake-1.jpg",
        alt: "초콜릿 케이크 메인 이미지",
        order: 1,
        productId: products[0].id,
      },
    }),
  ]);

  const productLikes = await Promise.all([
    prisma.productLike.create({
      data: {
        userId: users[0].id,
        productId: products[0].id,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);
  console.log(`✅ Created ${phoneVerifications.length} phone verifications`);
  console.log(`✅ Created ${products.length} products`);
  console.log(`✅ Created ${productImages.length} product images`);
  console.log(`✅ Created ${productLikes.length} product likes`);
  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
