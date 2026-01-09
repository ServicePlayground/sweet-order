import { PrismaClient } from "./generated/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.phoneVerification.deleteMany();
  await prisma.productLike.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword1 = await bcrypt.hash("Password123!", 12);
  const hashedPassword2 = await bcrypt.hash("Password456!", 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        userId: "user001",
        role: "SELLER",
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

  const stores = await Promise.all([
    prisma.store.create({
      data: {
        userId: users[0].id, // SELLER 역할을 가진 첫 번째 사용자
        name: "스위트오더 스토어",
        description: "맛있는 케이크를 판매하는 스토어입니다.",
        logoImageUrl:
          "https://static-staging.sweetorders.com/uploads/1__1762274005545_4bfc55b7.jpeg",
        // 사업자 정보 (1단계)
        businessNo: "1198288946", // 정규화된 사업자등록번호 (하이픈 제거)
        representativeName: "홍길동",
        openingDate: "20230101",
        businessName: "스위트오더",
        businessSector: "도매 및 소매업",
        businessType: "전자상거래 소매 중개업",
        // 통신판매사업자 정보 (2단계)
        permissionManagementNumber: "2021-서울강동-0422",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      },
    }),
  ]);

  // 100개의 상품 생성
  const products = await Promise.all(
    Array.from({ length: 100 }, (_, index) =>
      prisma.product.create({
        data: {
          storeId: stores[0].id, // 첫 번째 스토어 ID (Store를 통해 User(Seller) 참조)
          name: "프리미엄 초콜릿 케이크",
          mainImage:
            "https://static-staging.sweetorders.com/uploads/1__1762512563333_036e4556.jpeg",
          additionalImages: [],
          salePrice: 45000,
          salesStatus: "ENABLE",
          visibilityStatus: "ENABLE",
          likeCount: 25,
          // 케이크 옵션을 각각 JSON 배열로 저장
          cakeSizeOptions: [
            {
              visible: "ENABLE",
              displayName: "미니(10cm)",
              description: "1~2인용",
            },
            {
              visible: "ENABLE",
              displayName: "1호 (15cm)",
              description: "2~3인용",
            },
          ],
          cakeFlavorOptions: [
            {
              visible: "ENABLE",
              displayName: "초콜릿",
            },
            {
              visible: "ENABLE",
              displayName: "바닐라",
            },
          ],
          letteringRequired: "OPTIONAL",
          letteringMaxLength: 20,
          imageUploadEnabled: "ENABLE",
          detailDescription: "<p>고급 초콜릿으로 만든 프리미엄 케이크입니다.</p>",
          productNumber: `20240101-${String(index + 1).padStart(3, "0")}`, // 20240101-001, 20240101-002, ... 20240101-100
          productNoticeFoodType: "케이크류",
          productNoticeProducer: "스위트오더",
          productNoticeOrigin: "국내산",
          productNoticeAddress: "서울시 강남구 테헤란로 123",
          productNoticeManufactureDate: "2024-01-01",
          productNoticeExpirationDate: "제조일로부터 3일",
          productNoticePackageCapacity: "500g",
          productNoticePackageQuantity: "1개",
          productNoticeIngredients: "초콜릿, 밀가루, 설탕, 우유, 계란",
          productNoticeCalories: "칼로리: 350kcal, 탄수화물: 45g, 단백질: 5g, 지방: 15g",
          productNoticeSafetyNotice: "알레르기 주의: 우유, 계란, 밀 함유",
          productNoticeGmoNotice: "해당사항 없음",
          productNoticeImportNotice: "해당사항 없음",
          productNoticeCustomerService: "1588-1234",
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      }),
    ),
  );

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
  console.log(`✅ Created ${productLikes.length} product likes`);
  console.log(`✅ Created ${stores.length} stores`);
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
