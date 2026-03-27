import React from "react";
import { OrderStatus } from "@/apps/web-seller/features/order/types/order.dto";
import { getOrderStatusLabel } from "@/apps/web-seller/features/order/utils/order-status-ui.util";
import { cn } from "@/apps/web-seller/common/utils/classname.util";
import {
  ORDER_DETAIL_PANEL,
  ORDER_DETAIL_SECTION_HEAD,
  ORDER_DETAIL_SECTION_LABEL,
} from "@/apps/web-seller/features/order/components/detail/order-detail-section.styles";

/** 일반 진행선(입금 → 픽업완료) — 시각적 단계 표시용 */
const MAIN_FLOW: readonly OrderStatus[] = [
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.PAYMENT_COMPLETED,
  OrderStatus.CONFIRMED,
  OrderStatus.PICKUP_PENDING,
  OrderStatus.PICKUP_COMPLETED,
];

function getProgressIndex(status: OrderStatus): number | null {
  const i = MAIN_FLOW.indexOf(status);
  return i >= 0 ? i : null;
}

export interface OrderStatusFlowStepperProps {
  status: OrderStatus;
  className?: string;
}

/**
 * 주문 상태의 일반 진행 흐름(입금~픽업완료)을 가로 스텝으로 표시합니다.
 */
export const OrderStatusFlowStepper: React.FC<OrderStatusFlowStepperProps> = ({
  status,
  className,
}) => {
  const progressIndex = getProgressIndex(status);
  const isTerminal = progressIndex === null;

  return (
    <div className={cn(ORDER_DETAIL_PANEL, className)}>
      <div className={cn(ORDER_DETAIL_SECTION_HEAD, "py-4 sm:py-[1.125rem]")}>
        <div className={ORDER_DETAIL_SECTION_LABEL}>주문 진행 단계</div>
      </div>
      <div className="-mx-1 overflow-x-auto px-5 py-7 sm:px-6 sm:py-8">
        <div className="flex min-w-0 items-center gap-0 px-1">
          {MAIN_FLOW.map((stepStatus, idx) => {
            const isPast = progressIndex !== null && idx < progressIndex;
            const isCurrent = progressIndex !== null && idx === progressIndex;
            const isFuture = progressIndex !== null && idx > progressIndex;

            return (
              <React.Fragment key={stepStatus}>
                {idx > 0 && (
                  <div
                    className={cn(
                      "mx-0.5 h-0.5 min-w-[12px] flex-1 rounded-full sm:min-w-[20px]",
                      isPast || isCurrent ? "bg-primary/50" : "bg-gray-200",
                    )}
                    aria-hidden
                  />
                )}
                <div className="flex shrink-0 flex-col items-center gap-2 sm:gap-2.5">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors sm:h-9 sm:w-9",
                      isCurrent &&
                        "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20",
                      isPast && !isCurrent && "border-primary/40 bg-primary/10 text-primary",
                      isFuture && "border-gray-200 bg-white text-gray-400",
                      isTerminal && "border-gray-200 bg-gray-50 text-gray-300",
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isPast && !isCurrent ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "max-w-[4.5rem] text-center text-[10px] font-medium leading-tight sm:max-w-none sm:text-xs",
                      isCurrent && "text-primary",
                      isPast && !isCurrent && "text-gray-700",
                      isFuture && "text-gray-400",
                      isTerminal && "text-gray-300",
                    )}
                  >
                    {getOrderStatusLabel(stepStatus)}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
