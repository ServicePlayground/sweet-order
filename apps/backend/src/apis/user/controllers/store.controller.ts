import { Controller, Get, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import {
  STORE_ERROR_MESSAGES,
  SWAGGER_RESPONSE_EXAMPLES,
} from "@apps/backend/modules/store/constants/store.constants";

/**
 * 스토어 관련 컨트롤러
 */
@ApiTags("스토어")
@Controller(`${USER_ROLES.USER}/store`)
@Auth({ isPublic: true }) // 기본적으로 모든 엔드포인트에 통합 인증 가드 적용
export class UserStoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * 스토어 상세 조회 API
   * 특정 스토어의 상세 정보를 조회합니다.
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 상세 조회",
    description: "특정 스토어의 상세 정보를 조회합니다.",
  })
  @SwaggerResponse(200, SWAGGER_RESPONSE_EXAMPLES.STORE_DETAIL_RESPONSE)
  @SwaggerResponse(404, createMessageObject(STORE_ERROR_MESSAGES.NOT_FOUND))
  async getStoreDetail(@Param("id") id: string) {
    return await this.storeService.getStoreById(id);
  }
}
