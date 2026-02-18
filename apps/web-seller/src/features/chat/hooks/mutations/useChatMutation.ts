import { useMutation } from "@tanstack/react-query";
import { chatApi } from "@/apps/web-seller/features/chat/apis/chat.api";
import { useAlertStore } from "@/apps/web-seller/common/store/alert.store";
import getApiMessage from "@/apps/web-seller/common/utils/getApiMessage";

// 채팅방 읽음 처리 뮤테이션
export function useMarkChatRoomAsRead() {
  const { addAlert } = useAlertStore();

  return useMutation({
    mutationFn: (roomId: string) => chatApi.markChatRoomAsRead(roomId),
    onError: (error) => {
      addAlert({
        severity: "error",
        message: getApiMessage.error(error),
      });
    },
  });
}
