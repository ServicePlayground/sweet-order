"use client";

import React from "react";
import { useChatRooms } from "@/apps/web-user/features/chat/hooks/queries/useChat";
import { ChatRoomList } from "@/apps/web-user/features/chat/components/ChatRoomList";

export default function ChatListPage() {
  const { data, isLoading } = useChatRooms();

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
        <ChatRoomList chatRooms={data?.chatRooms || []} />
      )}
    </div>
  );
}
