# 매핑 로직 리팩토링 가이드

## 📋 목차

1. [개요](#개요)
2. [Product 모듈](#product-모듈)
3. [Store 모듈](#store-모듈)
4. [Chat 모듈](#chat-모듈)
5. [공통 개선 사항](#공통-개선-사항)

---

## 개요

### 왜 리팩토링했나요?

기존 코드에서 다음과 같은 문제점들이 있었습니다:

1. **코드 중복**: 각 서비스 메서드마다 동일한 매핑 로직이 반복됨
2. **일관성 부족**: 같은 데이터를 다른 방식으로 매핑하는 경우 발생
3. **유지보수 어려움**: 매핑 로직 변경 시 여러 곳을 수정해야 함
4. **성능 문제**: N+1 쿼리 문제로 인한 성능 저하

> **💡 N+1 쿼리 문제란?**
> 
> 여러 개의 데이터를 조회할 때, 각 데이터마다 추가 쿼리를 실행하는 문제입니다.
> 
> **예시**: 스토어 10개를 조회하는 경우
> - **1번**: 스토어 목록 조회 쿼리 (10개 스토어)
> - **10번**: 각 스토어마다 상품 조회 쿼리 실행
> - **10번**: 각 스토어마다 후기 조회 쿼리 실행
> 
> **총 21번의 쿼리**가 실행됩니다! 😱
> 
> **해결 방법**: 배치 처리로 모든 데이터를 한 번에 조회
> - **1번**: 스토어 목록 조회
> - **1번**: 모든 상품 조회 (WHERE storeId IN (...))
> - **1번**: 모든 후기 조회 (WHERE productId IN (...))
> 
> **총 3번의 쿼리**로 감소! 🚀

### 해결 방법

각 모듈에 **MapperUtil 클래스**를 생성하여 매핑 로직을 중앙화했습니다.

---

## Product 모듈

### 🔍 문제점

1. **코드 중복**: `getProducts`, `getProductDetail`, `getSellerProducts`, `getSellerProductDetail` 메서드에서 모두 동일한 store 위치 정보 매핑 로직이 반복됨
2. **일관성 부족**: store select 필드가 각 메서드마다 다르게 정의됨
3. **새로운 요구사항**: 상품 조회 시 스토어의 위치 정보를 "픽업장소" 정보로 포함해야 함

### ✅ 해결 방법

#### 1. ProductMapperUtil 생성

**파일 위치**: `apps/backend/src/modules/product/utils/product-mapper.util.ts`

```typescript
export class ProductMapperUtil {
  // Store 위치 정보 select 필드 (공통 상수)
  static readonly STORE_LOCATION_SELECT = {
    address: true,
    roadAddress: true,
    zonecode: true,
    latitude: true,
    longitude: true,
  } as const;

  // Store 위치 정보 및 userId select 필드 (권한 확인용)
  static readonly STORE_LOCATION_WITH_USER_ID_SELECT = {
    userId: true,
    address: true,
    roadAddress: true,
    zonecode: true,
    latitude: true,
    longitude: true,
  } as const;

  // Prisma Product 엔티티를 ProductResponseDto로 변환
  static mapToProductResponse(product: ProductWithStoreAndReviews): ProductResponseDto {
    const { store, reviews: _reviews, ...productData } = product;

    return {
      ...productData,
      // Store 위치 정보를 픽업장소 정보로 매핑
      pickupAddress: store?.address || "",
      pickupRoadAddress: store?.roadAddress || "",
      pickupZonecode: store?.zonecode || "",
      pickupLatitude: store?.latitude || 0,
      pickupLongitude: store?.longitude || 0,
    } as ProductResponseDto;
  }
}
```

#### 2. 공통 상수 사용

**Before (수정 전)**:
```typescript
// 각 메서드마다 다른 방식으로 정의
include: {
  store: {
    select: {
      address: true,
      roadAddress: true,
      // ... 매번 반복
    },
  },
}
```

**After (수정 후)**:
```typescript
// 공통 상수 사용
include: {
  store: {
    select: ProductMapperUtil.STORE_LOCATION_SELECT,
  },
}
```

#### 3. 모든 상품 조회 메서드에서 일관된 매핑 사용

**수정된 메서드들**:
- `getProducts()` - 상품 목록 조회
- `getProductDetail()` - 상품 상세 조회
- `getSellerProducts()` - 판매자용 상품 목록 조회
- `getSellerProductDetail()` - 판매자용 상품 상세 조회

**Before (수정 전)**:
```typescript
// 각 메서드마다 수동으로 매핑
const products = productsWithStore.map((product) => ({
  ...product,
  pickupAddress: product.store?.address || "",
  pickupRoadAddress: product.store?.roadAddress || "",
  // ... 반복되는 매핑 로직
}));
```

**After (수정 후)**:
```typescript
// 공통 매핑 함수 사용
const products = productsWithStore.map((product) => 
  ProductMapperUtil.mapToProductResponse(product)
);
```

### 📊 개선 효과

1. **코드 중복 제거**: 매핑 로직이 한 곳에만 존재
2. **일관성 확보**: 모든 상품 조회 API에서 동일한 형식으로 픽업장소 정보 반환
3. **유지보수성 향상**: 매핑 로직 변경 시 한 곳만 수정하면 됨
4. **타입 안정성**: TypeScript 타입을 명확히 정의하여 타입 안정성 확보

---

## Store 모듈

### 🔍 문제점

1. **N+1 쿼리 문제**: 여러 스토어를 조회할 때 각 스토어마다 products와 reviews를 개별 조회
   - 스토어 10개 조회 시: 1번(스토어 조회) + 10번(products 조회) + 10번(reviews 조회) = **21번의 쿼리**

2. **성능 저하**: 스토어가 많을수록 쿼리 수가 선형적으로 증가

### ✅ 해결 방법

#### 1. 배치 처리 메서드 추가

**파일 위치**: `apps/backend/src/modules/store/utils/store-mapper.util.ts`

**기존 메서드** (단일 스토어용):
```typescript
static async mapToStoreResponse(store: Store, prisma: PrismaService): Promise<StoreResponseDto>
```

**새로 추가된 메서드** (여러 스토어용):
```typescript
static async mapToStoreResponseBatch(
  stores: Store[],
  prisma: PrismaService,
): Promise<StoreResponseDto[]>
```

#### 2. 배치 처리 로직

**Before (수정 전)**:
```typescript
// 각 스토어마다 개별 쿼리 실행
stores.map((store) => StoreMapperUtil.mapToStoreResponse(store, this.prisma))
// → N+1 쿼리 문제 발생
```

**After (수정 후)**:
```typescript
// 모든 스토어의 데이터를 한 번에 조회
static async mapToStoreResponseBatch(stores: Store[], prisma: PrismaService) {
  const storeIds = stores.map((store) => store.id);

  // 1. 모든 스토어의 상품들을 한 번에 조회
  const allProducts = await prisma.product.findMany({
    where: { storeId: { in: storeIds } },
    select: { id: true, storeId: true },
  });

  // 2. 모든 후기를 한 번에 조회
  const allReviews = await prisma.productReview.findMany({
    where: { productId: { in: allProductIds } },
    select: { productId: true, rating: true },
  });

  // 3. 메모리에서 그룹화하여 통계 계산
  // ... (자세한 로직은 코드 참조)
}
```

#### 3. 서비스에서 배치 처리 메서드 사용

**파일**: `apps/backend/src/modules/store/services/store-list.service.ts`

**Before (수정 전)**:
```typescript
async getStoresByUserId(userId: string) {
  const stores = await this.prisma.store.findMany({ ... });
  
  return {
    stores: await Promise.all(
      stores.map((store) => StoreMapperUtil.mapToStoreResponse(store, this.prisma))
    ),
  };
}
```

**After (수정 후)**:
```typescript
async getStoresByUserId(userId: string) {
  const stores = await this.prisma.store.findMany({ ... });
  
  return {
    stores: await StoreMapperUtil.mapToStoreResponseBatch(stores, this.prisma),
  };
}
```

### 📊 개선 효과

1. **쿼리 수 감소**: 
   - Before: 스토어 10개 조회 시 **21번의 쿼리**
   - After: 스토어 10개 조회 시 **3번의 쿼리** (스토어 조회 + products 조회 + reviews 조회)
   - **약 87% 쿼리 수 감소**

2. **성능 향상**: 스토어가 많을수록 성능 개선 효과가 큼

3. **확장성**: 스토어 수가 증가해도 쿼리 수는 일정하게 유지

---

## Chat 모듈

### 🔍 문제점

1. **코드 중복**: 
   - `chat-message.service.ts`에 `mapToMessageResponseDto` private 메서드 존재
   - `chat-room.service.ts`에 인라인 매핑 로직 존재

2. **일관성 부족**: 같은 데이터를 다른 방식으로 매핑

3. **재사용성 부족**: 다른 서비스에서 동일한 매핑 로직을 사용하기 어려움

### ✅ 해결 방법

#### 1. ChatMapperUtil 생성

**파일 위치**: `apps/backend/src/modules/chat/utils/chat-mapper.util.ts`

```typescript
export class ChatMapperUtil {
  // Message → MessageResponseDto 변환
  static mapToMessageResponseDto(message: Message): MessageResponseDto {
    return {
      id: message.id,
      roomId: message.roomId,
      text: message.text,
      senderId: message.senderId,
      senderType: message.senderType.toLowerCase() as "user" | "store",
      createdAt: message.createdAt,
    };
  }

  // ChatRoom → ChatRoomResponseDto 변환 (사용자용)
  static mapToChatRoomResponseDto(
    chatRoom: ChatRoom & { store: { ... } }
  ): ChatRoomResponseDto {
    return {
      id: chatRoom.id,
      storeId: chatRoom.storeId,
      store: { ... },
      // ...
    };
  }

  // ChatRoom → ChatRoomForSellerResponseDto 변환 (판매자용)
  static mapToChatRoomForSellerResponseDto(
    chatRoom: ChatRoom & { user: { ... } }
  ): ChatRoomForSellerResponseDto {
    return {
      id: chatRoom.id,
      userId: chatRoom.userId,
      user: { ... },
      // ...
    };
  }
}
```

#### 2. 서비스에서 공통 유틸리티 사용

**chat-message.service.ts**:

**Before (수정 전)**:
```typescript
private mapToMessageResponseDto(message: any): MessageResponseDto {
  return {
    id: message.id,
    roomId: message.roomId,
    // ... 매핑 로직
  };
}

// 사용
const messageDto = this.mapToMessageResponseDto(message);
```

**After (수정 후)**:
```typescript
// private 메서드 제거하고 공통 유틸리티 사용
import { ChatMapperUtil } from "@apps/backend/modules/chat/utils/chat-mapper.util";

const messageDto = ChatMapperUtil.mapToMessageResponseDto(message);
```

**chat-room.service.ts**:

**Before (수정 전)**:
```typescript
return {
  chatRooms: chatRooms.map((chatRoom) => ({
    id: chatRoom.id,
    storeId: chatRoom.storeId,
    store: {
      id: chatRoom.store.id,
      name: chatRoom.store.name,
      // ... 인라인 매핑 로직
    },
    // ...
  })),
};
```

**After (수정 후)**:
```typescript
import { ChatMapperUtil } from "@apps/backend/modules/chat/utils/chat-mapper.util";

return {
  chatRooms: chatRooms.map((chatRoom) => 
    ChatMapperUtil.mapToChatRoomResponseDto(chatRoom)
  ),
};
```

### 📊 개선 효과

1. **코드 중복 제거**: 매핑 로직이 한 곳에만 존재
2. **일관성 확보**: 모든 채팅 관련 API에서 동일한 형식으로 데이터 반환
3. **재사용성 향상**: 다른 서비스에서도 동일한 매핑 로직 사용 가능
4. **유지보수성 향상**: 매핑 로직 변경 시 한 곳만 수정하면 됨

---

## 공통 개선 사항

### 1. 코드 일관성

모든 모듈에서 동일한 패턴을 사용:
- `{Module}MapperUtil` 클래스 생성
- `mapTo{Entity}Response` 메서드로 매핑 로직 제공
- 공통 상수로 select 필드 정의

### 2. 타입 안정성

TypeScript 타입을 명확히 정의하여:
- 컴파일 타임에 타입 오류 감지
- IDE 자동완성 지원
- 런타임 오류 방지

### 3. 유지보수성

매핑 로직 변경 시:
- **Before**: 여러 파일을 수정해야 함
- **After**: 한 파일만 수정하면 됨

### 4. 테스트 용이성

매핑 로직이 분리되어 있어:
- 단위 테스트 작성이 쉬움
- 매핑 로직만 독립적으로 테스트 가능

---

## 사용 가이드

### Product 모듈 사용 예시

```typescript
// 1. Prisma 쿼리에서 store include
const products = await this.prisma.product.findMany({
  where: { ... },
  include: {
    store: {
      select: ProductMapperUtil.STORE_LOCATION_SELECT,
    },
  },
});

// 2. 매핑 함수 사용
const productDtos = products.map((product) => 
  ProductMapperUtil.mapToProductResponse(product)
);
```

### Store 모듈 사용 예시

```typescript
// 단일 스토어 조회
const store = await this.prisma.store.findFirst({ ... });
const storeDto = await StoreMapperUtil.mapToStoreResponse(store, this.prisma);

// 여러 스토어 조회 (배치 처리)
const stores = await this.prisma.store.findMany({ ... });
const storeDtos = await StoreMapperUtil.mapToStoreResponseBatch(stores, this.prisma);
```

### Chat 모듈 사용 예시

```typescript
// Message 매핑
const messageDto = ChatMapperUtil.mapToMessageResponseDto(message);

// ChatRoom 매핑 (사용자용)
const chatRoomDto = ChatMapperUtil.mapToChatRoomResponseDto(chatRoom);

// ChatRoom 매핑 (판매자용)
const chatRoomDto = ChatMapperUtil.mapToChatRoomForSellerResponseDto(chatRoom);
```

---

## 주의사항

### 1. Product 모듈

- `mapToProductResponse` 사용 시 반드시 `store`를 include해야 함
- `reviews`는 선택적이며, 정렬에 필요한 경우에만 include

### 2. Store 모듈

- 단일 스토어 조회: `mapToStoreResponse` 사용
- 여러 스토어 조회: `mapToStoreResponseBatch` 사용 (성능 최적화)

### 3. Chat 모듈

- `mapToChatRoomResponseDto` 사용 시 `store`를 include해야 함
- `mapToChatRoomForSellerResponseDto` 사용 시 `user`를 include해야 함

---

## 향후 개선 방향

1. **자동화**: Prisma 스키마 변경 시 자동으로 매핑 로직 업데이트
2. **캐싱**: 자주 조회되는 데이터에 대한 캐싱 전략 도입
3. **배치 처리 확대**: 다른 모듈에서도 배치 처리 패턴 적용

---

## 참고 자료

- [ProductMapperUtil 코드](../../apps/backend/src/modules/product/utils/product-mapper.util.ts)
- [StoreMapperUtil 코드](../../apps/backend/src/modules/store/utils/store-mapper.util.ts)
- [ChatMapperUtil 코드](../../apps/backend/src/modules/chat/utils/chat-mapper.util.ts)

