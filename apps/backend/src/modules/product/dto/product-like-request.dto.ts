import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { SWAGGER_EXAMPLES as PRODUCT_SWAGGER_EXAMPLES } from "@apps/backend/modules/product/constants/product.constants";

/**
 * 상품 좋아요 추가 요청 DTO
 */
export class AddProductLikeRequestDto {
  @ApiProperty({
    description: "상품 ID",
    example: PRODUCT_SWAGGER_EXAMPLES.PRODUCT_DATA.id,
  })
  @IsNotEmpty()
  @IsString()
  productId: string;
}

