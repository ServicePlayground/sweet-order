import type {
  StoreBankName,
  StoreResponseDto,
  UpdateStoreRequestDto,
} from "@/apps/web-seller/features/store/types/store.dto";
import type { StoreForm } from "@/apps/web-seller/features/store/types/store.ui";
import { normalizeRefundPolicyFromApi } from "@/apps/web-seller/features/store/utils/refund-cancellation-policy.util";

export function storeResponseToStoreForm(store: StoreResponseDto): StoreForm {
  return {
    name: store.name,
    description: store.description || "",
    phoneNumber: store.phoneNumber || "",
    logoImageUrl: store.logoImageUrl || "",
    kakaoChannelId: store.kakaoChannelId || "",
    instagramId: store.instagramId || "",
    bankAccountNumber: store.bankAccountNumber ?? "",
    bankName: (store.bankName ?? "") as StoreBankName | "",
    accountHolderName: store.accountHolderName ?? "",
    address: store.address,
    roadAddress: store.roadAddress,
    detailAddress: store.detailAddress,
    zonecode: store.zonecode,
    latitude: store.latitude,
    longitude: store.longitude,
    refundCancellationPolicy: normalizeRefundPolicyFromApi(store.refundCancellationPolicy),
  };
}

export function storeFormToUpdateRequest(data: StoreForm): UpdateStoreRequestDto {
  return {
    name: data.name,
    description: data.description || "",
    phoneNumber: data.phoneNumber.trim(),
    logoImageUrl: data.logoImageUrl || "",
    kakaoChannelId: data.kakaoChannelId?.trim() || "",
    instagramId: data.instagramId?.trim() || "",
    bankAccountNumber: data.bankAccountNumber.trim(),
    bankName: data.bankName as StoreBankName,
    accountHolderName: data.accountHolderName.trim(),
    address: data.address,
    roadAddress: data.roadAddress,
    detailAddress: data.detailAddress,
    zonecode: data.zonecode,
    latitude: data.latitude,
    longitude: data.longitude,
    refundCancellationPolicy: data.refundCancellationPolicy,
  };
}
