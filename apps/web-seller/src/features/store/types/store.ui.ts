import type {
  GetSellerStoresRequestDto,
  StoreAddressDto,
} from "@/apps/web-seller/features/store/types/store.dto";

/** UI 폼: 스토어 기본 정보 + 주소 (스토어 생성/수정 폼) */
export interface StoreForm extends StoreAddressDto {
  name: string;
  description?: string;
  logoImageUrl?: string;
}

/** 쿼리 키/옵션용 (page 제외, 클라이언트 전용) */
export type GetSellerStoresQueryParams = Omit<GetSellerStoresRequestDto, "page">;
