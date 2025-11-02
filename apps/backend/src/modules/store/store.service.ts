import { Injectable } from "@nestjs/common";
import { StoreCreationService } from "@apps/backend/modules/store/services/store-creation.service";
import { CreateStoreRequestDto } from "@apps/backend/modules/store/dto/store.request.dto";

/**
 * 스토어 서비스
 *
 * 스토어 관련 기능을 통합하여 제공하는 메인 서비스입니다.
 * StoreCreationService를 조합하여 사용합니다.
 */
@Injectable()
export class StoreService {
  constructor(private readonly storeCreationService: StoreCreationService) {}

  /**
   * 스토어 생성 (3단계)
   * 1단계, 2단계 API를 다시 호출하여 검증하고 스토어를 생성합니다.
   */
  async createStore(userId: string, createStoreDto: CreateStoreRequestDto) {
    return await this.storeCreationService.createStore(userId, createStoreDto);
  }
}
