import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useChatRoomsByStore } from "@/apps/web-seller/features/chat/hooks/queries/useChatQuery";
import { useInfiniteScroll } from "@/apps/web-seller/common/hooks/useInfiniteScroll";
import { ChatRoomList } from "@/apps/web-seller/features/chat/components/ChatRoomList";
import type { ChatRoomForSellerResponseDto } from "@/apps/web-seller/features/chat/types/chat.dto";
import { flattenAndDeduplicateInfiniteData } from "@/apps/web-seller/common/utils/pagination.util";

export const StoreDetailChatListPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (!storeId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어가 선택되지 않았습니다.</h2>
      </div>
    );
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChatRoomsByStore(storeId);

  // 무한 스크롤 훅 사용
  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
  });

  // 채팅방 목록 평탄화 및 중복 제거
  const chatRooms = flattenAndDeduplicateInfiniteData<ChatRoomForSellerResponseDto>(data);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">채팅 목록</h1>
      </div>

      {/* 채팅방 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">채팅방을 불러오는 중...</div>
        </div>
      ) : (
        <>
          <ChatRoomList chatRooms={chatRooms} storeId={storeId} />

          {/* 무한 스크롤 트리거 */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="flex min-h-[100px] items-center justify-center py-8">
              {isFetchingNextPage && (
                <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>더 많은 채팅방을 불러오는 중...</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
