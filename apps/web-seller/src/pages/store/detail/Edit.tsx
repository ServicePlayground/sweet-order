import React from "react";
import { useParams } from "react-router-dom";
import { StoreCreationForm } from "@/apps/web-seller/features/store/components/forms/StoreCreationForm";
import { IStoreForm, IUpdateStoreRequest } from "@/apps/web-seller/features/store/types/store.type";
import {
  useStoreDetail,
  useUpdateStore,
} from "@/apps/web-seller/features/store/hooks/queries/useStore";
import { Card, CardContent } from "@/apps/web-seller/common/components/@shadcn-ui/card";

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

  // IStoreDetail을 IStoreForm으로 변환
  const storeForm: IStoreForm = {
    name: store.name,
    description: store.description || "",
    logoImageUrl: store.logoImageUrl || "",
    address: store.address,
    roadAddress: store.roadAddress,
    zonecode: store.zonecode,
    latitude: store.latitude,
    longitude: store.longitude,
  };

  const handleUpdate = async (data: IStoreForm) => {
    const request: IUpdateStoreRequest = {
      name: data.name,
      description: data.description || "",
      logoImageUrl: data.logoImageUrl || "",
      address: data.address,
      roadAddress: data.roadAddress,
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
    <div className="space-y-4">
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
