import {
  Controller,
  Get,
  Put,
  Body,
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
  SellerNotificationListQueryDto,
  SellerNotificationListResponseDto,
  SellerNotificationMarkAllReadBodyDto,
  SellerNotificationPreferenceQueryDto,
  SellerNotificationPreferenceResponseDto,
  SellerNotificationPreferenceUpdateDto,
  SellerNotificationUnreadCountQueryDto,
  SellerNotificationUnreadCountResponseDto,
} from "@apps/backend/modules/notification/dto/seller-notification.dto";
import { PaginationMetaResponseDto } from "@apps/backend/common/dto/pagination-response.dto";

@ApiTags("알림")
@ApiExtraModels(
  SellerNotificationListResponseDto,
  PaginationMetaResponseDto,
  SellerNotificationPreferenceResponseDto,
  SellerNotificationUnreadCountResponseDto,
)
@Controller(`${AUDIENCE.SELLER}/notifications`)
@Auth({ isPublic: false, audiences: ["seller"] }) // 판매자 JWT(aud: seller)만 허용
export class SellerNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: "판매자 웹 알림 목록 (스토어별)" })
  @SwaggerResponse(200, { dataDto: SellerNotificationListResponseDto })
  @SwaggerAuthResponses()
  async list(
    @Query() query: SellerNotificationListQueryDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const { items, meta } = await this.notificationService.listSellerWebForStore({
      userId: req.user.sub,
      storeId: query.storeId,
      unreadOnly: Boolean(query.unreadOnly),
      page,
      limit,
    });
    return { data: items, meta };
  }

  @Get("unread-count")
  @ApiOperation({ summary: "안 읽은 알림 개수 (스토어별)" })
  @SwaggerResponse(200, { dataDto: SellerNotificationUnreadCountResponseDto })
  @SwaggerAuthResponses()
  async unreadCount(
    @Query() query: SellerNotificationUnreadCountQueryDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<SellerNotificationUnreadCountResponseDto> {
    const count = await this.notificationService.countUnreadSellerWebForStore(
      req.user.sub,
      query.storeId,
    );
    return { count };
  }

  @Get("preferences")
  @ApiOperation({ summary: "판매자 웹 알림 설정 조회 (스토어별)" })
  @SwaggerResponse(200, { dataDto: SellerNotificationPreferenceResponseDto })
  @SwaggerAuthResponses()
  async getPreferences(
    @Query() query: SellerNotificationPreferenceQueryDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<SellerNotificationPreferenceResponseDto> {
    return this.notificationService.getOrCreatePreferenceSellerWeb(req.user.sub, query.storeId);
  }

  @Put("preferences")
  @ApiOperation({ summary: "판매자 웹 알림 설정 저장 (스토어별)" })
  @SwaggerResponse(200, { dataDto: SellerNotificationPreferenceResponseDto })
  @SwaggerAuthResponses()
  async putPreferences(
    @Body() body: SellerNotificationPreferenceUpdateDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<SellerNotificationPreferenceResponseDto> {
    const { storeId, ...patch } = body;
    return this.notificationService.updatePreferenceSellerWeb(req.user.sub, storeId, patch);
  }

  @Patch("read-all")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "알림 모두 읽음 (스토어별)" })
  @SwaggerResponse(200, { dataExample: { ok: true } })
  @SwaggerAuthResponses()
  async markAllRead(
    @Body() body: SellerNotificationMarkAllReadBodyDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<{ ok: true }> {
    await this.notificationService.markAllReadSellerWebForStore({
      userId: req.user.sub,
      storeId: body.storeId,
    });
    return { ok: true };
  }

  @Patch(":id/read")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "알림 읽음 처리 (스토어별)" })
  @SwaggerResponse(200, { dataExample: { ok: true } })
  @SwaggerAuthResponses()
  async markRead(
    @Param("id") id: string,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<{ ok: true }> {
    await this.notificationService.markReadSellerWeb({ userId: req.user.sub, notificationId: id });
    return { ok: true };
  }
}
