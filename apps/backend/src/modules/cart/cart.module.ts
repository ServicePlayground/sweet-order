import { Module } from "@nestjs/common";
import { CartService } from "@apps/backend/modules/cart/cart.service";
import { CartService as CartDataService } from "@apps/backend/modules/cart/services/cart.service";

/**
 * 장바구니 모듈
 * 장바구니 관련 기능을 제공합니다.
 */
@Module({
  imports: [],
  providers: [CartService, CartDataService],
  exports: [CartService],
})
export class CartModule {}

