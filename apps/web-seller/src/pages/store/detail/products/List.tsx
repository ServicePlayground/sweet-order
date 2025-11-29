import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";

export const StoreDetailProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  if (!storeId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어가 선택되지 않았습니다.</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">상품 목록</h1>
      <Button onClick={() => navigate(ROUTES.STORE_DETAIL_PRODUCTS_CREATE(storeId))}>
        상품 등록
      </Button>
      <p className="text-muted-foreground">상품 목록은 추후 연동 예정</p>
    </div>
  );
};
