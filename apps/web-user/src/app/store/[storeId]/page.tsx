"use client";

import { use } from "react";
import { useStoreDetail } from "@/apps/web-user/features/store/hooks/queries/useStoreDetail";
import { StoreDetailIntroSection } from "@/apps/web-user/features/store/components/sections/StoreDetailIntroSection";
import { StoreDetailProductListSection } from "@/apps/web-user/features/store/components/sections/StoreDetailProductListSection";

interface StoreDetailPageProps {
  params: Promise<{ storeId: string }>;
}

export default function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { storeId } = use(params); // Next.js 15에서는 동적 라우트의 params가 Promise로 전달됩니다. // 클라이언트 컴포넌트에서는 async/await를 사용할 수 없어 use()로 Promise를 처리합니다.
  const { data, isLoading } = useStoreDetail(storeId);

  if (isLoading) {
    return <></>;
  }

  if (!data) {
    return <div>스토어 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div style={{ width: "100%", padding: "40px 20px" }}>
      <StoreDetailIntroSection store={data} />
      <StoreDetailProductListSection storeId={storeId} />
    </div>
  );
}
