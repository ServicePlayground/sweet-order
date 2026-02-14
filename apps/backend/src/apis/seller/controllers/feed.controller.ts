import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  Param,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { FeedService } from "@apps/backend/modules/feed/feed.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { createMessageObject } from "@apps/backend/common/utils/message.util";
import {
  AUTH_ERROR_MESSAGES,
  USER_ROLES,
} from "@apps/backend/modules/auth/constants/auth.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  FEED_ERROR_MESSAGES,
  FEED_SUCCESS_MESSAGES,
} from "@apps/backend/modules/feed/constants/feed.constants";
import {
  CreateFeedRequestDto,
  CreateFeedResponseDto,
} from "@apps/backend/modules/feed/dto/feed-create.dto";
import {
  UpdateFeedRequestDto,
  UpdateFeedResponseDto,
} from "@apps/backend/modules/feed/dto/feed-update.dto";
import { FeedListResponseDto } from "@apps/backend/modules/feed/dto/feed-list.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
import { FeedResponseDto } from "@apps/backend/modules/feed/dto/feed-detail.dto";

/**
 * 피드 관련 컨트롤러 (판매자용)
 */
@ApiTags("피드")
@ApiExtraModels(CreateFeedResponseDto, UpdateFeedResponseDto, FeedListResponseDto, FeedResponseDto)
@Controller(`${USER_ROLES.SELLER}/store/:storeId/feed`)
@Auth({ isPublic: false, roles: ["USER", "SELLER", "ADMIN"] })
export class SellerFeedController {
  constructor(private readonly feedService: FeedService) {}

  /**
   * 피드 목록 조회 API
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 피드 목록 조회",
    description: "자신이 소유한 스토어의 피드 목록을 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: FeedListResponseDto })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(FEED_ERROR_MESSAGES.FEED_FORBIDDEN),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject("스토어를 찾을 수 없습니다.") })
  async getFeeds(
    @Param("storeId") storeId: string,
    @Request() req: { user: JwtVerifiedPayload },
    @Query() query: PaginationRequestDto,
  ) {
    return await this.feedService.getFeedsByStoreIdForSeller(storeId, req.user, query);
  }

  /**
   * 피드 상세 조회 API
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 피드 상세 조회",
    description: "자신이 소유한 스토어의 피드 상세 정보를 조회합니다.",
  })
  @SwaggerResponse(200, { dataDto: FeedResponseDto })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(FEED_ERROR_MESSAGES.FEED_FORBIDDEN),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject(FEED_ERROR_MESSAGES.FEED_NOT_FOUND) })
  async getFeedDetail(
    @Param("storeId") storeId: string,
    @Param("id") feedId: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    return await this.feedService.getFeedByIdForSeller(feedId, req.user);
  }

  /**
   * 피드 등록 API
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 피드 등록",
    description: "판매자가 스토어 피드를 등록합니다.",
  })
  @SwaggerResponse(201, { dataDto: CreateFeedResponseDto })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject("스토어를 찾을 수 없습니다.") })
  @SwaggerResponse(401, {
    dataExample: createMessageObject("스토어를 수정할 권한이 없습니다."),
  })
  async createFeed(
    @Param("storeId") storeId: string,
    @Request() req: { user: JwtVerifiedPayload },
    @Body() createFeedDto: CreateFeedRequestDto,
  ) {
    // storeId를 DTO에 설정
    createFeedDto.storeId = storeId;
    return await this.feedService.createFeed(req.user.sub, createFeedDto);
  }

  /**
   * 피드 수정 API
   */
  @Put(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 피드 수정",
    description: "판매자가 등록한 스토어 피드를 수정합니다.",
  })
  @SwaggerResponse(200, { dataDto: UpdateFeedResponseDto })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(FEED_ERROR_MESSAGES.FEED_FORBIDDEN),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject(FEED_ERROR_MESSAGES.FEED_NOT_FOUND) })
  async updateFeed(
    @Param("storeId") storeId: string,
    @Param("id") id: string,
    @Body() updateFeedDto: UpdateFeedRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    return await this.feedService.updateFeed(id, updateFeedDto, req.user);
  }

  /**
   * 피드 삭제 API
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 스토어 피드 삭제",
    description: "판매자가 등록한 스토어 피드를 삭제합니다.",
  })
  @SwaggerResponse(200, {
    dataExample: createMessageObject(FEED_SUCCESS_MESSAGES.FEED_DELETED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_INVALID),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_MISSING),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ACCESS_TOKEN_WRONG_TYPE),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(AUTH_ERROR_MESSAGES.ROLE_NOT_AUTHORIZED),
  })
  @SwaggerResponse(401, {
    dataExample: createMessageObject(FEED_ERROR_MESSAGES.FEED_FORBIDDEN),
  })
  @SwaggerResponse(404, { dataExample: createMessageObject(FEED_ERROR_MESSAGES.FEED_NOT_FOUND) })
  async deleteFeed(
    @Param("storeId") storeId: string,
    @Param("id") id: string,
    @Request() req: { user: JwtVerifiedPayload },
  ) {
    await this.feedService.deleteFeed(id, req.user);
    return createMessageObject(FEED_SUCCESS_MESSAGES.FEED_DELETED);
  }
}
