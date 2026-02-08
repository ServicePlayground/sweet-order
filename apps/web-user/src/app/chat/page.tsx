"use client";

import React, { useRef } from "react";
import { useChatRooms } from "@/apps/web-user/features/chat/hooks/queries/useChat";
import { useInfiniteScroll } from "@/apps/web-user/common/hooks/useInfiniteScroll";
import { ChatRoomList } from "@/apps/web-user/features/chat/components/ChatRoomList";
import { ChatRoom } from "@/apps/web-user/features/chat/types/chat.type";
import { flattenAndDeduplicateInfiniteData } from "@/apps/web-user/common/utils/pagination.util";

export default function ChatListPage() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useChatRooms();

  // 무한 스크롤 훅 사용
  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
  });

  // 채팅방 목록 평탄화 및 중복 제거
  const chatRooms = flattenAndDeduplicateInfiniteData<ChatRoom>(data);

  return (
    <div className="container mx-auto space-y-6 p-6">
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
          <ChatRoomList chatRooms={chatRooms} />

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
}
