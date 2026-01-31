import React from "react";
import { useParams } from "react-router-dom";
import { ChatRoom } from "@/apps/web-seller/features/chat/components/ChatRoom";

export const StoreDetailChatRoomPage: React.FC = () => {
  const { storeId, roomId } = useParams<{ storeId: string; roomId: string }>();

  if (!storeId || !roomId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">채팅방을 찾을 수 없습니다.</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">채팅</h1>
      </div>

      {/* 채팅방 */}
      <ChatRoom />
    </div>
  );
};
