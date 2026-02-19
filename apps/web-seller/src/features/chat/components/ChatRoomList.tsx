import React from "react";
import { useNavigate } from "react-router-dom";
import { ChatRoomForSeller } from "@/apps/web-seller/features/chat/types/chat.type";
import { formatRelativeTime } from "@/apps/web-seller/common/utils/date.util";
import { EmptyState } from "@/apps/web-seller/common/components/fallbacks/EmptyState";

interface ChatRoomListProps {
  chatRooms: ChatRoomForSeller[];
  storeId: string;
}

export const ChatRoomList: React.FC<ChatRoomListProps> = ({ chatRooms, storeId }) => {
  const navigate = useNavigate();

  if (chatRooms.length === 0) {
    return <EmptyState message="채팅방이 없습니다." />;
  }

  return (
    <div className="space-y-2">
      {chatRooms.map((room) => (
        <div
          key={room.id}
          onClick={() => navigate(`/stores/${storeId}/chat/${room.id}`)}
          className="flex cursor-pointer items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
        >
          {/* 사용자 프로필 이미지 */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {room.user.profileImageUrl ? (
              <img
                src={room.user.profileImageUrl}
                alt={room.user.nickname || "사용자"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-lg font-semibold text-muted-foreground">
                {room.user.nickname?.[0] || "?"}
              </div>
            )}
          </div>

          {/* 채팅방 정보 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-semibold">{room.user.nickname || "알 수 없음"}</h3>
              {room.lastMessageAt && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(room.lastMessageAt)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm text-muted-foreground">
                {room.lastMessage || "메시지가 없습니다."}
              </p>
              {room.storeUnread > 0 && (
                <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  {room.storeUnread}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
