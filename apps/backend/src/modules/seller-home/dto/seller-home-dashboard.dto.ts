import { ApiProperty } from "@nestjs/swagger";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";
import { SellerNotificationItemResponseDto } from "@apps/backend/modules/notification/dto/seller-notification.dto";
import { FeedResponseDto } from "@apps/backend/modules/feed/dto/feed-detail.dto";

/**
 * 판매자 스토어 홈 대시보드 (최근 주문·오늘 픽업·알림·피드) 한 번에 조회.
 */
export class SellerHomeDashboardResponseDto {
  @ApiProperty({ type: [OrderResponseDto], description: "접수일 최신순" })
  recentOrders: OrderResponseDto[];

  @ApiProperty({
    type: [OrderResponseDto],
    description: "픽업 예정일이 오늘(Asia/Seoul)인 주문, 픽업 시각 오름차순",
  })
  todayPickups: OrderResponseDto[];

  @ApiProperty({
    type: [SellerNotificationItemResponseDto],
    description: "최근 알림 (최신순)",
  })
  recentNotifications: SellerNotificationItemResponseDto[];

  @ApiProperty({
    type: [FeedResponseDto],
    description: "최근 피드 (최신순)",
  })
  recentFeeds: FeedResponseDto[];
}
