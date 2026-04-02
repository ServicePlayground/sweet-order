import { Injectable } from "@nestjs/common";
import { OrderService } from "@apps/backend/modules/order/order.service";
import { NotificationService } from "@apps/backend/modules/notification/services/notification.service";
import { FeedService } from "@apps/backend/modules/feed/feed.service";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { OrderListRequestDto } from "@apps/backend/modules/order/dto/order-list.dto";
import { OrderSortBy } from "@apps/backend/modules/order/constants/order.constants";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { SellerHomeDashboardResponseDto } from "./dto/seller-home-dashboard.dto";
import { getSeoulTodayYmd } from "./utils/seller-home-date.util";
import {
  SELLER_HOME_FEED_LIMIT,
  SELLER_HOME_NOTIFICATION_LIMIT,
  SELLER_HOME_RECENT_ORDER_LIMIT,
  SELLER_HOME_TODAY_PICKUP_FETCH_LIMIT,
} from "./constants/seller-home.constants";

/**
 * 스토어 홈 대시보드용 데이터를 기존 주문·알림·피드 서비스로 묶어서 조회한다.
 * 스토어 권한 검증은 각 하위 서비스(`getOrdersForSeller` 등)에 위임한다.
 */
@Injectable()
export class SellerHomeService {
  constructor(
    private readonly orderService: OrderService,
    private readonly notificationService: NotificationService,
    private readonly feedService: FeedService,
  ) {}

  /** 단일 스토어 기준 홈 패널에 필요한 요약 데이터를 한 번에 반환한다. */
  async getDashboard(
    storeId: string,
    user: JwtVerifiedPayload,
  ): Promise<SellerHomeDashboardResponseDto> {
    const todayYmd = getSeoulTodayYmd();

    // 최근 접수 순 상위 N건
    const recentQuery: OrderListRequestDto = {
      page: 1,
      limit: SELLER_HOME_RECENT_ORDER_LIMIT,
      sortBy: OrderSortBy.LATEST,
      storeId,
    };

    // 픽업 예정일이 오늘(서울 기준 YMD)인 주문만 — 목록 API는 최신순이라, 아래에서 픽업 시각 기준 재정렬
    const todayPickupQuery: OrderListRequestDto = {
      page: 1,
      limit: SELLER_HOME_TODAY_PICKUP_FETCH_LIMIT,
      sortBy: OrderSortBy.LATEST,
      storeId,
      pickupStartDate: todayYmd,
      pickupEndDate: todayYmd,
    };

    const feedQuery: PaginationRequestDto = {
      page: 1,
      limit: SELLER_HOME_FEED_LIMIT,
    };

    // 주문·알림·피드를 병렬로 조회해 홈 응답 지연을 줄인다.
    const [recentOrdersRes, todayPickupsRes, notificationsRes, feedsRes] = await Promise.all([
      this.orderService.getOrdersForSeller(recentQuery, user),
      this.orderService.getOrdersForSeller(todayPickupQuery, user),
      this.notificationService.listSellerWebForStore({
        userId: user.sub,
        storeId,
        unreadOnly: false,
        page: 1,
        limit: SELLER_HOME_NOTIFICATION_LIMIT,
      }),
      this.feedService.getFeedsByStoreIdForSeller(storeId, user, feedQuery),
    ]);

    // 목록은 접수 최신순이므로, 오늘 픽업분만 픽업 예정 시각 오름차순으로 맞춘다.
    const todayPickupsSorted = [...todayPickupsRes.data]
      .filter((o) => o.pickupDate != null)
      .sort((a, b) => {
        const ta = new Date(a.pickupDate).getTime();
        const tb = new Date(b.pickupDate).getTime();
        return ta - tb;
      });

    return {
      recentOrders: recentOrdersRes.data,
      todayPickups: todayPickupsSorted,
      recentNotifications: notificationsRes.items,
      recentFeeds: feedsRes.data,
    };
  }
}
