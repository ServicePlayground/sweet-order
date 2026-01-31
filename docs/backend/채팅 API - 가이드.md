# 채팅 API 가이드

사용자와 판매자(스토어) 간의 1대1 채팅 기능을 제공하는 API입니다.

## 📋 목차

1. [개요](#개요)
2. [데이터베이스 설계](#데이터베이스-설계)
3. [API 엔드포인트](#api-엔드포인트)
4. [사용 예시](#사용-예시)
5. [주의사항](#주의사항)

## 개요

채팅 기능은 사용자와 판매자 간의 소통을 위한 1대1 채팅방을 제공합니다. 현재 구현된 기능은 다음과 같습니다:

- ✅ 채팅방 생성 또는 조회
- ✅ 사용자 채팅방 목록 조회
- ✅ 판매자 채팅방 목록 조회 (스토어별)
- ✅ 메시지 전송 및 조회 (WebSocket + REST API)
- ✅ 실시간 메시지 수신 (WebSocket)
- ✅ 읽지 않은 메시지 수 관리 (userUnread, storeUnread)
- ✅ 채팅방 읽음 처리 (사용자용, 판매자용)

## 데이터베이스 설계

### ChatRoom 모델

```prisma
model ChatRoom {
  id              String   @id @default(cuid())
  userId          String   @map("user_id")
  storeId         String   @map("store_id")

  lastMessage     String?  @map("last_message") @db.VarChar(1000) // 마지막 메시지 미리보기용 (최대 1000자)
  lastMessageAt   DateTime? @map("last_message_at")

  userUnread      Int      @default(0) @map("user_unread")
  storeUnread     Int      @default(0) @map("store_unread")

  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  store           Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  messages        Message[]

  // 인덱스 최적화
  @@unique([userId, storeId]) // 1대1 채팅방 보장
  @@index([userId, lastMessageAt(sort: Desc)]) // 사용자 채팅방 목록 조회 최적화
  @@index([storeId, lastMessageAt(sort: Desc)]) // 판매자 채팅방 목록 조회 최적화
  @@index([userId]) // 기존 인덱스 유지
  @@index([storeId]) // 기존 인덱스 유지
  @@map("chat_rooms")
}
```

### Message 모델

```prisma
model Message {
  id              String      @id @default(cuid())
  roomId          String      @map("room_id")
  text            String      @db.Text // 긴 메시지를 위해 Text 타입 사용
  senderId        String      @map("sender_id")
  senderType      MessageSenderType @map("sender_type")

  createdAt       DateTime    @default(now()) @map("created_at")

  // Relations
  room            ChatRoom    @relation(fields: [roomId], references: [id], onDelete: Cascade)

  // 인덱스 최적화: 메시지 조회 시 roomId와 createdAt을 함께 사용하므로 복합 인덱스 추가
  @@index([roomId, createdAt(sort: Desc)]) // 메시지 목록 조회 최적화
  @@index([roomId]) // 기존 인덱스 유지 (다른 쿼리에서 사용 가능)
  @@map("messages")
}

enum MessageSenderType {
  USER
  STORE
}
```

### 주요 필드 설명

#### ChatRoom

- `id`: 채팅방 고유 ID
- `userId`: 사용자 ID (채팅을 시작한 사용자)
- `storeId`: 스토어 ID (채팅 상대방인 스토어)
- `lastMessage`: 마지막 메시지 내용 (최대 1000자, 메시지 전송 시 백엔드에서 자동 업데이트)
- `lastMessageAt`: 마지막 메시지 시간 (메시지 전송 시 백엔드에서 자동 업데이트)
- `userUnread`: 사용자가 읽지 않은 메시지 수
- `storeUnread`: 판매자가 읽지 않은 메시지 수

#### Message

- `id`: 메시지 고유 ID
- `roomId`: 채팅방 ID
- `text`: 메시지 내용 (최대 1000자)
- `senderId`: 발신자 ID
- `senderType`: 발신자 타입 (`USER` 또는 `STORE`)
- `createdAt`: 메시지 생성 시간

### 제약 조건

- `userId`와 `storeId`의 조합은 유일해야 합니다 (1대1 채팅방)
- 사용자와 스토어가 삭제되면 관련 채팅방과 메시지도 함께 삭제됩니다 (Cascade)
- 메시지 내용은 최대 1000자까지 허용됩니다
- `lastMessage`는 최대 1000자로 제한됩니다 (미리보기용)

## API 엔드포인트

### 사용자 API (`/v1/user/chat-room`)

#### 1. 채팅방 생성 또는 조회

**POST** `/v1/user/chat-room`

기존 채팅방이 있으면 반환하고, 없으면 새로 생성합니다.

**인증**: 필수 (Bearer Token)

**요청 본문**:

```json
{
  "storeId": "QXZw02vBqVXNQ29c4w9n9ZdG"
}
```

**응답** (201 Created):

```json
{
  "id": "QXZw02vBqVXNQ29c4w9n9ZdG"
}
```

**에러 응답**:

- `404`: 스토어를 찾을 수 없습니다.

#### 2. 채팅방 목록 조회

**GET** `/v1/user/chat-room`

사용자의 모든 채팅방 목록을 조회합니다. 마지막 메시지 시간 기준으로 정렬됩니다.

**인증**: 필수 (Bearer Token)

**응답** (200 OK):

```json
{
  "chatRooms": [
    {
      "id": "QXZw02vBqVXNQ29c4w9n9ZdG",
      "storeId": "store456",
      "store": {
        "id": "store456",
        "name": "스위트오더 스토어",
        "logoImageUrl": null
      },
      "lastMessage": "안녕하세요, 케이크 주문하고 싶어요.",
      "lastMessageAt": "2024-01-01T12:00:00.000Z",
      "userUnread": 2,
      "storeUnread": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

#### 3. 채팅방 읽음 처리

**POST** `/v1/user/chat-room/:roomId/read`

채팅방 입장 시 사용자의 읽지 않은 메시지 수를 0으로 초기화합니다.

**인증**: 필수 (Bearer Token)

**경로 파라미터**:

- `roomId`: 채팅방 ID

**응답** (200 OK):

```json
{
  "success": true
}
```

**에러 응답**:

- `401`: 인증 토큰이 유효하지 않습니다.
- `404`: 채팅방을 찾을 수 없습니다.

### 판매자 API (`/v1/seller/chat-room`)

#### 1. 스토어의 채팅방 목록 조회

**GET** `/v1/seller/chat-room/store/:storeId`

특정 스토어의 모든 채팅방 목록을 조회합니다. 마지막 메시지 시간 기준으로 정렬됩니다.

**인증**: 필수 (Bearer Token, SELLER 또는 ADMIN 역할)

**경로 파라미터**:

- `storeId`: 스토어 ID

**응답** (200 OK):

```json
{
  "chatRooms": [
    {
      "id": "QXZw02vBqVXNQ29c4w9n9ZdG",
      "userId": "user123",
      "storeId": "store456",
      "user": {
        "id": "user123",
        "nickname": "홍길동",
        "profileImageUrl": null
      },
      "lastMessage": "안녕하세요, 케이크 주문하고 싶어요.",
      "lastMessageAt": "2024-01-01T12:00:00.000Z",
      "userUnread": 2,
      "storeUnread": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

**에러 응답**:

- `401`: 인증 토큰이 유효하지 않습니다.
- `403`: 해당 스토어에 대한 권한이 없습니다.
- `404`: 스토어를 찾을 수 없습니다.

#### 2. 채팅방 읽음 처리 (판매자용)

**POST** `/v1/seller/chat-room/:roomId/read`

채팅방 입장 시 판매자의 읽지 않은 메시지 수를 0으로 초기화합니다.

**인증**: 필수 (Bearer Token, SELLER 또는 ADMIN 역할)

**경로 파라미터**:

- `roomId`: 채팅방 ID

**응답** (200 OK):

```json
{
  "success": true
}
```

**에러 응답**:

- `401`: 인증 토큰이 유효하지 않습니다.
- `404`: 채팅방을 찾을 수 없습니다.

### 메시지 API (`/v1/user/chat-room/:roomId/messages`, `/v1/seller/chat-room/:roomId/messages`)

#### 1. 메시지 전송

**POST** `/v1/user/chat-room/:roomId/messages` 또는 `/v1/seller/chat-room/:roomId/messages`

채팅방에 메시지를 전송합니다. WebSocket을 통해서도 전송 가능합니다.

**인증**: 필수 (Bearer Token)

**경로 파라미터**:

- `roomId`: 채팅방 ID

**요청 본문**:

```json
{
  "text": "안녕하세요, 케이크 주문하고 싶어요."
}
```

**요청 검증**:

- `text`: 필수, 문자열, 최소 1자, 최대 1000자

**에러 응답**:

- `400`: 메시지 내용이 비어있습니다. / 메시지는 1000자를 초과할 수 없습니다.
- `401`: 인증 토큰이 유효하지 않습니다.
- `404`: 채팅방을 찾을 수 없습니다.

**응답** (201 Created):

```json
{
  "id": "message123",
  "roomId": "room456",
  "text": "안녕하세요, 케이크 주문하고 싶어요.",
  "senderId": "user123",
  "senderType": "user",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

#### 2. 메시지 목록 조회

**GET** `/v1/user/chat-room/:roomId/messages` 또는 `/v1/seller/chat-room/:roomId/messages`

채팅방의 메시지 목록을 조회합니다. 커서 기반 페이지네이션을 지원합니다.

**인증**: 필수 (Bearer Token)

**경로 파라미터**:

- `roomId`: 채팅방 ID

**쿼리 파라미터**:

- `limit`: 조회할 메시지 수 (기본값: 50, 최소: 1, 최대: 100)
- `cursor`: 커서 (다음 페이지 조회용, 선택사항)

**요청 검증**:

- `limit`: 1~100 사이의 정수값이어야 합니다. 범위를 벗어나면 400 에러가 반환됩니다.

**응답** (200 OK):

```json
{
  "messages": [
    {
      "id": "message123",
      "roomId": "room456",
      "text": "안녕하세요",
      "senderId": "user123",
      "senderType": "user",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "nextCursor": "message122"
}
```

**에러 응답**:

- `400`: limit은 1~100 사이의 값이어야 합니다.
- `401`: 인증 토큰이 유효하지 않습니다.
- `404`: 채팅방을 찾을 수 없습니다.

## 사용 예시

### 1. 사용자가 채팅방 생성

```bash
curl -X POST http://localhost:3000/v1/user/chat-room \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "QXZw02vBqVXNQ29c4w9n9ZdG"
  }'
```

### 2. 사용자가 채팅방 목록 조회

```bash
curl -X GET http://localhost:3000/v1/user/chat-room \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. 사용자가 채팅방 읽음 처리

```bash
curl -X POST http://localhost:3000/v1/user/chat-room/QXZw02vBqVXNQ29c4w9n9ZdG/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. 판매자가 스토어의 채팅방 목록 조회

```bash
curl -X GET http://localhost:3000/v1/seller/chat-room/store/QXZw02vBqVXNQ29c4w9n9ZdG \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. 판매자가 채팅방 읽음 처리

```bash
curl -X POST http://localhost:3000/v1/seller/chat-room/QXZw02vBqVXNQ29c4w9n9ZdG/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 주의사항

### 1. WebSocket 실시간 통신

채팅은 WebSocket을 통해 실시간으로 동작합니다:

- **WebSocket 연결**: `/chat` 네임스페이스로 연결
- **인증**: JWT 토큰을 쿼리 파라미터 또는 Authorization 헤더로 전달
- **이벤트**:
  - `join-room`: 채팅방 조인
  - `leave-room`: 채팅방 나가기
  - `send-message`: 메시지 전송
  - `new-message`: 새 메시지 수신 (서버에서 클라이언트로)

### 2. 읽지 않은 메시지 수 관리

- `userUnread`: 사용자가 읽지 않은 메시지 수
- `storeUnread`: 판매자가 읽지 않은 메시지 수
- 채팅방 입장 시 해당 사용자의 `unread`를 0으로 초기화하는 API가 구현되어 있습니다
- 메시지 생성 시 백엔드가 자동으로 상대방의 `unread`를 증가시킵니다

### 3. 채팅방 정렬

채팅방 목록은 `lastMessageAt` 기준으로 내림차순 정렬됩니다. 메시지가 없는 채팅방은 맨 뒤로 정렬됩니다 (`nulls: "last"`).

### 4. 메시지 검증 및 제한

- **메시지 길이**: 최소 1자, 최대 1000자
- **빈 메시지**: 공백만 있는 메시지는 전송할 수 없습니다
- **limit 파라미터**: 메시지 목록 조회 시 1~100 사이의 값만 허용됩니다

### 5. 성능 최적화

- **복합 인덱스**: 채팅방 목록 조회와 메시지 목록 조회를 위한 복합 인덱스가 최적화되어 있습니다
  - `ChatRoom`: `[userId, lastMessageAt]`, `[storeId, lastMessageAt]` 복합 인덱스
  - `Message`: `[roomId, createdAt]` 복합 인덱스
- **트랜잭션**: 메시지 생성과 채팅방 메타데이터 업데이트는 원자적으로 처리됩니다
- **upsert 사용**: 채팅방 생성 시 기존 채팅방 조회와 생성을 한 번의 쿼리로 처리합니다

### 6. 권한 관리

- 사용자 API: `USER`, `SELLER`, `ADMIN` 역할 모두 접근 가능
- 판매자 API: `SELLER`, `ADMIN` 역할만 접근 가능
- 판매자는 자신이 소유한 스토어의 채팅방만 조회 가능

## 관련 파일

### 모듈 구조

채팅 모듈은 Facade 패턴을 사용하여 구조화되어 있습니다:

- **ChatService** (Facade): 통합 인터페이스 제공
  - `apps/backend/src/modules/chat/services/chat.service.ts`
- **ChatRoomService**: 채팅방 관련 비즈니스 로직
  - `apps/backend/src/modules/chat/services/chat-room.service.ts`
- **ChatMessageService**: 메시지 관련 비즈니스 로직
  - `apps/backend/src/modules/chat/services/chat-message.service.ts`
- **ChatGateway**: WebSocket 실시간 통신
  - `apps/backend/src/modules/chat/gateways/chat.gateway.ts`
- **ChatPermissionUtil**: 권한 확인 유틸리티
  - `apps/backend/src/modules/chat/utils/chat-permission.util.ts`

### 기타 파일

- **Prisma Schema**: `apps/backend/src/infra/database/prisma/schema.prisma`
- **Chat Module**: `apps/backend/src/modules/chat/chat.module.ts`
- **User Chat Controller**: `apps/backend/src/apis/user/controllers/chat.controller.ts` (채팅방 + 메시지 통합)
- **Seller Chat Controller**: `apps/backend/src/apis/seller/controllers/chat.controller.ts` (채팅방 + 메시지 통합)
