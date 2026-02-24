import { Controller, Get, Param, Query, HttpCode, HttpStatus, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { StoreService } from "@apps/backend/modules/store/store.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { STORE_ERROR_MESSAGES } from "@apps/backend/modules/store/constants/store.constants";
import { StoreResponseDto } from "@apps/backend/modules/store/dto/store-detail.dto";
import {
  GetStoresRequestDto,
  StoreListResponseDto,
} from "@apps/backend/modules/store/dto/store-list.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import { StoreRegionDepthsResponseDto } from "@apps/backend/modules/store/dto/store-region-list.dto";

/**
 * 스토어 관련 컨트롤러
 */
@ApiTags("스토어")
@ApiExtraModels(StoreResponseDto, StoreListResponseDto, StoreRegionDepthsResponseDto)
@Controller(`${USER_ROLES.USER}/store`)
@Auth({ isOptionalPublic: true }) // 선택적 인증: 토큰이 있으면 검증하고 user 설정, 없으면 통과
export class UserStoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * 스토어 지역 depth 정보 조회 API
   *
   * - 응답: 시/도(1depth)별로 그룹화된 구/군(2depth) 목록과 해당 지역에 포함된 스토어 수를 반환합니다.
   *   스토어/상품 목록 조회 시 regions 쿼리 파라미터(예: "서울:전지역,인천:강화군,인천:옹진군")를 생성할 때 사용합니다.
   */
  @Get("regions")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 지역 depth 정보 조회",
    description:
      "시/도(1depth) 및 구/군(2depth) 지역 정보를 계층 구조로 반환합니다. " +
      "각 1depth·2depth에는 표시용 label, 주소 매칭용 searchKeywords, 해당 지역 스토어 수(storeCount)가 포함됩니다. " +
      "프론트에서는 이 데이터로 지역 필터 메뉴를 만들고, 선택한 지역의 searchKeywords로 스토어/상품 목록 API의 regions 파라미터를 조합해 보내면 됩니다." +
      "예시: '전지역', '전지역:전지역', '서울:전지역', '서울:전지역,경기:수원시', '경기:수원시,인천:강화군,인천:옹진군'",
  })
  @SwaggerResponse(200, { dataDto: StoreRegionDepthsResponseDto })
  async getStoreRegions() {
    return await this.storeService.getStoreRegions();
  }

  /**
   * 스토어 목록 조회 API
   * 검색어, 정렬, 페이지네이션을 지원합니다. 로그인한 사용자의 경우 각 스토어의 좋아요 여부(isLiked)도 반환됩니다.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 목록 조회",
    description:
      "스토어명 검색, 정렬, 페이지네이션을 지원하는 스토어 목록을 조회합니다. 로그인한 사용자의 경우 각 스토어의 좋아요 여부(isLiked)도 함께 반환됩니다.",
  })
  @SwaggerResponse(200, { dataDto: StoreListResponseDto })
  async getStores(
    @Query() query: GetStoresRequestDto,
    @Request() req: { user?: JwtVerifiedPayload },
  ) {
    return await this.storeService.getStoresForUser(query, req.user);
  }

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
  async getStoreDetail(@Param("id") id: string, @Request() req: { user?: JwtVerifiedPayload }) {
    return await this.storeService.getStoreByIdForUser(id, req.user);
  }
}
