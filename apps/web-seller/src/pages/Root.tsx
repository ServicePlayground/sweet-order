import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreList } from "@/apps/web-seller/features/store/hooks/queries/useStoreQuery";
import { flattenAndDeduplicateInfiniteData } from "@/apps/web-seller/common/utils/pagination.util";
import type { StoreResponseDto } from "@/apps/web-seller/features/store/types/store.dto";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";

export const RootPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: storeListData } = useStoreList();
  const stores = useMemo(() => {
    if (!storeListData) return [];
    return flattenAndDeduplicateInfiniteData<StoreResponseDto>(storeListData);
  }, [storeListData]);

  useEffect(() => {
    if (stores.length > 0) {
      navigate(ROUTES.STORE_DETAIL_HOME(stores[0].id), { replace: true });
    }
  }, [stores, navigate]);

  if (stores.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">스토어가 없습니다</h1>
        <p className="text-muted-foreground">먼저 스토어를 생성해주세요.</p>
        <Button onClick={() => navigate(ROUTES.STORE_CREATE)}>스토어 만들기</Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground">스토어로 이동 중...</p>
    </div>
  );
};
