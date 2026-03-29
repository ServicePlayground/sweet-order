import type {
  GetSellerStoresRequestDto,
  StoreAddressDto,
  StoreBankName,
} from "@/apps/web-seller/features/store/types/store.dto";

/** UI 폼: 스토어 기본 정보 + 정산 계좌 + 주소 (스토어 생성/수정 폼) */
export interface StoreForm extends StoreAddressDto {
  name: string;
  description?: string;
  logoImageUrl?: string;
  // 정산 계좌
  bankAccountNumber: string;
  bankName: StoreBankName | "";
  accountHolderName: string;
  /** 채널 정보 */
  kakaoChannelId?: string;
  instagramId?: string;
}

/** 쿼리 키/옵션용 (page 제외, 클라이언트 전용) */
export type GetSellerStoresQueryParams = Omit<GetSellerStoresRequestDto, "page">;
