import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// 시드 데이터 생성의 메인 로직 담당
async function main() {
  // 기존 데이터 정리
  await prisma.phoneVerification.deleteMany();
  await prisma.productLike.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
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

  /* ------------------------ 상품 데이터 생성 ------------------------ */
  const products = await Promise.all([
    // 1. 초콜릿 케이크
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
          fields: [
            {
              id: "deliveryMethod",
              type: "select",
              label: "수령 방법",
              required: true,
              options: [
                {
                  value: "delivery_cod",
                  label: "택배 착불",
                  price: 0,
                  description: "수령 시 배송비 결제",
                },
                {
                  value: "delivery_prepaid",
                  label: "택배 선불",
                  price: 3000,
                  description: "주문 시 배송비 결제",
                },
                {
                  value: "pickup",
                  label: "직접 수령(지역 픽업)",
                  price: 0,
                  description: "매장에서 직접 픽업",
                },
                {
                  value: "delivery_free",
                  label: "택배 50,000원 이상 무료배송",
                  price: 0,
                  description: "50,000원 이상 구매 시 무료",
                },
              ],
            },
            {
              id: "pickupDateTime",
              type: "datetime-local",
              label: "픽업 날짜시간",
              required: true,
              minDate: "today",
              maxDate: "+30days",
              description: "직접 수령 시 픽업 날짜와 시간을 선택해주세요",
            },
            {
              id: "size",
              type: "select",
              label: "사이즈 선택",
              required: true,
              options: [
                { value: "1호", label: "1호", price: 0 },
                { value: "2호", label: "2호", price: 10000 },
                { value: "3호", label: "3호", price: 20000 },
              ],
            },
            {
              id: "flavor",
              type: "select",
              label: "맛 선택",
              required: true,
              options: [
                { value: "chocolate", label: "초코", price: 0 },
                { value: "vanilla", label: "바닐라", price: 0 },
                { value: "strawberry", label: "딸기", price: 3000 },
              ],
            },
            {
              id: "cakeMessage",
              type: "text",
              label: "케이크 문구입력",
              required: true,
              placeholder: "예: 생일 축하해요!",
              maxLength: 20,
              description: "케이크에 새길 메시지를 입력해주세요 (최대 20자)",
            },
            {
              id: "additionalProducts",
              type: "checkbox",
              label: "추가 구성 상품",
              required: true,
              options: [
                { value: "cakeBox", label: "케이크상자", price: 2000 },
                { value: "candles", label: "캔들 추가", price: 3000 },
                { value: "topper", label: "케이크 토퍼", price: 5000 },
                { value: "messagePlate", label: "글씨 문구 추가", price: 4000 },
              ],
            },
            {
              id: "additionalRequest",
              type: "textarea",
              label: "추가요청",
              required: false,
              placeholder: "특별한 요청사항이 있으시면 입력해주세요",
              maxLength: 200,
              description: "알레르기, 특별한 요청사항 등을 자유롭게 입력해주세요",
            },
          ],
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

    // 2. 딸기 케이크
    prisma.product.create({
      data: {
        name: "신선한 딸기 케이크",
        description: "국내산 신선한 딸기로 만든 시원한 케이크입니다.",
        originalPrice: 40000,
        salePrice: 35000,
        notice: "딸기 시즌에만 제작 가능",
        caution: "알레르기 주의: 우유, 계란, 밀, 딸기 함유",
        basicIncluded: "케이크, 촛불, 포크",
        location: "서울시 강남구",
        likeCount: 18,
        orderFormSchema: {
          title: "딸기 케이크 커스터마이징",
          description: "딸기 케이크 옵션을 선택해주세요",
          fields: [
            {
              id: "size",
              type: "select",
              label: "사이즈 선택",
              required: true,
              options: [
                { value: "1호", label: "1호", price: 0 },
                { value: "2호", label: "2호", price: 8000 },
              ],
            },
            {
              id: "strawberryAmount",
              type: "select",
              label: "딸기 양",
              required: true,
              options: [
                { value: "normal", label: "기본", price: 0 },
                { value: "extra", label: "딸기 추가", price: 5000 },
              ],
            },
          ],
        },
        detailDescription: "<p>신선한 딸기로 만든 시원한 케이크입니다.</p>",
        productNumber: "CAKE-002",
        foodType: "케이크류",
        producer: "스위트오더",
        manufactureDate: "제조일로부터 2일",
        packageInfo: "1개",
        calories: "280kcal",
        ingredients: "딸기, 밀가루, 설탕, 우유, 계란",
        origin: "국내산",
        customerService: "1588-1234",
        mainCategory: ["PRODUCT"],
        subCategory: ["CAKE"],
        targetAudience: ["ADULT", "CHILD"],
        sizeRange: ["ONE_TO_TWO", "TWO_TO_THREE"],
        deliveryMethod: ["PICKUP", "DELIVERY"],
        deliveryDays: ["SAME_DAY", "ONE_TO_TWO"],
        hashtags: ["케이크", "딸기", "신선", "여름"],
        status: "ACTIVE",
        createdAt: new Date("2024-01-02T00:00:00Z"),
        updatedAt: new Date("2024-01-02T00:00:00Z"),
      },
    }),

    // 3. 생일 케이크
    prisma.product.create({
      data: {
        name: "특별한 생일 케이크",
        description: "생일을 더욱 특별하게 만들어줄 프리미엄 생일 케이크입니다.",
        originalPrice: 60000,
        salePrice: 55000,
        notice: "생일 당일 픽업 가능",
        caution: "알레르기 주의: 우유, 계란, 밀 함유",
        basicIncluded: "케이크, 촛불, 포크, 생일 모자",
        location: "서울시 강남구",
        likeCount: 32,
        orderFormSchema: {
          title: "생일 케이크 커스터마이징",
          description: "생일 케이크를 특별하게 만들어보세요",
          fields: [
            {
              id: "age",
              type: "number",
              label: "나이",
              required: true,
              min: 1,
              max: 100,
              description: "생일자의 나이를 입력해주세요",
            },
            {
              id: "birthdayMessage",
              type: "text",
              label: "생일 메시지",
              required: true,
              placeholder: "예: 생일 축하해요!",
              maxLength: 30,
            },
            {
              id: "decoration",
              type: "select",
              label: "장식 스타일",
              required: true,
              options: [
                { value: "simple", label: "심플", price: 0 },
                { value: "fancy", label: "화려한", price: 10000 },
                { value: "premium", label: "프리미엄", price: 20000 },
              ],
            },
          ],
        },
        detailDescription: "<p>생일을 더욱 특별하게 만들어줄 프리미엄 케이크입니다.</p>",
        productNumber: "CAKE-003",
        foodType: "케이크류",
        producer: "스위트오더",
        manufactureDate: "제조일로부터 3일",
        packageInfo: "1개",
        calories: "400kcal",
        ingredients: "밀가루, 설탕, 우유, 계란, 크림",
        origin: "국내산",
        customerService: "1588-1234",
        mainCategory: ["PRODUCT"],
        subCategory: ["CAKE"],
        targetAudience: ["ADULT", "CHILD"],
        sizeRange: ["TWO_TO_THREE", "THREE_TO_FOUR", "FOUR_TO_FIVE"],
        deliveryMethod: ["PICKUP", "DELIVERY"],
        deliveryDays: ["SAME_DAY", "ONE_TO_TWO"],
        hashtags: ["케이크", "생일", "특별", "기념일"],
        status: "ACTIVE",
        createdAt: new Date("2024-01-03T00:00:00Z"),
        updatedAt: new Date("2024-01-03T00:00:00Z"),
      },
    }),

    // 4. 품절 상품 (테스트용)
    prisma.product.create({
      data: {
        name: "한정판 초콜릿 케이크",
        description: "한정판으로 제작되는 특별한 초콜릿 케이크입니다.",
        originalPrice: 80000,
        salePrice: 75000,
        notice: "한정판 상품으로 수량 제한",
        caution: "알레르기 주의: 우유, 계란, 밀 함유",
        basicIncluded: "케이크, 촛불, 포크, 특별 포장",
        location: "서울시 강남구",
        likeCount: 45,
        orderFormSchema: {
          title: "한정판 케이크 주문",
          description: "한정판 케이크 옵션을 선택해주세요",
          fields: [
            {
              id: "specialMessage",
              type: "text",
              label: "특별 메시지",
              required: true,
              placeholder: "특별한 메시지를 입력해주세요",
              maxLength: 50,
            },
          ],
        },
        detailDescription: "<p>한정판으로 제작되는 특별한 초콜릿 케이크입니다.</p>",
        productNumber: "CAKE-004",
        foodType: "케이크류",
        producer: "스위트오더",
        manufactureDate: "제조일로부터 5일",
        packageInfo: "1개",
        calories: "450kcal",
        ingredients: "프리미엄 초콜릿, 밀가루, 설탕, 우유, 계란",
        origin: "국내산",
        customerService: "1588-1234",
        mainCategory: ["PRODUCT"],
        subCategory: ["CAKE"],
        targetAudience: ["ADULT"],
        sizeRange: ["TWO_TO_THREE", "THREE_TO_FOUR"],
        deliveryMethod: ["PICKUP", "DELIVERY"],
        deliveryDays: ["TWO_TO_THREE", "THREE_TO_FOUR"],
        hashtags: ["케이크", "초콜릿", "한정판", "특별"],
        status: "OUT_OF_STOCK",
        createdAt: new Date("2024-01-04T00:00:00Z"),
        updatedAt: new Date("2024-01-04T00:00:00Z"),
      },
    }),

    // 5. 판매중지 상품 (테스트용)
    prisma.product.create({
      data: {
        name: "시즌 한정 바나나 케이크",
        description: "바나나 시즌에만 제작되는 특별한 케이크입니다.",
        originalPrice: 35000,
        salePrice: 30000,
        notice: "바나나 시즌 종료로 판매 중지",
        caution: "알레르기 주의: 우유, 계란, 밀, 바나나 함유",
        basicIncluded: "케이크, 촛불, 포크",
        location: "서울시 강남구",
        likeCount: 12,
        orderFormSchema: {
          title: "바나나 케이크 주문",
          description: "바나나 케이크 옵션을 선택해주세요",
          fields: [
            {
              id: "bananaRipeness",
              type: "select",
              label: "바나나 익힘 정도",
              required: true,
              options: [
                { value: "normal", label: "보통", price: 0 },
                { value: "ripe", label: "잘 익은", price: 0 },
              ],
            },
          ],
        },
        detailDescription: "<p>바나나 시즌에만 제작되는 특별한 케이크입니다.</p>",
        productNumber: "CAKE-005",
        foodType: "케이크류",
        producer: "스위트오더",
        manufactureDate: "제조일로부터 2일",
        packageInfo: "1개",
        calories: "320kcal",
        ingredients: "바나나, 밀가루, 설탕, 우유, 계란",
        origin: "국내산",
        customerService: "1588-1234",
        mainCategory: ["PRODUCT"],
        subCategory: ["CAKE"],
        targetAudience: ["ADULT", "CHILD"],
        sizeRange: ["ONE_TO_TWO", "TWO_TO_THREE"],
        deliveryMethod: ["PICKUP", "DELIVERY"],
        deliveryDays: ["ONE_TO_TWO", "TWO_TO_THREE"],
        hashtags: ["케이크", "바나나", "시즌", "한정"],
        status: "INACTIVE",
        createdAt: new Date("2024-01-05T00:00:00Z"),
        updatedAt: new Date("2024-01-05T00:00:00Z"),
      },
    }),
  ]);

  /* ------------------------ 상품 이미지 데이터 생성 ------------------------ */
  const productImages = await Promise.all([
    // 초콜릿 케이크 이미지들
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/chocolate-cake-1.jpg",
        alt: "초콜릿 케이크 메인 이미지",
        order: 1,
        productId: products[0].id,
      },
    }),
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/chocolate-cake-2.jpg",
        alt: "초콜릿 케이크 사이드 이미지",
        order: 2,
        productId: products[0].id,
      },
    }),
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/chocolate-cake-3.jpg",
        alt: "초콜릿 케이크 상세 이미지",
        order: 3,
        productId: products[0].id,
      },
    }),

    // 딸기 케이크 이미지들
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/strawberry-cake-1.jpg",
        alt: "딸기 케이크 메인 이미지",
        order: 1,
        productId: products[1].id,
      },
    }),
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/strawberry-cake-2.jpg",
        alt: "딸기 케이크 사이드 이미지",
        order: 2,
        productId: products[1].id,
      },
    }),

    // 생일 케이크 이미지들
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/birthday-cake-1.jpg",
        alt: "생일 케이크 메인 이미지",
        order: 1,
        productId: products[2].id,
      },
    }),
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/birthday-cake-2.jpg",
        alt: "생일 케이크 사이드 이미지",
        order: 2,
        productId: products[2].id,
      },
    }),
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/birthday-cake-3.jpg",
        alt: "생일 케이크 상세 이미지",
        order: 3,
        productId: products[2].id,
      },
    }),

    // 한정판 케이크 이미지들
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/limited-cake-1.jpg",
        alt: "한정판 케이크 메인 이미지",
        order: 1,
        productId: products[3].id,
      },
    }),

    // 바나나 케이크 이미지들
    prisma.productImage.create({
      data: {
        url: "https://example.com/images/banana-cake-1.jpg",
        alt: "바나나 케이크 메인 이미지",
        order: 1,
        productId: products[4].id,
      },
    }),
  ]);

  /* ------------------------ 상품 좋아요 데이터 생성 ------------------------ */
  const productLikes = await Promise.all([
    // user001이 초콜릿 케이크와 생일 케이크를 좋아요
    prisma.productLike.create({
      data: {
        userId: users[0].id,
        productId: products[0].id,
      },
    }),
    prisma.productLike.create({
      data: {
        userId: users[0].id,
        productId: products[2].id,
      },
    }),

    // user002가 딸기 케이크를 좋아요
    prisma.productLike.create({
      data: {
        userId: users[1].id,
        productId: products[1].id,
      },
    }),

    // user003이 초콜릿 케이크와 한정판 케이크를 좋아요
    prisma.productLike.create({
      data: {
        userId: users[2].id,
        productId: products[0].id,
      },
    }),
    prisma.productLike.create({
      data: {
        userId: users[2].id,
        productId: products[3].id,
      },
    }),

    // user004가 모든 케이크를 좋아요
    prisma.productLike.create({
      data: {
        userId: users[3].id,
        productId: products[0].id,
      },
    }),
    prisma.productLike.create({
      data: {
        userId: users[3].id,
        productId: products[1].id,
      },
    }),
    prisma.productLike.create({
      data: {
        userId: users[3].id,
        productId: products[2].id,
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

// 시드 데이터 생성 실행
main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
