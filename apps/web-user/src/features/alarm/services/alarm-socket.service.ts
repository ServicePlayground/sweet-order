import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/apps/web-user/common/store/auth.store";
import type { AlarmNotificationItem } from "@/apps/web-user/features/alarm/types/alarm.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN;

function isAlarmSocketDisabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_ALARM_SOCKET === "false" ||
    process.env.NEXT_PUBLIC_USER_ORDER_NOTIFICATION_SOCKET === "false"
  );
}

/**
 * 알림 Socket.IO (`/notifications` 네임스페이스, 이벤트 `user_order_notification`).
 * `NEXT_PUBLIC_ALARM_SOCKET=false` 로 끌 수 있습니다. (구명칭 `NEXT_PUBLIC_USER_ORDER_NOTIFICATION_SOCKET`도 동일 동작)
 */
export function connectAlarmSocket(params: {
  onNotification: (item: AlarmNotificationItem) => void;
}): () => void {
  if (isAlarmSocketDisabled() || !API_BASE_URL) {
    return () => undefined;
  }

  const token = useAuthStore.getState().accessToken;
  if (!token) {
    return () => undefined;
  }

  let socket: Socket | null = null;

  socket = io(`${API_BASE_URL}/notifications`, {
    path: "/socket.io/",
    transports: ["websocket", "polling"],
    auth: { token },
    query: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 30000,
  });

  const handler = (raw: unknown) => {
    if (!raw || typeof raw !== "object") return;
    const item = raw as AlarmNotificationItem;
    if (item.appSurface !== "USER_WEB") return;
    params.onNotification(item);
  };

  socket.on("user_order_notification", handler);

  return () => {
    socket?.off("user_order_notification", handler);
    socket?.disconnect();
    socket = null;
  };
}
