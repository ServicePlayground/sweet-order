import React, { useState } from "react";
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
  getOrderStatusSellerHint,
  ORDER_STATUS_FLOW_LINES_FOR_SELLER,
} from "@/apps/web-seller/features/order/utils/order-status-seller-guide.util";

type ReasonTarget =
  | OrderStatus.CANCEL_COMPLETED
  | OrderStatus.NO_SHOW
  | OrderStatus.CANCEL_REFUND_PENDING
  | null;

export const StoreDetailOrderDetailPage: React.FC = () => {
  const { storeId, orderId } = useParams<{ storeId: string; orderId: string }>();
  const { data: order, isLoading } = useOrderDetail(orderId || "");
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [reasonTarget, setReasonTarget] = useState<ReasonTarget>(null);
  const [reasonText, setReasonText] = useState("");

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

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-3xl font-bold text-gray-900">주문 상세</h1>

      {/* 상태 변경 (목록에서는 불가 — 상세에서만 처리) */}
      <Card>
        <CardHeader className="border-b bg-gray-50/50">
          <CardTitle className="text-xl font-semibold text-gray-900">상태 변경</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-blue-800">
              현재 상태 안내
            </div>
            <div className="mt-2 flex flex-wrap items-start gap-2">
              <StatusBadge variant={variant} className="shrink-0">
                {getOrderStatusLabel(status)}
              </StatusBadge>
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-gray-800">
                {getOrderStatusSellerHint(status)}
              </p>
            </div>
          </div>

          <details className="rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm">
            <summary className="cursor-pointer font-semibold text-gray-800 select-none">
              주문 상태 전체 흐름 (참고)
            </summary>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
              {ORDER_STATUS_FLOW_LINES_FOR_SELLER.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </details>

          {reasonTarget && (
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
              <Label>
                {reasonTarget === OrderStatus.CANCEL_COMPLETED && "예약 취소 사유 (필수)"}
                {reasonTarget === OrderStatus.NO_SHOW && "노쇼 사유 (필수)"}
                {reasonTarget === OrderStatus.CANCEL_REFUND_PENDING &&
                  "취소환불대기 전환 사유 (필수)"}
              </Label>
              <Textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="사유를 입력해 주세요."
                rows={4}
                className="bg-white"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={submitReason}
                  disabled={updateOrderStatusMutation.isPending || !reasonText.trim()}
                >
                  {updateOrderStatusMutation.isPending ? "처리 중..." : "확인"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelReasonFlow}>
                  취소
                </Button>
              </div>
            </div>
          )}

          {!reasonTarget && (
            <div className="flex flex-wrap gap-2">
              {isSellerTransitionAllowed(status, OrderStatus.CONFIRMED) && (
                <Button
                  onClick={() =>
                    updateOrderStatusMutation.mutate({
                      orderId: order.id,
                      request: { orderStatus: OrderStatus.CONFIRMED },
                    })
                  }
                  disabled={updateOrderStatusMutation.isPending}
                >
                  {updateOrderStatusMutation.isPending ? "처리 중..." : "예약 확정"}
                </Button>
              )}
              {isSellerTransitionAllowed(status, OrderStatus.CANCEL_COMPLETED) && (
                <Button
                  variant="destructive"
                  onClick={() => startReason(OrderStatus.CANCEL_COMPLETED)}
                >
                  예약 취소
                </Button>
              )}
              {isSellerTransitionAllowed(status, OrderStatus.PICKUP_COMPLETED) && (
                <Button
                  onClick={() =>
                    updateOrderStatusMutation.mutate({
                      orderId: order.id,
                      request: { orderStatus: OrderStatus.PICKUP_COMPLETED },
                    })
                  }
                  disabled={updateOrderStatusMutation.isPending}
                >
                  픽업 완료
                </Button>
              )}
              {isSellerTransitionAllowed(status, OrderStatus.NO_SHOW) && (
                <Button variant="destructive" onClick={() => startReason(OrderStatus.NO_SHOW)}>
                  노쇼 처리
                </Button>
              )}
              {isSellerTransitionAllowed(status, OrderStatus.CANCEL_REFUND_PENDING) && (
                <Button
                  variant="outline"
                  onClick={() => startReason(OrderStatus.CANCEL_REFUND_PENDING)}
                >
                  취소환불대기로 변경
                </Button>
              )}
              {isSellerTransitionAllowed(status, OrderStatus.CANCEL_REFUND_COMPLETED) && (
                <Button
                  onClick={() =>
                    updateOrderStatusMutation.mutate({
                      orderId: order.id,
                      request: { orderStatus: OrderStatus.CANCEL_REFUND_COMPLETED },
                    })
                  }
                  disabled={updateOrderStatusMutation.isPending}
                >
                  취소환불 완료
                </Button>
              )}
            </div>
          )}

          {!reasonTarget &&
            !isSellerTransitionAllowed(status, OrderStatus.CONFIRMED) &&
            !isSellerTransitionAllowed(status, OrderStatus.CANCEL_COMPLETED) &&
            !isSellerTransitionAllowed(status, OrderStatus.PICKUP_COMPLETED) &&
            !isSellerTransitionAllowed(status, OrderStatus.NO_SHOW) &&
            !isSellerTransitionAllowed(status, OrderStatus.CANCEL_REFUND_PENDING) &&
            !isSellerTransitionAllowed(status, OrderStatus.CANCEL_REFUND_COMPLETED) && (
              <p className="text-sm text-gray-600">
                현재 상태에서는 변경할 수 있는 작업이 없습니다.
              </p>
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
                픽업 당일이 되면 상태가 자동으로 &quot;픽업대기&quot;로 바뀝니다.
              </p>
            )}
          </CardContent>
        </Card>
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
