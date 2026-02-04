import { PrismaClient } from "./generated/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.phoneVerification.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.productLike.deleteMany();
  await prisma.storeLike.deleteMany();
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
        profileImageUrl:
          "https://static-staging.sweetorders.com/uploads/2__1770124158308_b45059e5.jpeg",
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
          "https://static-staging.sweetorders.com/uploads/NYenL1720090515_1770124331535_5b9aa552.png",
        // 사업자 정보 (1단계)
        businessNo: "1198288946", // 정규화된 사업자등록번호 (하이픈 제거)
        representativeName: "홍길동",
        openingDate: "20230101",
        businessName: "스위트오더",
        businessSector: "도매 및 소매업",
        businessType: "전자상거래 소매 중개업",
        // 통신판매사업자 정보 (2단계)
        permissionManagementNumber: "2021-서울강동-0422",
        likeCount: 15,
        createdAt: new Date("2024-01-15T10:30:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z"),
      },
    }),
    prisma.store.create({
      data: {
        userId: users[0].id, // 같은 판매자의 두 번째 스토어
        name: "디저트 파라다이스",
        description: "다양한 디저트를 판매하는 스토어입니다.",
        logoImageUrl: "https://static-staging.sweetorders.com/uploads/.png_1770124350794_a40b9a07",
        // 사업자 정보 (1단계)
        businessNo: "1198288947",
        representativeName: "홍길동",
        openingDate: "20230201",
        businessName: "디저트 파라다이스",
        businessSector: "도매 및 소매업",
        businessType: "전자상거래 소매 중개업",
        // 통신판매사업자 정보 (2단계)
        permissionManagementNumber: "2021-서울강동-0423",
        likeCount: 8,
        createdAt: new Date("2024-01-16T10:30:00Z"),
        updatedAt: new Date("2024-01-16T10:30:00Z"),
      },
    }),
  ]);

  const storeLikes = await Promise.all([
    prisma.storeLike.create({
      data: {
        userId: users[1].id, // 두 번째 사용자가 첫 번째 스토어에 좋아요
        storeId: stores[0].id,
      },
    }),
    prisma.storeLike.create({
      data: {
        userId: users[2].id, // 세 번째 사용자가 첫 번째 스토어에 좋아요
        storeId: stores[0].id,
      },
    }),
    prisma.storeLike.create({
      data: {
        userId: users[3].id, // 네 번째 사용자가 첫 번째 스토어에 좋아요
        storeId: stores[0].id,
      },
    }),
  ]);

  // 100개의 상품 생성 (첫 번째 스토어에 70개, 두 번째 스토어에 30개)
  const products = await Promise.all(
    Array.from({ length: 100 }, (_, index) => {
      // 일부 상품은 BASIC_CAKE, 나머지는 CUSTOM_CAKE로 설정 (테스트 다양성을 위해)
      const imageUploadEnabled = index % 3 === 0 ? "DISABLE" : "ENABLE"; // 33%는 BASIC_CAKE, 67%는 CUSTOM_CAKE
      const productType = imageUploadEnabled === "ENABLE" ? "CUSTOM_CAKE" : "BASIC_CAKE";
      // 첫 번째 스토어에 70개, 두 번째 스토어에 30개 배분
      const storeIndex = index < 70 ? 0 : 1;

      return prisma.product.create({
        data: {
          storeId: stores[storeIndex].id, // 스토어 ID (첫 번째 또는 두 번째 스토어)
          name: "프리미엄 초콜릿 케이크",
          images: [
            "https://static-staging.sweetorders.com/uploads/1__1770124383061_4d54e9eb.jpeg",
            "https://static-staging.sweetorders.com/uploads/2__1770124399509_6f9e0688.jpeg",
          ],
          salePrice: 45000,
          salesStatus: "ENABLE",
          visibilityStatus: "ENABLE",
          likeCount: 25,
          // 케이크 옵션을 각각 JSON 배열로 저장
          cakeSizeOptions: [
            {
              id: "size_seed_mini",
              visible: "ENABLE",
              displayName: "미니",
              lengthCm: 10,
              price: 30000,
              description: "1~2인용",
            },
            {
              id: "size_seed_1ho",
              visible: "ENABLE",
              displayName: "1호",
              lengthCm: 15,
              price: 35000,
              description: "2~3인용",
            },
          ],
          cakeFlavorOptions: [
            {
              id: "flavor_seed_choco",
              visible: "ENABLE",
              displayName: "초콜릿",
              price: 2000,
            },
            {
              id: "flavor_seed_vanilla",
              visible: "ENABLE",
              displayName: "바닐라",
              price: 3000,
            },
          ],
          letteringVisible: "ENABLE",
          letteringRequired: "OPTIONAL",
          letteringMaxLength: 20,
          imageUploadEnabled,
          productType,
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
      });
    }),
  );

  const productLikes = await Promise.all([
    prisma.productLike.create({
      data: {
        userId: users[0].id,
        productId: products[0].id,
      },
    }),
  ]);

  // 상품 후기 생성 (각 상품당 3~5개의 후기)
  // 첫 번째 스토어의 상품 10개와 두 번째 스토어의 상품 5개에 후기 추가
  const reviews = [];
  // 첫 번째 스토어의 상품 10개에 후기 추가
  for (let i = 0; i < Math.min(70, 10); i++) {
    // 각 상품당 3~5개의 후기 생성
    const reviewCount = Math.floor(Math.random() * 3) + 3; // 3~5개
    for (let j = 0; j < reviewCount; j++) {
      const userIndex = Math.floor(Math.random() * users.length);
      const rating = Math.round((Math.random() * 4.5 + 0.5) * 10) / 10; // 0.5 ~ 5.0 (0.5 단위)
      const reviewContents = [
        "정말 맛있었어요! 다음에도 주문할게요.",
        "배송도 빠르고 상품도 좋아요. 추천합니다!",
        "생각보다 작았지만 맛은 좋았어요.",
        "가격 대비 만족도가 높아요.",
        "케이크가 너무 예뻐서 생일 파티에 완벽했어요!",
        "친구들이 다 맛있다고 했어요.",
        "다음에 또 주문할 예정입니다.",
        "포장도 깔끔하고 상품 상태도 좋았어요.",
      ];
      const content = reviewContents[Math.floor(Math.random() * reviewContents.length)];
      const imageCount = Math.floor(Math.random() * 3); // 0~2개의 이미지
      const imageUrls = Array.from(
        { length: imageCount },
        () => `https://static-staging.sweetorders.com/uploads/2__1770124399509_6f9e0688.jpeg`,
      );

      reviews.push(
        prisma.productReview.create({
          data: {
            productId: products[i].id,
            userId: users[userIndex].id,
            rating,
            content,
            imageUrls,
            createdAt: new Date(
              new Date("2024-01-01T00:00:00Z").getTime() +
                Math.random() * (new Date().getTime() - new Date("2024-01-01T00:00:00Z").getTime()),
            ),
          },
        }),
      );
    }
  }
  // 두 번째 스토어의 상품 5개에 후기 추가
  for (let i = 70; i < Math.min(products.length, 75); i++) {
    // 각 상품당 3~5개의 후기 생성
    const reviewCount = Math.floor(Math.random() * 3) + 3; // 3~5개
    for (let j = 0; j < reviewCount; j++) {
      const userIndex = Math.floor(Math.random() * users.length);
      const rating = Math.round((Math.random() * 4.5 + 0.5) * 10) / 10; // 0.5 ~ 5.0 (0.5 단위)
      const reviewContents = [
        "정말 맛있었어요! 다음에도 주문할게요.",
        "배송도 빠르고 상품도 좋아요. 추천합니다!",
        "생각보다 작았지만 맛은 좋았어요.",
        "가격 대비 만족도가 높아요.",
        "케이크가 너무 예뻐서 생일 파티에 완벽했어요!",
        "친구들이 다 맛있다고 했어요.",
        "다음에 또 주문할 예정입니다.",
        "포장도 깔끔하고 상품 상태도 좋았어요.",
      ];
      const content = reviewContents[Math.floor(Math.random() * reviewContents.length)];
      const imageCount = Math.floor(Math.random() * 3); // 0~2개의 이미지
      const imageUrls = Array.from(
        { length: imageCount },
        () => `https://static-staging.sweetorders.com/uploads/3__1770124435469_83ac03cc.jpeg`,
      );

      reviews.push(
        prisma.productReview.create({
          data: {
            productId: products[i].id,
            userId: users[userIndex].id,
            rating,
            content,
            imageUrls,
            createdAt: new Date(
              new Date("2024-01-01T00:00:00Z").getTime() +
                Math.random() * (new Date().getTime() - new Date("2024-01-01T00:00:00Z").getTime()),
            ),
          },
        }),
      );
    }
  }
  const createdReviews = await Promise.all(reviews);

  console.log(`✅ Created ${users.length} users`);
  console.log(`✅ Created ${phoneVerifications.length} phone verifications`);
  console.log(`✅ Created ${products.length} products`);
  console.log(`✅ Created ${productLikes.length} product likes`);
  console.log(`✅ Created ${createdReviews.length} product reviews`);
  console.log(`✅ Created ${stores.length} stores`);
  console.log(`✅ Created ${storeLikes.length} store likes`);
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
