import { Injectable } from "@nestjs/common";
import { StoreCreationService } from "@apps/backend/modules/store/services/store-creation.service";
import { StoreListService } from "@apps/backend/modules/store/services/store-list.service";
import { CreateStoreRequestDto } from "@apps/backend/modules/store/dto/store.request.dto";

/**
 * 스토어 서비스
 *
 * 스토어 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * StoreCreationService, StoreListService를 조합하여 사용합니다.
 */
@Injectable()
export class StoreService {
  constructor(
    private readonly storeCreationService: StoreCreationService,
    private readonly storeListService: StoreListService,
  ) {}

  /**
   * 스토어 생성 (3단계)
   * 1단계, 2단계 API를 다시 호출하여 검증하고 스토어를 생성합니다.
   */
  async createStore(userId: string, createStoreDto: CreateStoreRequestDto) {
    return await this.storeCreationService.createStore(userId, createStoreDto);
  }

  /**
   * 사용자의 스토어 목록 조회
   * @param userId 사용자 ID
   * @returns 스토어 목록
   */
  async getStoresByUserId(userId: string) {
    return await this.storeListService.getStoresByUserId(userId);
  }
}
