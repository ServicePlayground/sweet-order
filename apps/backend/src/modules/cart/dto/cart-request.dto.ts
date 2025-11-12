import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsObject } from "class-validator";
import { StringToNumber } from "@apps/backend/common/decorators/transform.decorator";
import { SWAGGER_EXAMPLES } from "@apps/backend/modules/cart/constants/cart.constants";
import { SWAGGER_EXAMPLES as PRODUCT_SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";
import { OrderFormData } from "@apps/backend/modules/product/type/product.type";

/**
 * 장바구니에 상품 추가 요청 DTO
 */
export class AddCartItemRequestDto {
  @ApiProperty({
    description: "상품 ID",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.id,
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({
    description: "수량",
    example: SWAGGER_EXAMPLES.CART_ITEM.quantity,
    minimum: 1,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: "주문 폼 데이터 (JSON) - orderFormSchema의 field.id를 키로 하는 객체",
    example: SWAGGER_EXAMPLES.CART_ITEM.orderFormData,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  orderFormData?: OrderFormData;
}

/**
 * 장바구니 항목 수정 요청 DTO
 */
export class UpdateCartItemRequestDto {
  @ApiProperty({
    description: "수량",
    example: SWAGGER_EXAMPLES.CART_ITEM.quantity,
    minimum: 1,
  })
  @StringToNumber()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: "주문 폼 데이터 (JSON) - orderFormSchema의 field.id를 키로 하는 객체",
    example: SWAGGER_EXAMPLES.CART_ITEM.orderFormData,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  orderFormData?: OrderFormData;
}

