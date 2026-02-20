"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { OrderStatus } from "@/apps/web-user/features/order/types/order.type";
import { Icon } from "@/apps/web-user/common/components/icons";
import { useOrderDetail } from "@/apps/web-user/features/order/hooks/queries/useOrderDetail";
import { useProductDetail } from "@/apps/web-user/features/product/hooks/queries/useProductDetail";

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = dayNames[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "오후" : "오전";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${year}.${month}.${day}(${dayOfWeek}) · ${period} ${displayHours}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export default function ReservationCompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 주문 상세조회
  const { data: orderData, isLoading: isOrderLoading } = useOrderDetail(orderId || "");

  // 상품 상세조회 (주문 데이터가 있을 때만)
  const { data: productData, isLoading: isProductLoading } = useProductDetail(
    orderData?.productId || "",
  );

  useEffect(() => {
    // 주문 ID가 없으면 홈으로 리다이렉트
    if (!orderId) {
      router.push("/");
    }
  }, [orderId, router]);

  const isLoading = isOrderLoading || isProductLoading;

  if (!orderId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-sm text-gray-500">예약 정보가 없습니다.</div>
      </div>
    );
  }

  if (isLoading || !orderData || !productData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-sm text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const cakeImageUrl = productData.images[0] || "";
  const cakeTitle = productData.name;
  const basePrice = productData.salePrice;

  return (
    <div className="relative h-screen">
      {cakeImageUrl && (
        <div className="h-[30%] relative overflow-hidden">
          <Image
            src={cakeImageUrl}
            alt={cakeTitle}
            fill
            className="object-cover blur-sm scale-110"
          />
        </div>
      )}

      <div className="absolute bottom-[76px] left-0 right-0 h-[calc(70%-48px)] px-[20px] pt-[56px] bg-white rounded-t-4xl">
        {cakeImageUrl && (
          <div className="absolute top-[-72px] left-1/2 -translate-x-1/2 h-[106px] w-[106px] border-[2px] border-white rounded-2xl overflow-hidden">
            <Image src={cakeImageUrl} alt={cakeTitle} fill className="object-cover" />
          </div>
        )}
        <p className="mb-[28px] text-xl font-bold text-gray-900 text-center">
          {orderData.orderStatus === OrderStatus.CONFIRMED ? "예약 완료" : "예약신청 완료"} 🎉
        </p>
        <div className="pb-[60px] h-[calc(100%-56px)] overflow-y-auto">
          {orderData.orderStatus === OrderStatus.PENDING && (
            <p className="flex items-center gap-[8px] mb-[28px] py-[10px] px-[12px] text-sm text-gray-900 bg-blue-50 rounded-xl">
              <Icon name="warning" width={16} height={16} className="text-blue-400" />
              예약 확정까지 1-2일 소요될 수 있어요.
            </p>
          )}
          <div className="mb-[20px]">
            <div className="flex items-center justify-between mb-[6px] px-[16px] text-sm">
              <span className="text-gray-500">픽업날짜</span>
              <span className="text-gray-900">{formatDateTime(orderData.pickupDate)}</span>
            </div>
            <div className="relative flex items-start justify-between mb-[24px] px-[16px] text-sm after:content-[''] after:absolute after:bottom-[-12px] after:left-4 after:right-4 after:h-[1px] after:bg-gray-50">
              <span className="text-gray-500">픽업장소</span>
              <span className="flex flex-col items-end text-gray-900">
                <span>{orderData.storeName || "스토어명 없음"}</span>
                <span className="text-gray-400 text-2sm">
                  {orderData.pickupRoadAddress ||
                    orderData.pickupAddress ||
                    productData.pickupRoadAddress ||
                    productData.pickupAddress}
                  {orderData.pickupDetailAddress && ` ${orderData.pickupDetailAddress}`}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between mb-[6px] px-[16px] text-sm">
              <span className="text-gray-500">결제방식</span>
              <span className="text-gray-900">현장결제</span>
            </div>
            <div className="flex items-center justify-between px-[16px] text-sm">
              <span className="text-gray-500">총 결제금액</span>
              <span className="text-gray-900">{orderData.totalPrice.toLocaleString()}원</span>
            </div>
          </div>
          <div className="flex flex-col gap-[20px]">
            {orderData.orderItems.map((item, index) => {
              const isOpen = openIndexes.has(index);
              const sizePrice = item.sizePrice || 0;
              const flavorPrice = item.flavorPrice || 0;
              const itemPrice = item.itemPrice;
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-gray-100">
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-xs text-gray-500">예약상품</span>
                      <span className="flex items-center gap-[2px] text-sm text-gray-900">
                        {cakeTitle}
                        <Icon name="quantity" width="8px" height="8px" />
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[4px] items-end">
                      <span className="text-xs text-gray-500">총 금액</span>
                      <span className="text-sm text-gray-900">
                        {(itemPrice * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="flex flex-col gap-[8px] py-[12px] px-[16px] bg-gray-50 border-b border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">상품명</span>
                        <p className="flex items-center justify-between text-2sm text-gray-900">
                          <span>{cakeTitle}</span>
                          <span>{basePrice.toLocaleString()}원</span>
                        </p>
                      </div>
                      {item.sizeDisplayName && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">사이즈</span>
                          <p className="flex items-center justify-between text-2sm text-gray-900">
                            <span>{item.sizeDisplayName}</span>
                            {sizePrice > 0 && <span>+{sizePrice.toLocaleString()}원</span>}
                          </p>
                        </div>
                      )}
                      {item.flavorDisplayName && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">맛</span>
                          <p className="flex items-center justify-between text-2sm text-gray-900">
                            <span>{item.flavorDisplayName}</span>
                            {flavorPrice > 0 && <span>+{flavorPrice.toLocaleString()}원</span>}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      const newSet = new Set(openIndexes);
                      if (isOpen) {
                        newSet.delete(index);
                      } else {
                        newSet.add(index);
                        setTimeout(() => {
                          cardRefs.current[index]?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }
                      setOpenIndexes(newSet);
                    }}
                    className="flex items-center justify-center gap-[4px] w-full h-[42px] text-2sm text-gray-900 bg-gray-50 rounded-b-lg"
                  >
                    {isOpen ? "간략히 보기" : "상세보기"}
                    <Icon
                      name="arrow"
                      width={16}
                      height={16}
                      className={`text-[#D9D9D9] transition-transform ${isOpen ? "" : "rotate-180"}`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="fixed bottom-0 left-0 right-0 px-[20px] py-[12px] max-w-[638px] mx-auto bg-white">
            <div className="flex gap-[8px]">
              <Link href={`/store/${orderData.storeId}`} className="flex-1">
                <Button variant="outline">예약 상세보기</Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline">홈으로 가기</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <button className="absolute top-[14px] right-[20px]" onClick={() => router.push("/")}>
        <Icon name="close" width={24} height={24} className="text-white" />
      </button>
    </div>
  );
}
