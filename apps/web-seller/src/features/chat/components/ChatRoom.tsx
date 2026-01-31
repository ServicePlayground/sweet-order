import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useMessages,
  useSendMessage,
  useMarkChatRoomAsRead,
} from "@/apps/web-seller/features/chat/hooks/queries/useChat";
import { chatSocketService } from "@/apps/web-seller/features/chat/services/chat-socket.service";
import { Message } from "@/apps/web-seller/features/chat/types/chat.type";
import { Send } from "lucide-react";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";
import { Textarea } from "@/apps/web-seller/common/components/@shadcn-ui/textarea";
import { formatTime } from "@/apps/web-seller/common/utils/date.util";
import { useInfiniteScroll } from "@/apps/web-seller/common/hooks/useInfiniteScroll";

export const ChatRoom: React.FC = () => {
  const params = useParams();
  const roomId = params?.roomId as string;
  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(roomId, 50);
  const [initialAllMessages, setInitialAllMessages] = useState<Message[]>([]); // API를 통해 조회된 메시지 목록
  const [newAllMessages, setNewAllMessages] = useState<Message[]>([]); // websocket을 통해 수신된 새로운 메시지 목록
  const allMessages = useMemo(
    () => [...initialAllMessages, ...newAllMessages],
    [initialAllMessages, newAllMessages],
  );
  const [newMessage, setNewMessage] = useState(""); // 새로운 메시지 입력
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkChatRoomAsRead();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 무한 스크롤 훅 사용 (위로 스크롤하여 이전 메시지 로드)
  useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
  });

  // 채팅방 접속이후 새롭게 작성된 메시지는 조회 REST API를 통해 가져오지 않음
  // 여기서는 초기, 무한스크롤시와 같이 messagesData이 변경될때만 초기화
  useEffect(() => {
    // 읽음 처리
    markAsReadMutation.mutate(roomId);

    const allMessages = messagesData?.pages?.flatMap((page) => page.messages) || [];

    // REST API로 받은 메시지도 필수 필드 검증 및 정규화
    const validatedMessages = allMessages.map((msg) => ({
      ...msg,
      createdAt: msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt),
    }));

    setInitialAllMessages(validatedMessages);
    setNewAllMessages([]);

    return () => {
      // 채팅방 나갈 때 읽음 처리
      markAsReadMutation.mutate(roomId);
    };
  }, [messagesData]);

  // WebSocket 연결 및 채팅방 조인
  useEffect(() => {
    if (!roomId) return;

    chatSocketService.connect();
    chatSocketService.joinRoom(roomId);

    // 새 메시지 수신 리스너 (메시지 전송 REST API로 메시지 전송 후 서버에서 자동으로 WebSocket 브로드캐스트하여 여기로 전달됨.)
    const unsubscribe = chatSocketService.onNewMessage((message: Message) => {
      // createdAt이 문자열인 경우 Date 객체로 변환
      const normalizedMessage: Message = {
        ...message,
        createdAt:
          message.createdAt instanceof Date ? message.createdAt : new Date(message.createdAt),
      };

      setNewAllMessages((prev) => [...prev, normalizedMessage]);
    });

    return () => {
      unsubscribe();
      chatSocketService.leaveRoom(roomId);
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !roomId) return;

    // 실제 메시지 전송
    sendMessageMutation.mutate(
      { roomId, request: { text: newMessage } },
      {
        onSuccess: () => {
          setNewMessage("");
          // 메시지 전송 REST API로 메시지 전송 후 서버에서 자동으로 WebSocket 브로드캐스트하므로 클라이언트에서 추가로 WebSocket 전송할 필요 없음
        },
      },
    );
  };

  if (!roomId) {
    return <div>채팅방을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col">
      {/* 메시지 영역 */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">메시지를 불러오는 중...</div>
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">메시지가 없습니다.</div>
          </div>
        ) : (
          <>
            {/* 이전 메시지 로드 트리거 */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="flex min-h-[100px] items-center justify-center py-4"
              >
                {isFetchingNextPage && (
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>이전 메시지를 불러오는 중...</span>
                  </div>
                )}
              </div>
            )}
            {allMessages.map((message) => {
              const isStore = message.senderType === "store";
              return (
                <div
                  key={message.id}
                  className={`flex ${isStore ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isStore ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`mt-1 text-xs ${
                        isStore ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t bg-card p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="min-h-[60px] resize-none"
            maxLength={1000}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{newMessage.length}/1000</p>
      </div>
    </div>
  );
};
