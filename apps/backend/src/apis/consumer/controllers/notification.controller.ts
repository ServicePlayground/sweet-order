import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { SwaggerAuthResponses } from "@apps/backend/common/decorators/swagger-auth-responses.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { AUDIENCE } from "@apps/backend/modules/auth/constants/auth.constants";
import { NotificationService } from "@apps/backend/modules/notification/services/notification.service";
import {
  UserNotificationListQueryDto,
  UserNotificationListResponseDto,
  UserNotificationUnreadCountResponseDto,
} from "@apps/backend/modules/notification/dto/user-notification.dto";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";

@ApiTags("알림")
@ApiExtraModels(
  UserNotificationListResponseDto,
  PaginationMetaResponseDto,
  UserNotificationUnreadCountResponseDto,
)
@Controller(`${AUDIENCE.CONSUMER}/notifications`)
@Auth({ isPublic: false, audiences: ["consumer"] }) // 구매자 JWT(aud: user)만 허용
export class ConsumerNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: "(로그인) 사용자 웹 주문 알림 목록" })
  @SwaggerResponse(200, { dataDto: UserNotificationListResponseDto })
  @SwaggerAuthResponses()
  async list(
    @Query() query: UserNotificationListQueryDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const { items, meta } = await this.notificationService.listUserWebOrderNotifications({
      userId: req.user.sub,
      unreadOnly: Boolean(query.unreadOnly),
      page,
      limit,
    });
    return { data: items, meta };
  }

  @Get("unread-count")
  @ApiOperation({ summary: "(로그인) 주문 알림 미읽음 개수" })
  @SwaggerResponse(200, { dataDto: UserNotificationUnreadCountResponseDto })
  @SwaggerAuthResponses()
  async unreadCount(
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<UserNotificationUnreadCountResponseDto> {
    const count = await this.notificationService.countUnreadUserWebOrderNotifications(req.user.sub);
    return { count };
  }

  @Patch("read-all")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "주문 알림 모두 읽음" })
  @SwaggerResponse(200, { dataExample: { ok: true } })
  @SwaggerAuthResponses()
  async markAllRead(@Request() req: { user: JwtVerifiedPayload }): Promise<{ ok: true }> {
    await this.notificationService.markAllReadUserWebOrderNotifications(req.user.sub);
    return { ok: true };
  }

  @Patch(":id/read")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "주문 알림 읽음 처리" })
  @SwaggerResponse(200, { dataExample: { ok: true } })
  @SwaggerAuthResponses()
  async markRead(
    @Param("id") id: string,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<{ ok: true }> {
    await this.notificationService.markReadUserWeb({ userId: req.user.sub, notificationId: id });
    return { ok: true };
  }
}
