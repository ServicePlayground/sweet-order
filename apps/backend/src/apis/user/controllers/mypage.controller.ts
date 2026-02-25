import { Controller, Get, Query, Param, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiExtraModels } from "@nestjs/swagger";
import { OrderService } from "@apps/backend/modules/order/order.service";
import { ReviewService } from "@apps/backend/modules/review/review.service";
import { LikeService } from "@apps/backend/modules/like/like.service";
import { Auth } from "@apps/backend/modules/auth/decorators/auth.decorator";
import { SwaggerResponse } from "@apps/backend/common/decorators/swagger-response.decorator";
import { SwaggerAuthResponses } from "@apps/backend/common/decorators/swagger-auth-responses.decorator";
import { USER_ROLES } from "@apps/backend/modules/auth/constants/auth.constants";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";
import {
  OrderListResponseDto,
  OrderListRequestDto,
} from "@apps/backend/modules/order/dto/order-list.dto";
import { OrderResponseDto } from "@apps/backend/modules/order/dto/order-detail.dto";
import {
  GetMyReviewsRequestDto,
  MyReviewListResponseDto,
} from "@apps/backend/modules/review/dto/review-user-list.dto";
import {
  GetStoresRequestDto,
  StoreListResponseDto,
} from "@apps/backend/modules/store/dto/store-list.dto";
import {
  GetProductsRequestDto,
  ProductListResponseDto,
} from "@apps/backend/modules/product/dto/product-list.dto";
import { ORDER_ERROR_MESSAGES } from "@apps/backend/modules/order/constants/order.constants";
import { createMessageObject } from "@apps/backend/common/utils/message.util";

/**
 * 마이페이지 컨트롤러
 * 사용자용 마이페이지 관련 API 엔드포인트를 제공합니다.
 */
@ApiTags("마이페이지")
@ApiExtraModels(
  OrderListResponseDto,
  OrderResponseDto,
  MyReviewListResponseDto,
  StoreListResponseDto,
  ProductListResponseDto,
)
@Controller(`${USER_ROLES.USER}/mypage`)
@Auth({ isPublic: false, roles: ["USER", "SELLER", "ADMIN"] }) // 인증 필수
export class UserMypageController {
  constructor(
    private readonly orderService: OrderService,
    private readonly reviewService: ReviewService,
    private readonly likeService: LikeService,
  ) {}

  /**
   * 내 주문 목록 조회 API
   */
  @Get("orders")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 내 주문 목록 조회",
    description:
      "자신의 주문 목록을 조회합니다. 픽업 예정/지난 예약(type), 스토어/상태/기간/주문번호 필터, 정렬(sortBy), 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: OrderListResponseDto })
  @SwaggerAuthResponses()
  async getMyOrders(
    @Query() query: OrderListRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<OrderListResponseDto> {
    return await this.orderService.getUserOrdersForUser(query, req.user);
  }

  /**
   * 내 주문 상세 조회 API
   * 자신의 주문 상세 정보를 조회합니다.
   */
  @Get("orders/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 내 주문 상세 조회",
    description:
      "주문 ID를 통해 자신의 주문 상세 정보를 조회합니다. 자신의 주문만 조회할 수 있습니다.",
  })
  @SwaggerResponse(200, { dataDto: OrderResponseDto })
  @SwaggerAuthResponses()
  @SwaggerResponse(403, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.FORBIDDEN),
  })
  @SwaggerResponse(404, {
    dataExample: createMessageObject(ORDER_ERROR_MESSAGES.NOT_FOUND),
  })
  async getMyOrderById(
    @Param("id") id: string,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<OrderResponseDto> {
    return await this.orderService.getOrderByIdForUser(id, req.user);
  }

  /**
   * 내가 작성한 후기 목록 조회 API
   * 자신이 작성한 후기 목록을 조회합니다.
   */
  @Get("reviews")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 내가 작성한 후기 목록 조회",
    description: "자신이 작성한 후기 목록을 조회합니다. 정렬, 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: MyReviewListResponseDto })
  @SwaggerAuthResponses()
  async getMyReviews(
    @Query() query: GetMyReviewsRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<MyReviewListResponseDto> {
    return await this.reviewService.getMyReviewsForUser(req.user.sub, query);
  }

  /**
   * 내가 좋아요한 스토어 목록 조회 API
   */
  @Get("likes/stores")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 내가 좋아요한 스토어 목록 조회",
    description:
      "자신이 좋아요한 스토어 목록을 조회합니다. 정렬(sortBy), 스토어명 검색(search), 지역(regions) 필터, 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: StoreListResponseDto })
  @SwaggerAuthResponses()
  async getMyStoreLikes(
    @Query() query: GetStoresRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<StoreListResponseDto> {
    return await this.likeService.getMyStoreLikesForUser(req.user.sub, query);
  }

  /**
   * 내가 좋아요한 상품 목록 조회 API
   */
  @Get("likes/products")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "(로그인 필요) 내가 좋아요한 상품 목록 조회",
    description:
      "자신이 좋아요한 상품 목록을 조회합니다. 정렬(sortBy), 검색/가격/스토어/타입/카테고리/지역 필터, 페이지네이션을 지원합니다.",
  })
  @SwaggerResponse(200, { dataDto: ProductListResponseDto })
  @SwaggerAuthResponses()
  async getMyProductLikes(
    @Query() query: GetProductsRequestDto,
    @Request() req: { user: JwtVerifiedPayload },
  ): Promise<ProductListResponseDto> {
    return await this.likeService.getMyProductLikesForUser(req.user.sub, query);
  }
}
