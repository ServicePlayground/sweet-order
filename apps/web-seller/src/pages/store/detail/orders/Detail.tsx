import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDetail } from "@/apps/web-seller/features/order/hooks/queries/useOrderQuery";
import { useUpdateOrderStatus } from "@/apps/web-seller/features/order/hooks/mutations/useOrderMutation";
import {
  OrderStatus,
  type UpdateOrderStatusRequestDto,
} from "@/apps/web-seller/features/order/types/order.dto";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { ImageLightbox } from "@/apps/web-seller/common/components/images/ImageLightbox";
import { Textarea } from "@/apps/web-seller/common/components/textareas/Textarea";
import { isSellerTransitionAllowed } from "@/apps/web-seller/features/order/utils/order-seller-transition.util";
import {
  getOrderStatusBadgeVariant,
  getOrderStatusLabel,
} from "@/apps/web-seller/features/order/utils/order-status-ui.util";
import { StatusBadge } from "@/apps/web-seller/common/components/badges/StatusBadge";
import {
  getOrderStatusSellerHintBody,
  ORDER_STATUS_FLOW_LINES_FOR_SELLER,
} from "@/apps/web-seller/features/order/utils/order-status-seller-guide.util";
import { PaymentPendingCountdown } from "@/apps/web-seller/features/order/components/detail/PaymentPendingCountdown";
import { OrderStatusFlowStepper } from "@/apps/web-seller/features/order/components/detail/OrderStatusFlowStepper";
import { OrderDetailSpreadsheetView } from "@/apps/web-seller/features/order/components/detail/OrderDetailSpreadsheetView";
import {
  ORDER_DETAIL_ACTION_BTN,
  ORDER_DETAIL_BODY,
  ORDER_DETAIL_PAGE_META,
  ORDER_DETAIL_PAGE_TITLE,
  ORDER_DETAIL_SHEET,
  ORDER_DETAIL_SHEET_HEADER,
  ORDER_DETAIL_SHEET_TITLE,
  ORDER_DETAIL_TD_BLOCK,
} from "@/apps/web-seller/features/order/constants/order-detail-page.constant";
import {
  SheetSectionRow,
  SheetTable,
} from "@/apps/web-seller/features/order/components/detail/OrderDetailSheetTable";
import { CircleHelp, X } from "lucide-react";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

type ReasonTarget =
  | OrderStatus.CANCEL_COMPLETED
  | OrderStatus.NO_SHOW
  | OrderStatus.CANCEL_REFUND_PENDING
  | null;

const IRREVERSIBLE_ACTION_CONFIRM_MESSAGE =
  "이 작업은 처리 후 되돌릴 수 없습니다. 계속하시겠습니까?";

function confirmIrreversibleAction(run: () => void): void {
  if (!window.confirm(IRREVERSIBLE_ACTION_CONFIRM_MESSAGE)) return;
  run();
}

