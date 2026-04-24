"use client";

import { useParams } from "next/navigation";
import Header from "@/apps/web-user/common/components/headers/Header";
import { useOrderDetail } from "@/apps/web-user/features/order/hooks/queries/useOrderDetail";
import { OrderCancelView } from "@/apps/web-user/features/order/components/cancel/OrderCancelView";

export default function OrderCancelPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId ?? "";
  const { data: order, isLoading } = useOrderDetail(orderId);

  return (
    <div>
      <Header variant="back-title" title="예약취소" />
      {isLoading ? (
        <div className="px-5 py-8 space-y-4 animate-pulse">
          <div className="h-5 w-40 bg-gray-100 rounded" />
          <div className="h-[96px] w-full bg-gray-50 rounded" />
          <div className="h-6 w-40 bg-gray-100 rounded" />
          <div className="h-6 w-56 bg-gray-100 rounded" />
        </div>
      ) : order ? (
        <OrderCancelView order={order} />
      ) : (
        <p className="px-5 py-10 text-sm text-gray-500 text-center">
          예약 정보를 불러올 수 없습니다.
        </p>
      )}
    </div>
  );
}
