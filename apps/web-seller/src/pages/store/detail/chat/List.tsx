import React from "react";
import { useParams } from "react-router-dom";
import { useChatRoomsByStore } from "@/apps/web-seller/features/chat/hooks/queries/useChat";
import { ChatRoomList } from "@/apps/web-seller/features/chat/components/ChatRoomList";

export const StoreDetailChatListPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();

  if (!storeId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어가 선택되지 않았습니다.</h2>
      </div>
    );
  }

  const { data, isLoading } = useChatRoomsByStore(storeId);

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
        <ChatRoomList chatRooms={data?.chatRooms || []} storeId={storeId} />
      )}
    </div>
  );
};
