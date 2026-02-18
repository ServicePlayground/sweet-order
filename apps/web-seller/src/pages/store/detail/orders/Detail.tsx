import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderDetail } from "@/apps/web-seller/features/order/hooks/queries/useOrderDetail";
import { useUpdateOrderStatus } from "@/apps/web-seller/features/order/hooks/mutations/useUpdateOrderStatus";
import { OrderStatus } from "@/apps/web-seller/features/order/types/order.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/apps/web-seller/common/components/@shadcn-ui/card";
import { Button } from "@/apps/web-seller/common/components/@shadcn-ui/button";
import { ROUTES } from "@/apps/web-seller/common/constants/paths.constant";
import { Badge } from "@/apps/web-seller/common/components/@shadcn-ui/badge";

export const StoreDetailOrderDetailPage: React.FC = () => {
  const { storeId, orderId } = useParams<{ storeId: string; orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrderDetail(orderId || "");
  const updateOrderStatusMutation = useUpdateOrderStatus();

  if (!storeId || !orderId) {
    return (
      <div>
        <h2 className="text-xl font-semibold">스토어 또는 주문이 선택되지 않았습니다.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <h2 className="text-xl font-semibold">주문을 찾을 수 없습니다.</h2>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Badge className="bg-yellow-500 text-white">대기중</Badge>;
      case OrderStatus.CONFIRMED:
        return <Badge className="bg-green-500 text-white">확정됨</Badge>;
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
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.STORE_DETAIL_ORDERS_LIST(storeId))}
          >
            목록으로
          </Button>
          <h1 className="text-3xl font-bold">주문 상세</h1>
        </div>
        {order.orderStatus === OrderStatus.PENDING && (
          <Button onClick={handleConfirmOrder} disabled={updateOrderStatusMutation.isPending}>
            예약 확정
          </Button>
        )}
      </div>

      {/* 주문 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>주문 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">주문 번호</div>
              <div className="text-lg font-semibold">{order.orderNumber}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">주문 상태</div>
              <div className="mt-1">{getStatusBadge(order.orderStatus)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">주문일시</div>
              <div>{new Date(order.createdAt).toLocaleString("ko-KR")}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">총 수량</div>
              <div className="text-lg font-semibold">{order.totalQuantity}개</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-medium text-muted-foreground">총 금액</div>
              <div className="text-2xl font-bold text-primary">
                {order.totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주문 항목 */}
      <Card>
        <CardHeader>
          <CardTitle>주문 항목</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">
                    픽업일시: {new Date(item.pickupDate).toLocaleString("ko-KR")}
                  </div>
                  <div className="text-lg font-bold">
                    {item.itemPrice.toLocaleString()}원 × {item.quantity}개
                  </div>
                </div>
                {item.sizeDisplayName && (
                  <div className="text-sm text-muted-foreground">
                    사이즈: {item.sizeDisplayName}
                    {item.sizeLengthCm && ` (${item.sizeLengthCm}cm)`}
                    {item.sizeDescription && ` - ${item.sizeDescription}`}
                    {item.sizePrice &&
                      item.sizePrice > 0 &&
                      ` (+${item.sizePrice.toLocaleString()}원)`}
                  </div>
                )}
                {item.flavorDisplayName && (
                  <div className="text-sm text-muted-foreground">
                    맛: {item.flavorDisplayName}
                    {item.flavorPrice &&
                      item.flavorPrice > 0 &&
                      ` (+${item.flavorPrice.toLocaleString()}원)`}
                  </div>
                )}
                {item.letteringMessage && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">레터링:</span> {item.letteringMessage}
                  </div>
                )}
                {item.requestMessage && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">요청사항:</span> {item.requestMessage}
                  </div>
                )}
                {item.imageUrls && item.imageUrls.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {item.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`주문 항목 이미지 ${idx + 1}`}
                        className="h-20 w-20 rounded object-cover"
                      />
                    ))}
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
          <CardHeader>
            <CardTitle>픽업 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">주소</div>
              <div>{order.pickupRoadAddress || order.pickupAddress}</div>
              {order.pickupAddress && order.pickupRoadAddress && <div>{order.pickupAddress}</div>}
              {order.pickupDetailAddress && <div>{order.pickupDetailAddress}</div>}
            </div>
            {order.pickupZonecode && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">우편번호</div>
                <div>{order.pickupZonecode}</div>
              </div>
            )}
            {order.pickupLatitude && order.pickupLongitude && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">위치</div>
                <div>
                  위도: {order.pickupLatitude}, 경도: {order.pickupLongitude}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
