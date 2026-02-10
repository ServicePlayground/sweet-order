import { Controller, Get, Param, HttpCode, HttpStatus, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-response.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 스토어 관련 컨트롤러
 */
@ApiTags("스토어")
@ApiExtraModels(StoreResponseDto)
@Controller(`${USER_ROLES.USER}/store`)
@Auth({ isOptionalPublic: true }) // 선택적 인증: 토큰이 있으면 검증하고 user 설정, 없으면 통과
export class UserStoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * 스토어 상세 조회 API
   * 특정 스토어의 상세 정보를 조회합니다.
   * 로그인한 사용자의 경우 해당 스토어의 좋아요 여부(isLiked)도 함께 반환됩니다.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 상세 조회",
    description:
      "특정 스토어의 상세 정보를 조회합니다. 로그인한 사용자의 경우 해당 스토어의 좋아요 여부(isLiked)도 함께 반환됩니다.",
  })
  @SwaggerResponse(200, { dataDto: StoreResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND) })
  async getStoreDetail(
    @Param("id") id: string,
    @Request() req: { user?: JwtVerifiedPayload },
  ) {
    return await this.storeService.getStoreById(id, req.user);
  }
}
