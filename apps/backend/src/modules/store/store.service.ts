import { Injectable } from "@nestjs/common";
import { StoreCreateService } from "@apps/backend/modules/store/services/store-create.service";
import { StoreListService } from "@apps/backend/modules/store/services/store-list.service";
import { StoreUpdateService } from "@apps/backend/modules/store/services/store-update.service";
import { CreateStoreRequestDto } from "@apps/backend/modules/store/dto/store-create.dto";
import { UpdateStoreRequestDto } from "@apps/backend/modules/store/dto/store-update.dto";
import {
  GetStoresRequestDto,
  GetSellerStoresRequestDto,
} from "@apps/backend/modules/store/dto/store-list.dto";
import { JwtVerifiedPayload } from "@apps/backend/modules/auth/types/auth.types";

/**
 * 스토어 서비스
 *
 * 스토어 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * StoreCreateService, StoreListService를 조합하여 사용합니다.
 */
@Injectable()
export class StoreService {
  constructor(
    private readonly storeCreateService: StoreCreateService,
    private readonly storeListService: StoreListService,
    private readonly storeUpdateService: StoreUpdateService,
  ) {}

  /**
   * 스토어 목록 조회 (사용자용)
   */
  async getStoresForUser(query: GetStoresRequestDto, user?: JwtVerifiedPayload) {
    return await this.storeListService.getStoresForUser(query, user);
  }

  /**
   * 스토어 상세 조회 (사용자용)
   */
  async getStoreByIdForUser(storeId: string, user?: JwtVerifiedPayload) {
    return await this.storeListService.getStoreByIdForUser(storeId, user);
  }

  /**
   * 내 스토어 목록 조회 (판매자용)
   */
  async getStoresByUserIdForSeller(userId: string, query: GetSellerStoresRequestDto) {
    return await this.storeListService.getStoresByUserIdForSeller(userId, query);
  }

  /**
   * 내 스토어 상세 조회 (판매자용)
   */
  async getStoreByIdForSeller(storeId: string, user: JwtVerifiedPayload) {
    return await this.storeListService.getStoreByIdForSeller(storeId, user);
  }

  /**
   * 스토어 생성 (판매자용)
   * 1단계, 2단계 API를 다시 호출하여 검증하고 스토어를 생성합니다.
   */
  async createStoreForSeller(userId: string, createStoreDto: CreateStoreRequestDto) {
    return await this.storeCreateService.createStoreForSeller(userId, createStoreDto);
  }

  /**
   * 스토어 수정 (판매자용)
   */
  async updateStoreForSeller(
    storeId: string,
    updateStoreDto: UpdateStoreRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return await this.storeUpdateService.updateStoreForSeller(storeId, updateStoreDto, user);
  }
}
