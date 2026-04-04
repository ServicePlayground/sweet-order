import type { OrderResponseDto } from "@/apps/web-seller/features/order/types/order.dto";
import type { FeedResponseDto } from "@/apps/web-seller/features/feed/types/feed.dto";
import type { SellerNotificationItem } from "@/apps/web-seller/features/notification/types/notification.dto";

/** GET /v1/seller/store/:storeId/home 응답 (백엔드 `SellerHomeDashboardResponseDto`) */
export interface SellerHomeDashboardDto {
  recentOrders: OrderResponseDto[];
  todayPickups: OrderResponseDto[];
  recentNotifications: SellerNotificationItem[];
  recentFeeds: FeedResponseDto[];
}
