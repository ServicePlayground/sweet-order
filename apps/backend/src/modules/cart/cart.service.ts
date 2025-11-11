import { Injectable } from "@nestjs/common";
import { CartService as CartDataService } from "@apps/backend/modules/cart/services/cart.service";
import {
  AddCartItemRequestDto,
  UpdateCartItemRequestDto,
} from "@apps/backend/modules/cart/dto/cart-request.dto";

/**
 * 장바구니 서비스
 *
 * 모든 장바구니 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * CartDataService를 조합하여 사용합니다.
 */
@Injectable()
export class CartService {
  constructor(private readonly cartDataService: CartDataService) {}

  /**
   * 장바구니 목록 조회
   */
  async getCartItems(userId: string) {
    return this.cartDataService.getCartItems(userId);
  }

  /**
   * 장바구니에 상품 추가
   */
  async addCartItem(userId: string, addCartItemDto: AddCartItemRequestDto) {
    return this.cartDataService.addCartItem(userId, addCartItemDto);
  }

  /**
   * 장바구니 항목 수정
   */
  async updateCartItem(userId: string, cartItemId: string, updateCartItemDto: UpdateCartItemRequestDto) {
    return this.cartDataService.updateCartItem(userId, cartItemId, updateCartItemDto);
  }

  /**
   * 장바구니 항목 삭제
   */
  async removeCartItem(userId: string, cartItemId: string) {
    return this.cartDataService.removeCartItem(userId, cartItemId);
  }

  /**
   * 장바구니 전체 삭제
   */
  async clearCart(userId: string) {
    return this.cartDataService.clearCart(userId);
  }
}