export const StoreDetailOrderDetailPage: React.FC = () => {
  const { storeId, orderId } = useParams<{ storeId: string; orderId: string }>();
  const { data: order, isLoading } = useOrderDetail(orderId || "");
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [reasonTarget, setReasonTarget] = useState<ReasonTarget>(null);
  const [reasonText, setReasonText] = useState("");
  const [flowGuideOpen, setFlowGuideOpen] = useState(false);

  useEffect(() => {
    if (!flowGuideOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFlowGuideOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flowGuideOpen]);

  if (!storeId || !orderId) {
    return (
      <div className="flex items-center justify-center py-12">
        <h2 className={ORDER_DETAIL_PAGE_TITLE}>스토어 또는 주문이 선택되지 않았습니다.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[13px] font-medium text-slate-500">로딩 중...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center py-12">
        <h2 className={ORDER_DETAIL_PAGE_TITLE}>주문을 찾을 수 없습니다.</h2>
      </div>
    );
  }

  const status = order.orderStatus;
  const variant = getOrderStatusBadgeVariant(status);

  const submitReason = () => {
    if (!reasonTarget || !orderId) return;
    const trimmed = reasonText.trim();
    if (!trimmed) return;
    if (!window.confirm(IRREVERSIBLE_ACTION_CONFIRM_MESSAGE)) return;
    const request: UpdateOrderStatusRequestDto = {
      orderStatus: reasonTarget,
    };
    if (reasonTarget === OrderStatus.CANCEL_COMPLETED) {
      request.sellerCancelReason = trimmed;
    } else if (reasonTarget === OrderStatus.NO_SHOW) {
      request.sellerNoShowReason = trimmed;
    } else if (reasonTarget === OrderStatus.CANCEL_REFUND_PENDING) {
      request.sellerCancelRefundPendingReason = trimmed;
    }
    updateOrderStatusMutation.mutate(
      { orderId, request },
      {
        onSuccess: () => {
          setReasonTarget(null);
          setReasonText("");
        },
      },
    );
  };

  const cancelReasonFlow = () => {
    setReasonTarget(null);
    setReasonText("");
  };

  const startReason = (target: Exclude<ReasonTarget, null>) => {
    setReasonTarget(target);
    setReasonText("");
  };

  const showAcceptReservation = isSellerTransitionAllowed(status, OrderStatus.PAYMENT_PENDING);
  const showConfirm = isSellerTransitionAllowed(status, OrderStatus.CONFIRMED);
  const showPickupDone = isSellerTransitionAllowed(status, OrderStatus.PICKUP_COMPLETED);
  const showRefundDone = isSellerTransitionAllowed(status, OrderStatus.CANCEL_REFUND_COMPLETED);
  const showCancelOrder = isSellerTransitionAllowed(status, OrderStatus.CANCEL_COMPLETED);
  const showNoShow = isSellerTransitionAllowed(status, OrderStatus.NO_SHOW);
  const showRefundPending = isSellerTransitionAllowed(status, OrderStatus.CANCEL_REFUND_PENDING);

  const paymentWindowStart = order.paymentPendingAt ?? order.createdAt;

  const hasAnyActions =
    !reasonTarget &&
    (showAcceptReservation ||
      showConfirm ||
      showPickupDone ||
      showRefundDone ||
      showCancelOrder ||
      showNoShow ||
      showRefundPending);

  const reasonFieldLabel =
    reasonTarget === OrderStatus.CANCEL_COMPLETED
      ? "예약 취소 사유 (필수)"
      : reasonTarget === OrderStatus.NO_SHOW
        ? "노쇼 사유 (필수)"
        : reasonTarget === OrderStatus.CANCEL_REFUND_PENDING
          ? "취소환불대기 전환 사유 (필수)"
          : "";

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className={ORDER_DETAIL_PAGE_TITLE}>주문 상세</h1>
        <p className={ORDER_DETAIL_PAGE_META}>
          주문번호 <span className="font-mono font-medium text-slate-800">{order.orderNumber}</span>
        </p>
      </div>

      <div className={ORDER_DETAIL_SHEET}>
        <div className={ORDER_DETAIL_SHEET_HEADER}>
          <h2 className={ORDER_DETAIL_SHEET_TITLE}>주문 처리</h2>
        </div>

        <OrderStatusFlowStepper status={status} />

        <div className="overflow-x-auto">
          <SheetTable>
            <tbody>
              <SheetSectionRow>현재 상태</SheetSectionRow>
              <tr>
                <td colSpan={2} className={ORDER_DETAIL_TD_BLOCK}>
                  <div className="flex min-w-0 flex-wrap items-start gap-x-2 gap-y-1">
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <StatusBadge variant={variant} className="text-xs font-semibold">
                        {getOrderStatusLabel(status)}
                      </StatusBadge>
                      <button
                        type="button"
                        onClick={() => setFlowGuideOpen(true)}
                        className="-m-0.5 inline-flex shrink-0 items-center justify-center rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200/80 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                        aria-label="상태별 상세 안내 전체 흐름 보기"
                        title="상태별 상세 안내 · 전체 흐름"
                      >
                        <CircleHelp className="h-[17px] w-[17px]" strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                    <p className={cn(ORDER_DETAIL_BODY, "min-w-0 flex-1")}>
                      {getOrderStatusSellerHintBody(status)}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </SheetTable>
        </div>

        {status === OrderStatus.PAYMENT_PENDING && (
          <div className="border-t border-slate-300 bg-slate-50/80 px-4 py-3">
            <PaymentPendingCountdown
              deadlineAt={order.paymentPendingDeadlineAt ?? undefined}
              windowStartAt={paymentWindowStart}
            />
          </div>
        )}

        {reasonTarget && (
          <div className="overflow-x-auto border-t border-slate-300">
            <SheetTable>
              <tbody>
                <SheetSectionRow>사유 입력</SheetSectionRow>
                <tr>
                  <td colSpan={2} className={ORDER_DETAIL_TD_BLOCK}>
                    <div className="text-[13px] font-medium text-slate-800">{reasonFieldLabel}</div>
                    <Textarea
                      value={reasonText}
                      onChange={(e) => setReasonText(e.target.value)}
                      placeholder="사유를 입력해 주세요."
                      rows={4}
                      className="mt-2 border-slate-300 bg-white text-[13px] leading-snug"
                    />
                    <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(ORDER_DETAIL_ACTION_BTN, "sm:flex-none")}
                        onClick={cancelReasonFlow}
                      >
                        돌아가기
                      </Button>
                      <Button
                        type="button"
                        className={cn(ORDER_DETAIL_ACTION_BTN, "sm:flex-none")}
                        onClick={submitReason}
                        disabled={updateOrderStatusMutation.isPending || !reasonText.trim()}
                      >
                        {updateOrderStatusMutation.isPending ? "처리 중..." : "저장하고 반영"}
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </SheetTable>
          </div>
        )}

        {hasAnyActions && (
          <div className="overflow-x-auto border-t border-slate-300">
            <SheetTable>
              <tbody>
                <SheetSectionRow>작업</SheetSectionRow>
                <tr>
                  <td colSpan={2} className={ORDER_DETAIL_TD_BLOCK}>
                    <div className="flex w-full flex-wrap gap-2">
                      {showAcceptReservation && (
                        <Button
                          className={ORDER_DETAIL_ACTION_BTN}
                          onClick={() =>
                            updateOrderStatusMutation.mutate({
                              orderId: order.id,
                              request: { orderStatus: OrderStatus.PAYMENT_PENDING },
                            })
                          }
                          disabled={updateOrderStatusMutation.isPending}
                        >
                          {updateOrderStatusMutation.isPending ? "처리 중..." : "예약 확인"}
                        </Button>
                      )}
                      {showConfirm && (
                        <Button
                          className={ORDER_DETAIL_ACTION_BTN}
                          onClick={() =>
                            confirmIrreversibleAction(() =>
                              updateOrderStatusMutation.mutate({
                                orderId: order.id,
                                request: { orderStatus: OrderStatus.CONFIRMED },
                              }),
                            )
                          }
                          disabled={updateOrderStatusMutation.isPending}
                        >
                          {updateOrderStatusMutation.isPending ? "처리 중..." : "예약 확정"}
                        </Button>
                      )}
                      {showPickupDone && (
                        <Button
                          className={ORDER_DETAIL_ACTION_BTN}
                          onClick={() =>
                            confirmIrreversibleAction(() =>
                              updateOrderStatusMutation.mutate({
                                orderId: order.id,
                                request: { orderStatus: OrderStatus.PICKUP_COMPLETED },
                              }),
                            )
                          }
                          disabled={updateOrderStatusMutation.isPending}
                        >
                          {updateOrderStatusMutation.isPending ? "처리 중..." : "픽업 완료"}
                        </Button>
                      )}
                      {showRefundDone && (
                        <Button
                          className={ORDER_DETAIL_ACTION_BTN}
                          onClick={() =>
                            confirmIrreversibleAction(() =>
                              updateOrderStatusMutation.mutate({
                                orderId: order.id,
                                request: { orderStatus: OrderStatus.CANCEL_REFUND_COMPLETED },
                              }),
                            )
                          }
                          disabled={updateOrderStatusMutation.isPending}
                        >
                          {updateOrderStatusMutation.isPending ? "처리 중..." : "취소환불 완료"}
                        </Button>
                      )}
                      {showCancelOrder && (
                        <Button
                          variant="destructive"
                          className={ORDER_DETAIL_ACTION_BTN}
                          onClick={() => startReason(OrderStatus.CANCEL_COMPLETED)}
                        >
                          예약 취소
                        </Button>
                      )}
                      {showNoShow && (
                        <Button
                          variant="destructive"
                          className={ORDER_DETAIL_ACTION_BTN}
                          onClick={() => startReason(OrderStatus.NO_SHOW)}
                        >
                          노쇼 처리
                        </Button>
                      )}
                      {showRefundPending && (
                        <Button
                          variant="outline"
                          className={cn(ORDER_DETAIL_ACTION_BTN, "border-slate-300 bg-white")}
                          onClick={() => startReason(OrderStatus.CANCEL_REFUND_PENDING)}
                        >
                          취소환불대기로 변경
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </SheetTable>
          </div>
        )}
      </div>

      <OrderDetailSpreadsheetView
        order={order}
        onReferenceImageClick={(url) => setLightboxImage(url)}
      />

      {flowGuideOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-flow-guide-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
            onClick={() => setFlowGuideOpen(false)}
            aria-label="안내 닫기"
          />
          <div
            className="relative z-10 flex max-h-[min(88vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-slate-300/90 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                ORDER_DETAIL_SHEET_HEADER,
                "flex shrink-0 items-center justify-between gap-3",
              )}
            >
              <h2 id="order-flow-guide-title" className={ORDER_DETAIL_SHEET_TITLE}>
                상태별 상세 안내 · 전체 흐름
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-slate-500 hover:text-slate-900"
                onClick={() => setFlowGuideOpen(false)}
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-4">
              <ul className="space-y-2.5 text-[13px] leading-relaxed text-slate-700">
                {ORDER_STATUS_FLOW_LINES_FOR_SELLER.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[11px] font-semibold text-slate-600">
                      {i + 1}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage}
          alt="주문 참고 이미지"
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};
