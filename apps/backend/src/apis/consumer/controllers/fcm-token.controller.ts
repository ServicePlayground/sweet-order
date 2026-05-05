import { Body, Controller, HttpCode, HttpStatus, Post, Request } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AUDIENCE } from "@apps/backend/modules/auth/constants/auth.constants";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { SwaggerAuthResponses } from "@apps/backend/common/decorators/swagger-auth-responses.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { SyncConsumerFcmTokenBodyDto } from "@apps/backend/modules/fcm/dto/consumer-fcm-token.dto";
import { ConsumerFcmTokenService } from "@apps/backend/modules/fcm/services/consumer-fcm-token.service";

@ApiTags("FCM 토큰")
@Controller(`${AUDIENCE.CONSUMER}/fcm-tokens`)
@Auth({ isPublic: false, audiences: ["consumer"] }) // 구매자 JWT(aud: consumer)만 허용
export class ConsumerFcmTokenController {
  constructor(private readonly consumerFcmTokenService: ConsumerFcmTokenService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "(로그인 필요) FCM 디바이스 토큰 동기화 (토큰 갱신/추가, 빈 토큰 전달 시 해당 디바이스 토큰 제거)",
  })
  @SwaggerResponse(200, { dataExample: { ok: true } })
  @SwaggerAuthResponses()
  async syncFcmToken(
    @Body() body: SyncConsumerFcmTokenBodyDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<{ ok: true }> {
    await this.consumerFcmTokenService.syncToken(req.user.sub, body.deviceId, body.token);
    return { ok: true };
  }
}
