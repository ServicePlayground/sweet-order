import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsDateString,
  Min,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/order/constants/order.constants";

/**
 * 주문 항목 생성 요청 DTO
 */
export class CreateOrderItemDto {
  @ApiProperty({
    description: "픽업 날짜 및 시간 (ISO 8601 형식, 필수)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.pickupDate,
  })
  @IsNotEmpty()
  @IsDateString()
  pickupDate: string;

  // 사이즈 옵션 정보 (옵션이 없는 상품의 경우 생략 가능)
  @ApiPropertyOptional({
    description: "선택한 사이즈 옵션 ID (사이즈 옵션이 없는 상품의 경우 생략)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizeId,
  })
  @IsOptional()
  @IsString()
  sizeId?: string;

  @ApiPropertyOptional({
    description: "선택한 사이즈 표시명 (사이즈 옵션이 없는 상품의 경우 생략)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizeDisplayName,
  })
  @IsOptional()
  @IsString()
  sizeDisplayName?: string;

  @ApiPropertyOptional({
    description: "선택한 사이즈 길이 (cm 단위, 사이즈 옵션이 없는 상품의 경우 생략)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizeLengthCm,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sizeLengthCm?: number;

  @ApiPropertyOptional({
    description: "선택한 사이즈 설명",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizeDescription,
  })
  @IsOptional()
  @IsString()
  sizeDescription?: string;

  @ApiPropertyOptional({
    description: "사이즈 추가 가격 (사이즈 옵션이 없으면 0 또는 생략)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.sizePrice,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sizePrice?: number;

  // 맛 옵션 정보 (옵션이 없는 상품의 경우 생략 가능)
  @ApiPropertyOptional({
    description: "선택한 맛 옵션 ID (맛 옵션이 없는 상품의 경우 생략)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.flavorId,
  })
  @IsOptional()
  @IsString()
  flavorId?: string;

  @ApiPropertyOptional({
    description: "선택한 맛 표시명 (맛 옵션이 없는 상품의 경우 생략)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.flavorDisplayName,
  })
  @IsOptional()
  @IsString()
  flavorDisplayName?: string;

  @ApiPropertyOptional({
    description: "맛 추가 가격 (맛 옵션이 없으면 0 또는 생략)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.flavorPrice,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  flavorPrice?: number;

  @ApiPropertyOptional({
    description: "레터링 메시지 (최대 500자)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.letteringMessage,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  letteringMessage?: string;

  @ApiPropertyOptional({
    description: "요청 사항",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.requestMessage,
  })
  @IsOptional()
  @IsString()
  requestMessage?: string;

  @ApiProperty({
    description: "수량",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.quantity,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: "업로드한 이미지 URL 목록 (커스텀 케이크용, 없으면 빈 배열 또는 생략)",
    example: SWAGGER_EXAMPLES.ORDER_ITEM.imageUrls,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}

/**
 * 주문 생성 요청 DTO
 *
 * 하나의 주문은 하나의 상품(productId)에 대한 주문이지만,
 * 여러 개의 주문 항목(items)을 가질 수 있습니다.
 * 각 주문 항목은 서로 다른 옵션 조합(날짜/시간, 사이즈, 맛 등)을 가질 수 있습니다.
 *
 * 예시:
 * - 같은 케이크를 1월 1일 오후 12시에 도시락 사이즈로 주문
 * - 같은 케이크를 1월 1일 오후 2시에 미니 사이즈로 주문
 * - 두 항목이 하나의 주문에 포함됨
 */
export class CreateOrderRequestDto {
  @ApiProperty({
    description: "상품 ID (하나의 주문은 하나의 상품에 대한 주문)",
    example: SWAGGER_EXAMPLES.ORDER_DATA.productId,
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({
    description: "총 수량",
    example: SWAGGER_EXAMPLES.ORDER_DATA.totalQuantity,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  totalQuantity: number;

  @ApiProperty({
    description: "총 금액",
    example: SWAGGER_EXAMPLES.ORDER_DATA.totalPrice,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @ApiPropertyOptional({
    description: "픽업 주소 (지번 주소)",
    example: SWAGGER_EXAMPLES.ORDER_DATA.pickupAddress,
  })
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiPropertyOptional({
    description: "픽업 주소 (도로명 주소)",
    example: SWAGGER_EXAMPLES.ORDER_DATA.pickupRoadAddress,
  })
  @IsOptional()
  @IsString()
  pickupRoadAddress?: string;

  @ApiPropertyOptional({
    description: "픽업 장소 우편번호",
    example: SWAGGER_EXAMPLES.ORDER_DATA.pickupZonecode,
  })
  @IsOptional()
  @IsString()
  pickupZonecode?: string;

  @ApiPropertyOptional({
    description: "픽업 장소 위도",
    example: SWAGGER_EXAMPLES.ORDER_DATA.pickupLatitude,
  })
  @IsOptional()
  @IsNumber()
  pickupLatitude?: number;

  @ApiPropertyOptional({
    description: "픽업 장소 경도",
    example: SWAGGER_EXAMPLES.ORDER_DATA.pickupLongitude,
  })
  @IsOptional()
  @IsNumber()
  pickupLongitude?: number;

  @ApiProperty({
    description: "주문 항목 목록 (같은 상품의 여러 옵션 조합을 포함할 수 있음)",
    type: [CreateOrderItemDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

/**
 * 주문 생성 응답 DTO
 * 주문 생성 시 주문 ID만 반환합니다.
 */
export class CreateOrderResponseDto {
  @ApiProperty({
    description: "주문 ID",
    example: SWAGGER_EXAMPLES.ORDER_DATA.id,
  })
  id: string;
}
