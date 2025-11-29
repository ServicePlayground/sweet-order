import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreStore } from "@/apps/web-seller/features/store/store/store.store";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";

export const RootPage: React.FC = () => {
  const navigate = useNavigate();
  const { stores } = useStoreStore();

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
