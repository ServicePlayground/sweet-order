import type {
  GetChatRoomsRequestDto,
  GetMessagesRequestDto,
} from "@/apps/web-seller/features/chat/types/chat.dto";

/** 쿼리 키/옵션용 (page 제외, 클라이언트 전용) */
export type GetChatRoomsQueryParams = Omit<GetChatRoomsRequestDto, "page">;

/** 쿼리 키/옵션용 (page 제외, 클라이언트 전용) */
export type GetMessagesQueryParams = Omit<GetMessagesRequestDto, "page">;
