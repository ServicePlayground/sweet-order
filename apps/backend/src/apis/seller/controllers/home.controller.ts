import { Controller, Get, HttpCode, HttpStatus, Param, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { SwaggerAuthResponses } from "@apps/backend/common/decorators/swagger-auth-responses.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  USER_ROLES,
  AUTH_ERROR_MESSAGES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { ORDER_ERROR_MESSAGES } from "@apps/backend/modules/order/constants/order.constants";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";
import { SellerNotificationItemResponseDto } from "@apps/backend/modules/notification/dto/seller-notification.dto";
import { FeedResponseDto } from "@apps/backend/modules/feed/dto/feed-detail.dto";
import { SellerHomeService } from "@apps/backend/modules/seller-home/seller-home.service";
import { SellerHomeDashboardResponseDto } from "@apps/backend/modules/seller-home/dto/seller-home-dashboard.dto";

/**
 * 판매자 스토어 홈 대시보드 API
 *
 * 엔드포인트는 `/seller/store/:storeId/home` 아래에 둡니다.
 */
@ApiTags("스토어 홈")
@ApiExtraModels(
  SellerHomeDashboardResponseDto,
  OrderResponseDto,
  SellerNotificationItemResponseDto,
  FeedResponseDto,
)
@Controller(`${USER_ROLES.SELLER}/store`)
@Auth({ isPublic: false, roles: ["SELLER", "ADMIN"] })
export class SellerHomeController {
  constructor(private readonly sellerHomeService: SellerHomeService) {}

  @Get(":storeId/home")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 홈 대시보드",
    description:
      "해당 스토어의 최근 주문·오늘(Asia/Seoul) 픽업 예정 주문·최근 알림·최근 피드를 한 번에 조회합니다. 스토어 소유자만 접근 가능합니다.",
  })
  @SwaggerResponse(200, { dataDto: SellerHomeDashboardResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(403, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(403, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.STORE_NOT_OWNED),
  })
  async getHomeDashboard(
    @Param("storeId") storeId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<SellerHomeDashboardResponseDto> {
    return await this.sellerHomeService.getDashboard(storeId, req.user);
  }
}
