import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDetail } from "@/apps/web-seller/features/order/hooks/queries/useOrderQuery";
import { useUpdateOrderStatus } from "@/apps/web-seller/features/order/hooks/mutations/useOrderMutation";
import {
  OrderStatus,
  type UpdateOrderStatusRequestDto,
} from "@/apps/web-seller/features/order/types/order.dto";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/apps/web-seller/common/components/cards/Card";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { ImageLightbox } from "@/apps/web-seller/common/components/images/ImageLightbox";
import { Textarea } from "@/apps/web-seller/common/components/textareas/Textarea";
import { Label } from "@/apps/web-seller/common/components/labels/Label";
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
import {
  ORDER_DETAIL_PANEL,
  ORDER_DETAIL_SECTION_BODY,
  ORDER_DETAIL_SECTION_BODY_COMPACT,
  ORDER_DETAIL_SECTION_HEAD,
  ORDER_DETAIL_SECTION_LABEL,
} from "@/apps/web-seller/features/order/components/detail/order-detail-section.styles";
import { CircleHelp, X } from "lucide-react";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

type ReasonTarget =
  | OrderStatus.CANCEL_COMPLETED
  | OrderStatus.NO_SHOW
  | OrderStatus.CANCEL_REFUND_PENDING
  | null;

/** 작업 버튼: 한 줄에서 가로 폭을 균등 분배 */
const ORDER_ACTION_BTN_CLASS =
  "h-auto min-h-11 min-w-0 flex-1 basis-0 whitespace-normal px-3 py-3 text-center leading-snug";

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
        <h2 className="text-xl font-semibold text-gray-900">
          스토어 또는 주문이 선택되지 않았습니다.
        </h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-base font-medium text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">주문을 찾을 수 없습니다.</h2>
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

  const hasNotes =
    order.userCancelReason ||
    order.sellerCancelReason ||
    order.sellerNoShowReason ||
    order.refundRequestReason ||
    order.sellerCancelRefundPendingReason ||
    order.refundBankName;

  const showConfirm = isSellerTransitionAllowed(status, OrderStatus.CONFIRMED);
  const showPickupDone = isSellerTransitionAllowed(status, OrderStatus.PICKUP_COMPLETED);
  const showRefundDone = isSellerTransitionAllowed(status, OrderStatus.CANCEL_REFUND_COMPLETED);
  const showCancelOrder = isSellerTransitionAllowed(status, OrderStatus.CANCEL_COMPLETED);
  const showNoShow = isSellerTransitionAllowed(status, OrderStatus.NO_SHOW);
  const showRefundPending = isSellerTransitionAllowed(status, OrderStatus.CANCEL_REFUND_PENDING);

  const hasAnyActions =
    !reasonTarget &&
    (showConfirm ||
      showPickupDone ||
      showRefundDone ||
      showCancelOrder ||
      showNoShow ||
      showRefundPending);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">주문 상세</h1>
        <p className="mt-1 text-sm text-gray-500">
          주문번호{" "}
          <span className="font-mono font-medium text-gray-700">{order.orderNumber}</span>
        </p>
      </div>

      {/* 상태 변경 (목록에서는 불가 — 상세에서만 처리) */}
      <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.04]">
        <CardHeader className="space-y-1.5 border-b border-slate-100/90 bg-gradient-to-r from-slate-50/95 via-white to-slate-50/40 px-6 py-5">
          <CardTitle className="text-xl font-semibold text-slate-900">주문 처리</CardTitle>
          <p className="text-sm font-normal text-slate-500">
            진행 단계와 안내를 확인한 뒤 작업을 선택하세요.
          </p>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <OrderStatusFlowStepper status={status} />

          <div className={ORDER_DETAIL_PANEL}>
            <div className={ORDER_DETAIL_SECTION_HEAD}>
              <div className="flex flex-wrap items-center gap-2">
                <div className={ORDER_DETAIL_SECTION_LABEL}>현재 상태</div>
                <button
                  type="button"
                  onClick={() => setFlowGuideOpen(true)}
                  className="-m-0.5 inline-flex shrink-0 items-center justify-center rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                  aria-label="상태별 상세 안내 전체 흐름 보기"
                  title="상태별 상세 안내 · 전체 흐름"
                >
                  <CircleHelp className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>
            <div className="relative">
              <div
                className="absolute left-0 top-0 min-h-full w-1 bg-gradient-to-b from-primary/70 via-primary/35 to-transparent"
                aria-hidden
              />
              <div className={ORDER_DETAIL_SECTION_BODY}>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <StatusBadge variant={variant} className="text-sm font-semibold shadow-sm">
                    {getOrderStatusLabel(status)}
                  </StatusBadge>
                  <span className="text-slate-400" aria-hidden>
                    :
                  </span>
                  <p className="min-w-0 flex-1 text-[15px] leading-[1.75] text-slate-600">
                    {getOrderStatusSellerHintBody(status)}
                  </p>
                </div>
              </div>
            </div>
            {status === OrderStatus.PAYMENT_PENDING && (
              <div className="border-t border-slate-100 bg-slate-50/50">
                <div className={ORDER_DETAIL_SECTION_BODY_COMPACT}>
                  <PaymentPendingCountdown createdAt={order.createdAt} />
                </div>
              </div>
            )}
          </div>

          {reasonTarget && (
            <div className={ORDER_DETAIL_PANEL}>
              <div className={ORDER_DETAIL_SECTION_HEAD}>
                <div className={ORDER_DETAIL_SECTION_LABEL}>사유 입력</div>
                <Label className="mt-3 block text-sm font-medium leading-snug text-slate-800">
                  {reasonTarget === OrderStatus.CANCEL_COMPLETED && "예약 취소 사유 (필수)"}
                  {reasonTarget === OrderStatus.NO_SHOW && "노쇼 사유 (필수)"}
                  {reasonTarget === OrderStatus.CANCEL_REFUND_PENDING &&
                    "취소환불대기 전환 사유 (필수)"}
                </Label>
              </div>
              <div className={ORDER_DETAIL_SECTION_BODY}>
                <Textarea
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                  placeholder="사유를 입력해 주세요."
                  rows={4}
                  className="border-slate-200 bg-white"
                />
                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={cancelReasonFlow}>
                    돌아가기
                  </Button>
                  <Button
                    type="button"
                    onClick={submitReason}
                    disabled={updateOrderStatusMutation.isPending || !reasonText.trim()}
                  >
                    {updateOrderStatusMutation.isPending ? "처리 중..." : "저장하고 반영"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {hasAnyActions && (
            <div className={ORDER_DETAIL_PANEL}>
              <div className={ORDER_DETAIL_SECTION_HEAD}>
                <div className={ORDER_DETAIL_SECTION_LABEL}>작업</div>
              </div>
              <div className={ORDER_DETAIL_SECTION_BODY}>
                <div className="flex w-full flex-wrap gap-2.5">
                  {showConfirm && (
                    <Button
                      className={ORDER_ACTION_BTN_CLASS}
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
                      className={ORDER_ACTION_BTN_CLASS}
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
                      className={ORDER_ACTION_BTN_CLASS}
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
                      className={ORDER_ACTION_BTN_CLASS}
                      onClick={() => startReason(OrderStatus.CANCEL_COMPLETED)}
                    >
                      예약 취소
                    </Button>
                  )}
                  {showNoShow && (
                    <Button
                      variant="destructive"
                      className={ORDER_ACTION_BTN_CLASS}
                      onClick={() => startReason(OrderStatus.NO_SHOW)}
                    >
                      노쇼 처리
                    </Button>
                  )}
                  {showRefundPending && (
                    <Button
                      variant="outline"
                      className={cn(ORDER_ACTION_BTN_CLASS, "border-slate-200 bg-white")}
                      onClick={() => startReason(OrderStatus.CANCEL_REFUND_PENDING)}
                    >
                      취소환불대기로 변경
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주문 기본 정보 */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-xl font-semibold text-gray-900">주문 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                스토어명
              </div>
              <div className="text-base font-medium text-gray-900">{order.storeName || "-"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                주문 번호
              </div>
              <div className="text-base font-semibold text-gray-900">{order.orderNumber}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                주문 상태
              </div>
              <div className="mt-1">
                <StatusBadge variant={variant}>{getOrderStatusLabel(status)}</StatusBadge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                주문일시
              </div>
              <div className="text-base font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleString("ko-KR")}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                총 수량
              </div>
              <div className="text-lg font-semibold text-gray-900">{order.totalQuantity}개</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                총 금액
              </div>
              <div className="text-2xl font-bold text-primary">
                {order.totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasNotes && (
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold text-gray-900">취소·환불·사유</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            {order.userCancelReason && (
              <div>
                <div className="text-xs font-semibold text-gray-500">고객 입금 전 취소 사유</div>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">{order.userCancelReason}</p>
              </div>
            )}
            {order.sellerCancelReason && (
              <div>
                <div className="text-xs font-semibold text-gray-500">판매자 예약 취소 사유</div>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">{order.sellerCancelReason}</p>
              </div>
            )}
            {order.sellerNoShowReason && (
              <div>
                <div className="text-xs font-semibold text-gray-500">노쇼 사유</div>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">{order.sellerNoShowReason}</p>
              </div>
            )}
            {order.refundRequestReason && (
              <div>
                <div className="text-xs font-semibold text-gray-500">고객 취소·환불 요청 사유</div>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">
                  {order.refundRequestReason}
                </p>
              </div>
            )}
            {order.sellerCancelRefundPendingReason && (
              <div>
                <div className="text-xs font-semibold text-gray-500">
                  판매자 취소환불대기 전환 사유
                </div>
                <p className="mt-1 whitespace-pre-wrap text-gray-900">
                  {order.sellerCancelRefundPendingReason}
                </p>
              </div>
            )}
            {(order.refundBankName ||
              order.refundBankAccountNumber ||
              order.refundAccountHolderName) && (
              <div>
                <div className="text-xs font-semibold text-gray-500">환불 계좌 (고객 요청 시)</div>
                <p className="mt-1 text-gray-900">
                  {[
                    order.refundBankName,
                    order.refundBankAccountNumber,
                    order.refundAccountHolderName,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 주문 항목 */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-xl font-semibold text-gray-900">주문 항목</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {order.orderItems.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <div className="mb-6 border-t border-gray-200"></div>}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    금액
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {item.itemPrice.toLocaleString()}원 × {item.quantity}개
                  </div>
                </div>
                {item.sizeDisplayName && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      사이즈
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {item.sizeDisplayName}
                      {item.sizeLengthCm && (
                        <span className="text-gray-600"> ({item.sizeLengthCm}cm)</span>
                      )}
                      {item.sizeDescription && (
                        <span className="text-gray-600"> - {item.sizeDescription}</span>
                      )}
                      {item.sizePrice && item.sizePrice > 0 && (
                        <span className="text-primary">
                          {" "}
                          (+{item.sizePrice.toLocaleString()}원)
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {item.flavorDisplayName && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      맛
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {item.flavorDisplayName}
                      {item.flavorPrice && item.flavorPrice > 0 && (
                        <span className="text-primary">
                          {" "}
                          (+{item.flavorPrice.toLocaleString()}원)
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {item.letteringMessage && (
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      레터링
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      {item.letteringMessage}
                    </div>
                  </div>
                )}
                {item.requestMessage && (
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      요청사항
                    </div>
                    <div className="text-base font-medium text-gray-900">{item.requestMessage}</div>
                  </div>
                )}
                {item.imageUrls && item.imageUrls.length > 0 && (
                  <div className="space-y-2 md:col-span-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      참고 이미지
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {item.imageUrls.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLightboxImage(url)}
                          className="group relative overflow-hidden rounded-lg border-2 border-gray-200 transition-all hover:border-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          aria-label={`이미지 ${idx + 1} 크게 보기`}
                        >
                          <img
                            src={url}
                            alt={`주문 항목 이미지 ${idx + 1}`}
                            className="h-32 w-32 object-cover transition-transform group-hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 픽업 정보 */}
      {(order.pickupAddress || order.pickupDate) && (
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold text-gray-900">픽업 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  픽업일시
                </div>
                <div className="text-base font-medium text-gray-900">
                  {new Date(order.pickupDate).toLocaleString("ko-KR")}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  주소
                </div>
                <div className="space-y-1">
                  <div className="text-base font-medium text-gray-900">
                    {order.pickupRoadAddress || order.pickupAddress}
                  </div>
                  {order.pickupAddress && order.pickupRoadAddress && (
                    <div className="text-sm text-gray-600">{order.pickupAddress}</div>
                  )}
                  {order.pickupDetailAddress && (
                    <div className="text-sm text-gray-600">{order.pickupDetailAddress}</div>
                  )}
                </div>
              </div>
              {order.pickupZonecode && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    우편번호
                  </div>
                  <div className="text-base font-medium text-gray-900">{order.pickupZonecode}</div>
                </div>
              )}
            </div>
            {status === OrderStatus.CONFIRMED && (
              <p className="text-sm text-gray-600">
                픽업 예정 시각이 되면 상태가 자동으로 &quot;픽업대기&quot;로 바뀝니다.
              </p>
            )}
          </CardContent>
        </Card>
      )}

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
            className="relative z-10 flex max-h-[min(88vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl ring-1 ring-slate-900/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/95 to-white px-5 py-4 sm:px-6">
              <h2
                id="order-flow-guide-title"
                className="text-base font-semibold leading-snug text-slate-900"
              >
                상태별 상세 안내 · 전체 흐름
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-slate-500 hover:text-slate-900"
                onClick={() => setFlowGuideOpen(false)}
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                {ORDER_STATUS_FLOW_LINES_FOR_SELLER.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
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
