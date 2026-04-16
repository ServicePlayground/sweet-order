import React from "react";
import { useParams } from "react-router-dom";
import { StoreCreationForm } from "@/apps/web-seller/features/store/components/forms/StoreCreationForm";
import type {
  StoreBankName,
  UpdateStoreRequestDto,
} from "@/apps/web-seller/features/store/types/store.dto";
import type { StoreForm } from "@/apps/web-seller/features/store/types/store.ui";
import { useStoreDetail } from "@/apps/web-seller/features/store/hooks/queries/useStoreQuery";
import { useUpdateStore } from "@/apps/web-seller/features/store/hooks/mutations/useStoreMutation";
import { Card, CardContent } from "@/apps/web-seller/common/components/cards/Card";

export const StoreDetailEditPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();

  const { data: store, isLoading } = useStoreDetail(storeId || "");
  const updateStoreMutation = useUpdateStore();

  if (!storeId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어가 선택되지 않았습니다.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어를 찾을 수 없습니다.</h2>
      </div>
    );
  }

  // StoreResponseDto를 StoreForm으로 변환
  const storeForm: StoreForm = {
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
  };

  const handleUpdate = async (data: StoreForm) => {
    const request: UpdateStoreRequestDto = {
      name: data.name,
      description: data.description || "",
      phoneNumber: data.phoneNumber?.trim() || undefined,
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
    };

    await updateStoreMutation.mutateAsync({
      storeId,
      request,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">스토어 수정</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <StoreCreationForm
            onSubmit={handleUpdate}
            initialValue={storeForm}
            submitButtonText="수정하기"
          />
        </CardContent>
      </Card>
    </div>
  );
};
