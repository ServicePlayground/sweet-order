import type { NotificationAppSurface } from "@/apps/web-seller/features/notification/types/notification.dto";

/** 백엔드 Socket.IO `query.surface`와 동일해야 합니다. */
export const NOTIFICATION_SOCKET_SURFACE: NotificationAppSurface = "SELLER_WEB";
