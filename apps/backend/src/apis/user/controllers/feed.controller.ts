import { Controller, Get, Param, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { FeedService } from "@apps/backend/modules/feed/feed.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { FEED_ERROR_MESSAGES } from "@apps/backend/modules/feed/constants/feed.constants";
import { FeedListResponseDto } from "@apps/backend/modules/feed/dto/feed-list.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { FeedResponseDto } from "@apps/backend/modules/feed/dto/feed-detail.dto";

/**
 * 피드 관련 컨트롤러
 */
@ApiTags("피드")
@ApiExtraModels(FeedListResponseDto, FeedResponseDto)
@Controller(`${USER_ROLES.USER}/feed`)
@Auth({ isPublic: true })
export class UserFeedController {
  constructor(private readonly feedService: FeedService) {}

  /**
   * 스토어 피드 목록 조회 API
   */
  @Get("store/:storeId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 피드 목록 조회",
    description: "특정 스토어의 피드 목록을 조회합니다. 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: FeedListResponseDto })
  async getFeeds(@Param("storeId") storeId: string, @Query() query: PaginationRequestDto) {
    return await this.feedService.getFeedsByStoreIdForUser(storeId, query);
  }

  /**
   * 스토어 피드 상세 조회 API
   */
  @Get("store/:storeId/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "스토어 피드 상세 조회",
    description: "특정 스토어 피드의 상세 정보를 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: FeedResponseDto })
  @SwaggerResponse(404, { dataExample: createMessageObject(FEED_ERROR_MESSAGES.FEED_NOT_FOUND) })
  async getFeedDetail(@Param("storeId") storeId: string, @Param("id") feedId: string) {
    return await this.feedService.getFeedByIdForUser(feedId);
  }
}
