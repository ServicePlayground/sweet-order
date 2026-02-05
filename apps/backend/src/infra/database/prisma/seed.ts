import { PrismaClient } from "./generated/client";
import * as bcrypt from "bcrypt";
import {
  SEED_PRODUCT_BASE,
  SEED_PRODUCT_IMAGES,
  SEED_REVIEW_CONTENTS,
} from "../../modules/product/constants/product.constants";
import { SEED_STORES } from "../../modules/store/constants/store.constants";
import {
  SEED_PHONE_VERIFICATIONS,
  SEED_USERS,
} from "../../modules/auth/constants/auth.constants";

const prisma = new PrismaClient();

async function upsertSeedUsers() {
  const hashedPassword1 = await bcrypt.hash(SEED_USERS.USER1.PASSWORD, 12);
  const hashedPassword2 = await bcrypt.hash(SEED_USERS.USER2.PASSWORD, 12);

  const user1 = await prisma.user.upsert({
    where: { userId: SEED_USERS.USER1.USER_ID },
    update: {
      role: "SELLER",
      phone: SEED_USERS.USER1.PHONE,
      passwordHash: hashedPassword1,
      name: SEED_USERS.USER1.NAME,
      nickname: SEED_USERS.USER1.NICKNAME,
      email: SEED_USERS.USER1.EMAIL,
      profileImageUrl: SEED_USERS.USER1.PROFILE_IMAGE_URL,
      isPhoneVerified: true,
      isActive: true,
    },
    create: {
      userId: SEED_USERS.USER1.USER_ID,
      role: "SELLER",
      phone: SEED_USERS.USER1.PHONE,
      passwordHash: hashedPassword1,
      name: SEED_USERS.USER1.NAME,
      nickname: SEED_USERS.USER1.NICKNAME,
      email: SEED_USERS.USER1.EMAIL,
      profileImageUrl: SEED_USERS.USER1.PROFILE_IMAGE_URL,
      isPhoneVerified: true,
      isActive: true,
      createdAt: SEED_USERS.USER1.CREATED_AT,
      lastLoginAt: SEED_USERS.USER1.LAST_LOGIN_AT,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { userId: SEED_USERS.USER2.USER_ID },
    update: {
      phone: SEED_USERS.USER2.PHONE,
      passwordHash: hashedPassword2,
      isPhoneVerified: true,
      isActive: true,
    },
    create: {
      userId: SEED_USERS.USER2.USER_ID,
      phone: SEED_USERS.USER2.PHONE,
      passwordHash: hashedPassword2,
      isPhoneVerified: true,
      isActive: true,
      createdAt: SEED_USERS.USER2.CREATED_AT,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { phone: SEED_USERS.USER3.PHONE },
    update: {
      googleId: SEED_USERS.USER3.GOOGLE_ID,
      googleEmail: SEED_USERS.USER3.GOOGLE_EMAIL,
      isPhoneVerified: true,
      isActive: true,
    },
    create: {
      phone: SEED_USERS.USER3.PHONE,
      googleId: SEED_USERS.USER3.GOOGLE_ID,
      googleEmail: SEED_USERS.USER3.GOOGLE_EMAIL,
      isPhoneVerified: true,
      isActive: true,
      createdAt: SEED_USERS.USER3.CREATED_AT,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { userId: SEED_USERS.USER4.USER_ID },
    update: {
      phone: SEED_USERS.USER4.PHONE,
      passwordHash: hashedPassword1,
      googleId: SEED_USERS.USER4.GOOGLE_ID,
      googleEmail: SEED_USERS.USER4.GOOGLE_EMAIL,
      isPhoneVerified: true,
      isActive: true,
    },
    create: {
      userId: SEED_USERS.USER4.USER_ID,
      phone: SEED_USERS.USER4.PHONE,
      passwordHash: hashedPassword1,
      googleId: SEED_USERS.USER4.GOOGLE_ID,
      googleEmail: SEED_USERS.USER4.GOOGLE_EMAIL,
      isPhoneVerified: true,
      isActive: true,
      createdAt: SEED_USERS.USER4.CREATED_AT,
    },
  });

  return [user1, user2, user3, user4];
}

async function seedPhoneVerifications() {
  const created: number[] = [];

  for (const data of SEED_PHONE_VERIFICATIONS) {
    const exists = await prisma.phoneVerification.findFirst({
      where: {
        phone: data.phone,
        verificationCode: data.verificationCode,
      },
    });

    if (!exists) {
      await prisma.phoneVerification.create({ data });
      created.push(1);
    }
  }

  return created.length;
}

async function upsertStores(users: Awaited<ReturnType<typeof upsertSeedUsers>>) {
  const [seller] = users;

  const store1 = await prisma.store.upsert({
    where: {
      userId_businessNo_permissionManagementNumber: {
        userId: seller.id,
        businessNo: SEED_STORES.STORE1.BUSINESS_NO,
        permissionManagementNumber: SEED_STORES.STORE1.PERMISSION_MANAGEMENT_NUMBER,
      },
    },
    update: {
      name: SEED_STORES.STORE1.NAME,
      description: SEED_STORES.STORE1.DESCRIPTION,
      logoImageUrl: SEED_STORES.STORE1.LOGO_IMAGE_URL,
      address: SEED_STORES.STORE1.ADDRESS,
      roadAddress: SEED_STORES.STORE1.ROAD_ADDRESS,
      zonecode: SEED_STORES.STORE1.ZONECODE,
      latitude: SEED_STORES.STORE1.LATITUDE,
      longitude: SEED_STORES.STORE1.LONGITUDE,
      businessName: SEED_STORES.STORE1.BUSINESS_NAME,
      businessSector: SEED_STORES.STORE1.BUSINESS_SECTOR,
      businessType: SEED_STORES.STORE1.BUSINESS_TYPE,
      representativeName: SEED_STORES.STORE1.REPRESENTATIVE_NAME,
      openingDate: SEED_STORES.STORE1.OPENING_DATE,
      likeCount: SEED_STORES.STORE1.LIKE_COUNT,
    },
    create: {
      userId: seller.id,
      name: SEED_STORES.STORE1.NAME,
      description: SEED_STORES.STORE1.DESCRIPTION,
      logoImageUrl: SEED_STORES.STORE1.LOGO_IMAGE_URL,
      address: SEED_STORES.STORE1.ADDRESS,
      roadAddress: SEED_STORES.STORE1.ROAD_ADDRESS,
      zonecode: SEED_STORES.STORE1.ZONECODE,
      latitude: SEED_STORES.STORE1.LATITUDE,
      longitude: SEED_STORES.STORE1.LONGITUDE,
      businessNo: SEED_STORES.STORE1.BUSINESS_NO,
      representativeName: SEED_STORES.STORE1.REPRESENTATIVE_NAME,
      openingDate: SEED_STORES.STORE1.OPENING_DATE,
      businessName: SEED_STORES.STORE1.BUSINESS_NAME,
      businessSector: SEED_STORES.STORE1.BUSINESS_SECTOR,
      businessType: SEED_STORES.STORE1.BUSINESS_TYPE,
      permissionManagementNumber: SEED_STORES.STORE1.PERMISSION_MANAGEMENT_NUMBER,
      likeCount: SEED_STORES.STORE1.LIKE_COUNT,
      createdAt: SEED_STORES.STORE1.CREATED_AT,
      updatedAt: SEED_STORES.STORE1.UPDATED_AT,
    },
  });

  const store2 = await prisma.store.upsert({
    where: {
      userId_businessNo_permissionManagementNumber: {
        userId: seller.id,
        businessNo: SEED_STORES.STORE2.BUSINESS_NO,
        permissionManagementNumber: SEED_STORES.STORE2.PERMISSION_MANAGEMENT_NUMBER,
      },
    },
    update: {
      name: SEED_STORES.STORE2.NAME,
      description: SEED_STORES.STORE2.DESCRIPTION,
      logoImageUrl: SEED_STORES.STORE2.LOGO_IMAGE_URL,
      address: SEED_STORES.STORE2.ADDRESS,
      roadAddress: SEED_STORES.STORE2.ROAD_ADDRESS,
      zonecode: SEED_STORES.STORE2.ZONECODE,
      latitude: SEED_STORES.STORE2.LATITUDE,
      longitude: SEED_STORES.STORE2.LONGITUDE,
      businessName: SEED_STORES.STORE2.BUSINESS_NAME,
      businessSector: SEED_STORES.STORE2.BUSINESS_SECTOR,
      businessType: SEED_STORES.STORE2.BUSINESS_TYPE,
      representativeName: SEED_STORES.STORE2.REPRESENTATIVE_NAME,
      openingDate: SEED_STORES.STORE2.OPENING_DATE,
      likeCount: SEED_STORES.STORE2.LIKE_COUNT,
    },
    create: {
      userId: seller.id,
      name: SEED_STORES.STORE2.NAME,
      description: SEED_STORES.STORE2.DESCRIPTION,
      logoImageUrl: SEED_STORES.STORE2.LOGO_IMAGE_URL,
      address: SEED_STORES.STORE2.ADDRESS,
      roadAddress: SEED_STORES.STORE2.ROAD_ADDRESS,
      zonecode: SEED_STORES.STORE2.ZONECODE,
      latitude: SEED_STORES.STORE2.LATITUDE,
      longitude: SEED_STORES.STORE2.LONGITUDE,
      businessNo: SEED_STORES.STORE2.BUSINESS_NO,
      representativeName: SEED_STORES.STORE2.REPRESENTATIVE_NAME,
      openingDate: SEED_STORES.STORE2.OPENING_DATE,
      businessName: SEED_STORES.STORE2.BUSINESS_NAME,
      businessSector: SEED_STORES.STORE2.BUSINESS_SECTOR,
      businessType: SEED_STORES.STORE2.BUSINESS_TYPE,
      permissionManagementNumber: SEED_STORES.STORE2.PERMISSION_MANAGEMENT_NUMBER,
      likeCount: SEED_STORES.STORE2.LIKE_COUNT,
      createdAt: SEED_STORES.STORE2.CREATED_AT,
      updatedAt: SEED_STORES.STORE2.UPDATED_AT,
    },
  });

  return [store1, store2];
}

async function upsertStoreLikes(users: Awaited<ReturnType<typeof upsertSeedUsers>>, stores: Awaited<ReturnType<typeof upsertStores>>) {
  const [, user2, user3, user4] = users;
  const [store1] = stores;

  await prisma.storeLike.upsert({
    where: {
      userId_storeId: {
        userId: user2.id,
        storeId: store1.id,
      },
    },
    update: {},
    create: {
      userId: user2.id,
      storeId: store1.id,
    },
  });

  await prisma.storeLike.upsert({
    where: {
      userId_storeId: {
        userId: user3.id,
        storeId: store1.id,
      },
    },
    update: {},
    create: {
      userId: user3.id,
      storeId: store1.id,
    },
  });

  await prisma.storeLike.upsert({
    where: {
      userId_storeId: {
        userId: user4.id,
        storeId: store1.id,
      },
    },
    update: {},
    create: {
      userId: user4.id,
      storeId: store1.id,
    },
  });
}

async function upsertProducts(stores: Awaited<ReturnType<typeof upsertStores>>) {
  const [store1, store2] = stores;
  const products = [];

  for (let index = 0; index < 100; index++) {
    const imageUploadEnabled = index % 3 === 0 ? "DISABLE" : "ENABLE";
    const productType = imageUploadEnabled === "ENABLE" ? "CUSTOM_CAKE" : "BASIC_CAKE";
    const storeIndex = index < 70 ? 0 : 1;
    const targetStore = storeIndex === 0 ? store1 : store2;
    const productNumber = `20240101-${String(index + 1).padStart(3, "0")}`;

    const existing = await prisma.product.findFirst({
      where: { productNumber },
    });

    if (existing) {
      const updated = await prisma.product.update({
        where: { id: existing.id },
        data: {
          storeId: targetStore.id,
          name: SEED_PRODUCT_BASE.NAME,
          images: SEED_PRODUCT_BASE.IMAGES,
          salePrice: SEED_PRODUCT_BASE.SALE_PRICE,
          salesStatus: "ENABLE",
          visibilityStatus: "ENABLE",
          likeCount: existing.likeCount ?? 25,
          cakeSizeOptions: SEED_PRODUCT_BASE.SIZE_OPTIONS,
          cakeFlavorOptions: SEED_PRODUCT_BASE.FLAVOR_OPTIONS,
          letteringVisible: SEED_PRODUCT_BASE.LETTERING.VISIBLE,
          letteringRequired: SEED_PRODUCT_BASE.LETTERING.REQUIRED,
          letteringMaxLength: SEED_PRODUCT_BASE.LETTERING.MAX_LENGTH,
          imageUploadEnabled,
          productType,
          detailDescription: SEED_PRODUCT_BASE.DETAIL_DESCRIPTION,
          productNoticeFoodType: SEED_PRODUCT_BASE.PRODUCT_NOTICE.FOOD_TYPE,
          productNoticeProducer: SEED_PRODUCT_BASE.PRODUCT_NOTICE.PRODUCER,
          productNoticeOrigin: SEED_PRODUCT_BASE.PRODUCT_NOTICE.ORIGIN,
          productNoticeAddress: SEED_PRODUCT_BASE.PRODUCT_NOTICE.ADDRESS,
          productNoticeManufactureDate: SEED_PRODUCT_BASE.PRODUCT_NOTICE.MANUFACTURE_DATE,
          productNoticeExpirationDate: SEED_PRODUCT_BASE.PRODUCT_NOTICE.EXPIRATION_DATE,
          productNoticePackageCapacity: SEED_PRODUCT_BASE.PRODUCT_NOTICE.PACKAGE_CAPACITY,
          productNoticePackageQuantity: SEED_PRODUCT_BASE.PRODUCT_NOTICE.PACKAGE_QUANTITY,
          productNoticeIngredients: SEED_PRODUCT_BASE.PRODUCT_NOTICE.INGREDIENTS,
          productNoticeCalories: SEED_PRODUCT_BASE.PRODUCT_NOTICE.CALORIES,
          productNoticeSafetyNotice: SEED_PRODUCT_BASE.PRODUCT_NOTICE.SAFETY_NOTICE,
          productNoticeGmoNotice: SEED_PRODUCT_BASE.PRODUCT_NOTICE.GMO_NOTICE,
          productNoticeImportNotice: SEED_PRODUCT_BASE.PRODUCT_NOTICE.IMPORT_NOTICE,
          productNoticeCustomerService: SEED_PRODUCT_BASE.PRODUCT_NOTICE.CUSTOMER_SERVICE,
        },
      });
      products.push(updated);
    } else {
      const created = await prisma.product.create({
        data: {
          storeId: targetStore.id,
          name: SEED_PRODUCT_BASE.NAME,
          images: SEED_PRODUCT_BASE.IMAGES,
          salePrice: SEED_PRODUCT_BASE.SALE_PRICE,
          salesStatus: "ENABLE",
          visibilityStatus: "ENABLE",
          likeCount: 25,
          cakeSizeOptions: SEED_PRODUCT_BASE.SIZE_OPTIONS,
          cakeFlavorOptions: SEED_PRODUCT_BASE.FLAVOR_OPTIONS,
          letteringVisible: SEED_PRODUCT_BASE.LETTERING.VISIBLE,
          letteringRequired: SEED_PRODUCT_BASE.LETTERING.REQUIRED,
          letteringMaxLength: SEED_PRODUCT_BASE.LETTERING.MAX_LENGTH,
          imageUploadEnabled,
          productType,
          detailDescription: SEED_PRODUCT_BASE.DETAIL_DESCRIPTION,
          productNumber,
          productNoticeFoodType: SEED_PRODUCT_BASE.PRODUCT_NOTICE.FOOD_TYPE,
          productNoticeProducer: SEED_PRODUCT_BASE.PRODUCT_NOTICE.PRODUCER,
          productNoticeOrigin: SEED_PRODUCT_BASE.PRODUCT_NOTICE.ORIGIN,
          productNoticeAddress: SEED_PRODUCT_BASE.PRODUCT_NOTICE.ADDRESS,
          productNoticeManufactureDate: SEED_PRODUCT_BASE.PRODUCT_NOTICE.MANUFACTURE_DATE,
          productNoticeExpirationDate: SEED_PRODUCT_BASE.PRODUCT_NOTICE.EXPIRATION_DATE,
          productNoticePackageCapacity: SEED_PRODUCT_BASE.PRODUCT_NOTICE.PACKAGE_CAPACITY,
          productNoticePackageQuantity: SEED_PRODUCT_BASE.PRODUCT_NOTICE.PACKAGE_QUANTITY,
          productNoticeIngredients: SEED_PRODUCT_BASE.PRODUCT_NOTICE.INGREDIENTS,
          productNoticeCalories: SEED_PRODUCT_BASE.PRODUCT_NOTICE.CALORIES,
          productNoticeSafetyNotice: SEED_PRODUCT_BASE.PRODUCT_NOTICE.SAFETY_NOTICE,
          productNoticeGmoNotice: SEED_PRODUCT_BASE.PRODUCT_NOTICE.GMO_NOTICE,
          productNoticeImportNotice: SEED_PRODUCT_BASE.PRODUCT_NOTICE.IMPORT_NOTICE,
          productNoticeCustomerService: SEED_PRODUCT_BASE.PRODUCT_NOTICE.CUSTOMER_SERVICE,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      });
      products.push(created);
    }
  }

  return products;
}

async function seedProductLikes(users: Awaited<ReturnType<typeof upsertSeedUsers>>, products: Awaited<ReturnType<typeof upsertProducts>>) {
  const [user1] = users;
  const [firstProduct] = products;

  if (!firstProduct) return 0;

  await prisma.productLike.upsert({
    where: {
      userId_productId: {
        userId: user1.id,
        productId: firstProduct.id,
      },
    },
    update: {},
    create: {
      userId: user1.id,
      productId: firstProduct.id,
    },
  });

  return 1;
}

async function seedProductReviews(
  users: Awaited<ReturnType<typeof upsertSeedUsers>>,
  products: Awaited<ReturnType<typeof upsertProducts>>,
) {
  // 이미 어느 정도 리뷰가 있으면 추가로 만들지 않아서 중복 폭발을 막는다.
  const existingReviewCount = await prisma.productReview.count();
  if (existingReviewCount > 0) {
    return 0;
  }

  const reviews = [];

  // 첫 번째 스토어의 상품 10개에 후기 추가
  const firstStoreProducts = products.slice(0, Math.min(70, 10));
  for (const product of firstStoreProducts) {
    const reviewCount = Math.floor(Math.random() * 3) + 3; // 3~5개
    for (let j = 0; j < reviewCount; j++) {
      const userIndex = Math.floor(Math.random() * users.length);
      const rating = Math.round((Math.random() * 4.5 + 0.5) * 10) / 10;
      const content =
        SEED_REVIEW_CONTENTS[Math.floor(Math.random() * SEED_REVIEW_CONTENTS.length)];
      const imageCount = Math.floor(Math.random() * 3); // 0~2개의 이미지
      const imageUrls = Array.from(
        { length: imageCount },
        () => SEED_PRODUCT_IMAGES.FIRST_STORE_REVIEW_IMAGE,
      );

      reviews.push(
        prisma.productReview.create({
          data: {
            productId: product.id,
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
  const secondStoreSamples = products.slice(70, Math.min(products.length, 75));
  for (const product of secondStoreSamples) {
    const reviewCount = Math.floor(Math.random() * 3) + 3; // 3~5개
    for (let j = 0; j < reviewCount; j++) {
      const userIndex = Math.floor(Math.random() * users.length);
      const rating = Math.round((Math.random() * 4.5 + 0.5) * 10) / 10;
      const content =
        SEED_REVIEW_CONTENTS[Math.floor(Math.random() * SEED_REVIEW_CONTENTS.length)];
      const imageCount = Math.floor(Math.random() * 3); // 0~2개의 이미지
      const imageUrls = Array.from(
        { length: imageCount },
        () => SEED_PRODUCT_IMAGES.SECOND_STORE_REVIEW_IMAGE,
      );

      reviews.push(
        prisma.productReview.create({
          data: {
            productId: product.id,
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
  return createdReviews.length;
}

async function main() {
  const users = await upsertSeedUsers();
  const phoneVerificationCreatedCount = await seedPhoneVerifications();
  const stores = await upsertStores(users);
  await upsertStoreLikes(users, stores);
  const products = await upsertProducts(stores);
  const productLikeCreatedCount = await seedProductLikes(users, products);
  const reviewCreatedCount = await seedProductReviews(users, products);

  const storeLikesCount = await prisma.storeLike.count({
    where: {
      storeId: { in: stores.map((s) => s.id) },
    },
  });

  console.log(`✅ Seed users upserted: ${users.length}`);
  console.log(`✅ Phone verifications created (new only): ${phoneVerificationCreatedCount}`);
  console.log(`✅ Stores upserted: ${stores.length}`);
  console.log(`✅ Products upserted/created: ${products.length}`);
  console.log(`✅ Product likes created/upserted: ${productLikeCreatedCount}`);
  console.log(`✅ Store likes total (for seeded stores): ${storeLikesCount}`);
  console.log(`✅ Product reviews created (if none existed): ${reviewCreatedCount}`);
  console.log("🎉 Database seeding (idempotent) completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
