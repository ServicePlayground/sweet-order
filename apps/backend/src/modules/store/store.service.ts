import { Injectable } from "@nestjs/common";
import { StoreCreateService } from "@apps/backend/modules/store/services/store-create.service";
import { StoreListService } from "@apps/backend/modules/store/services/store-list.service";
import { StoreUpdateService } from "@apps/backend/modules/store/services/store-update.service";
import { CreateStoreRequestDto } from "@apps/backend/modules/store/dto/store-create.dto";
import { UpdateStoreRequestDto } from "@apps/backend/modules/store/dto/store-update.dto";
import { PaginationRequestDto } from "@apps/backend/common/dto/pagination-request.dto";
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
   * 스토어 상세 조회 (사용자용)
   * @param storeId 스토어 ID
   * @param user 로그인한 사용자 정보 (옵셔널)
   * @returns 스토어 상세 정보
   */
  async getStoreByIdForUser(storeId: string, user?: JwtVerifiedPayload) {
    return await this.storeListService.getStoreByIdForUser(storeId, user);
  }

  /**
   * 스토어 생성 (판매자용)
   * 1단계, 2단계 API를 다시 호출하여 검증하고 스토어를 생성합니다.
   */
  async createStoreForSeller(userId: string, createStoreDto: CreateStoreRequestDto) {
    return await this.storeCreateService.createStoreForSeller(userId, createStoreDto);
  }

  /**
   * 사용자의 스토어 목록 조회 (판매자용)
   * @param userId 사용자 ID
   * @param query 페이지네이션 쿼리 파라미터
   * @returns 스토어 목록
   */
  async getStoresByUserIdForSeller(userId: string, query: PaginationRequestDto) {
    return await this.storeListService.getStoresByUserIdForSeller(userId, query);
  }

  /**
   * 스토어 상세 조회 (판매자용)
   * @param storeId 스토어 ID
   * @param user 인증된 사용자 정보
   * @returns 스토어 상세 정보
   */
  async getStoreByIdForSeller(storeId: string, user: JwtVerifiedPayload) {
    return await this.storeListService.getStoreByIdForSeller(storeId, user);
  }

  /**
   * 스토어 수정 (판매자용)
   * @param storeId 스토어 ID
   * @param updateStoreDto 수정할 스토어 정보
   * @param user 인증된 사용자 정보
   * @returns 수정된 스토어 ID
   */
  async updateStoreForSeller(
    storeId: string,
    updateStoreDto: UpdateStoreRequestDto,
    user: JwtVerifiedPayload,
  ) {
    return await this.storeUpdateService.updateStoreForSeller(storeId, updateStoreDto, user);
  }
}
