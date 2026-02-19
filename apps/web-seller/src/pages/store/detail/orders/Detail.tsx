import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDetail } from "@/apps/web-seller/features/order/hooks/queries/useOrderQuery";
import { useUpdateOrderStatus } from "@/apps/web-seller/features/order/hooks/mutations/useOrderMutation";
import { OrderStatus } from "@/apps/web-seller/features/order/types/order.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/apps/web-seller/common/components/cards/Card";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { Badge } from "@/apps/web-seller/common/components/badges/Badge";
import { ImageLightbox } from "@/apps/web-seller/common/components/images/ImageLightbox";

export const StoreDetailOrderDetailPage: React.FC = () => {
  const { storeId, orderId } = useParams<{ storeId: string; orderId: string }>();
  const { data: order, isLoading } = useOrderDetail(orderId || "");
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <Badge className="bg-yellow-500 px-3 py-1 text-sm font-semibold text-white">
            대기중
          </Badge>
        );
      case OrderStatus.CONFIRMED:
        return (
          <Badge className="bg-green-500 px-3 py-1 text-sm font-semibold text-white">
            확정됨
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleConfirmOrder = () => {
    updateOrderStatusMutation.mutate({
      orderId: order.id,
      request: { orderStatus: OrderStatus.CONFIRMED },
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-3xl font-bold text-gray-900">주문 상세</h1>

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
              <div className="text-base font-medium text-gray-900">
                {order.storeName || "-"}
              </div>
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
              <div className="mt-1">{getStatusBadge(order.orderStatus)}</div>
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
                    픽업일시
                  </div>
                  <div className="text-base font-medium text-gray-900">
                    {new Date(item.pickupDate).toLocaleString("ko-KR")}
                  </div>
                </div>
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
      {order.pickupAddress && (
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-xl font-semibold text-gray-900">픽업 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  <div className="text-base font-medium text-gray-900">
                    {order.pickupZonecode}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 예약 확정 버튼 */}
      {order.orderStatus === OrderStatus.PENDING && (
        <div className="flex justify-center border-t border-gray-200 pt-6">
          <Button
            onClick={handleConfirmOrder}
            disabled={updateOrderStatusMutation.isPending}
            className="min-w-[200px] px-8 py-3 text-base font-semibold"
          >
            {updateOrderStatusMutation.isPending ? "확정 중..." : "예약 확정"}
          </Button>
        </div>
      )}

      {/* 이미지 확대 모달 */}
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
