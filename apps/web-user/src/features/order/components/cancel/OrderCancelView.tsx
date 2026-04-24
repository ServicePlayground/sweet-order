"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OrderResponse, OrderStatus } from "@/apps/web-user/features/order/types/order.type";
import { useCancelBeforePayment } from "@/apps/web-user/features/order/hooks/mutations/useCancelBeforePayment";
import { RadioGroup, RadioOption } from "@/apps/web-user/common/components/inputs/RadioGroup";

const PRE_PAYMENT_CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.RESERVATION_REQUESTED,
  OrderStatus.PAYMENT_PENDING,
];

type ReasonOption = "CHANGE_OF_MIND" | "ORDER_MISTAKE" | "OTHER";

const REASON_LABELS: Record<ReasonOption, string> = {
  CHANGE_OF_MIND: "단순 변심",
  ORDER_MISTAKE: "주문 실수 (디자인 변경, 옵션 누락 등)",
  OTHER: "기타",
};

const REASON_OPTIONS: RadioOption<ReasonOption>[] = (
  Object.keys(REASON_LABELS) as ReasonOption[]
).map((value) => ({ value, label: REASON_LABELS[value] }));

interface OrderCancelViewProps {
  order: OrderResponse;
}

export function OrderCancelView({ order }: OrderCancelViewProps) {
  const router = useRouter();
  const { mutate: cancelOrder, isPending } = useCancelBeforePayment();

  const [selectedReason, setSelectedReason] = useState<ReasonOption | null>(null);
  const [otherReasonText, setOtherReasonText] = useState("");

  const isPrePaymentCancellable = PRE_PAYMENT_CANCELLABLE_STATUSES.includes(order.orderStatus);

  if (!isPrePaymentCancellable) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-sm text-gray-500">
          현재 주문 상태에서는 이 취소 화면을 사용할 수 없습니다.
        </p>
      </div>
    );
  }

  const buildReason = (): string => {
    if (selectedReason === "OTHER") return otherReasonText.trim();
    if (selectedReason) return REASON_LABELS[selectedReason];
    return "";
  };

  const isValid = (() => {
    if (!selectedReason) return false;
    if (selectedReason === "OTHER") return otherReasonText.trim().length > 0;
    return true;
  })();

  const handleSubmit = () => {
    if (!isValid || isPending) return;
    const reason = buildReason();
    cancelOrder(
      { orderId: order.id, reason },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  const productImage = order.productImages?.[0];

  return (
    <div className="pt-8 pb-[106px]">
      <div className="px-5">
        {/* 취소상품 */}
        <section>
          <h2 className="text-lg/[25px] font-bold text-gray-900 mb-3">취소상품</h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border border-gray-100 rounded-2lg p-3 bg-white flex-shrink-0 w-[278px]"
              >
                <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded overflow-hidden">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={order.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="mb-0.5 text-xs text-gray-500">{order.storeName}</p>
                  <p className="mb-2 text-sm text-gray-900 truncate">{order.productName}</p>
                  <p className="text-2xs text-gray-400 truncate">
                    {[
                      item.sizeDisplayName &&
                        `${item.sizeDisplayName}(+${item.sizePrice?.toLocaleString() ?? 0}원)`,
                      item.flavorDisplayName &&
                        `${item.flavorDisplayName}(+${item.flavorPrice?.toLocaleString() ?? 0}원)`,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </p>
                </div>
              </div>
            ))}
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border border-gray-100 rounded-2lg p-3 bg-white flex-shrink-0 w-[278px]"
              >
                <div className="relative w-[72px] h-[72px] flex-shrink-0 rounded overflow-hidden">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={order.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="mb-0.5 text-xs text-gray-500">{order.storeName}</p>
                  <p className="mb-2 text-sm text-gray-900 truncate">{order.productName}</p>
                  <p className="text-2xs text-gray-400 truncate">
                    {[
                      item.sizeDisplayName &&
                        `${item.sizeDisplayName}(+${item.sizePrice?.toLocaleString() ?? 0}원)`,
                      item.flavorDisplayName &&
                        `${item.flavorDisplayName}(+${item.flavorPrice?.toLocaleString() ?? 0}원)`,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 취소사유 */}
        <section className="mt-14">
          <h2 className="text-lg/[25px] font-bold text-gray-900 mb-4">취소사유</h2>
          <RadioGroup<ReasonOption>
            value={selectedReason}
            onChange={setSelectedReason}
            options={REASON_OPTIONS}
          />

          {selectedReason === "OTHER" && (
            <input
              type="text"
              value={otherReasonText}
              onChange={(e) => setOtherReasonText(e.target.value)}
              placeholder="내용을 입력해주세요."
              maxLength={2000}
              className="mt-3 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary"
            />
          )}
        </section>
      </div>

      {/* 하단 취소 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[638px] bg-white p-5 pt-2.5 pb-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || isPending}
          className={`w-full h-[52px] rounded-xl text-base font-bold border-none ${
            isValid && !isPending
              ? "bg-primary text-white cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isPending ? "취소 중..." : "예약취소"}
        </button>
      </div>
    </div>
  );
}
