import React from "react";
import { useParams } from "react-router-dom";
import { StoreCreationForm } from "@/apps/web-seller/features/store/components/forms/StoreCreationForm";
import type { StoreForm } from "@/apps/web-seller/features/store/types/store.ui";
import {
  storeFormToUpdateRequest,
  storeResponseToStoreForm,
} from "@/apps/web-seller/features/store/utils/store-form.mapper";
import { useStoreDetail } from "@/apps/web-seller/features/store/hooks/queries/useStoreQuery";
import { useUpdateStore } from "@/apps/web-seller/features/store/hooks/mutations/useStoreMutation";
import { Card, CardContent } from "@/apps/web-seller/common/components/cards/Card";
import { ContentLoading } from "@/apps/web-seller/common/components/loading/ContentLoading";

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
      <ContentLoading variant="page" message="스토어 정보를 불러오는 중…" showLogo className="border-0 shadow-none" />
    );
  }

  if (!store) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어를 찾을 수 없습니다.</h2>
      </div>
    );
  }

  const storeForm: StoreForm = storeResponseToStoreForm(store);

  const handleUpdate = async (data: StoreForm) => {
    const request = storeFormToUpdateRequest(data);

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
