"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/apps/web-user/common/components/buttons/Button";
import { ProductType } from "@/apps/web-user/features/product/types/product.type";
import { Icon } from "@/apps/web-user/common/components/icons";

interface ReservationItemSnapshot {
  date: string | null;
  size: string;
  sizePrice: number;
  flavor: string;
  flavorPrice: number;
  cream: string;
  letteringMessage: string;
  requestMessage: string;
  quantity: number;
}

interface ReservationSnapshot {
  productType: ProductType;
  items: ReservationItemSnapshot[];
  totalQuantity: number;
  totalPrice: number;
  cakeTitle: string;
  cakeImageUrl: string;
  cakeSize: string;
  price: number;
  productNoticeProducer: string;
  productNoticeAddress: string;
  pickupAddress: string;
  pickupRoadAddress: string;
}

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
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<ReservationSnapshot | null>(null);
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("reservationComplete");
    if (!stored) return;
    try {
      setSnapshot(JSON.parse(stored));
    } catch {
      setSnapshot(null);
    }
  }, []);

  return (
    <div className="relative h-screen">
      {snapshot?.cakeImageUrl && (
        <div className="h-[30%] relative overflow-hidden">
          <Image
            src={snapshot.cakeImageUrl}
            alt={snapshot.cakeTitle}
            fill
            className="object-cover blur-sm scale-110"
          />
        </div>
      )}

      {!snapshot ? (
        <div className="text-sm text-gray-500 mb-[24px]">예약 정보가 없습니다.</div>
      ) : (
        <div className="absolute bottom-[76px] left-0 right-0 h-[calc(70%-48px)] px-[20px] pt-[56px] bg-white rounded-t-4xl">
          <div className="absolute top-[-72px] left-1/2 -translate-x-1/2 h-[106px] w-[106px] border-[2px] border-white rounded-2xl overflow-hidden">
            <Image
              src={snapshot.cakeImageUrl}
              alt={snapshot.cakeTitle}
              fill
              className="object-cover"
            />
          </div>
          <p className="mb-[28px] text-xl font-bold text-gray-900 text-center">
            {snapshot.productType === ProductType.BASIC_CAKE ? "예약완료" : "예약신청완료"} 🎉
          </p>
          <div className="pb-[60px] h-[calc(100%-56px)] overflow-y-auto">
            <p className="flex items-center gap-[8px] mb-[28px] py-[10px] px-[12px] text-sm text-gray-900 bg-blue-50 rounded-xl">
              <Icon name="warning" width={16} height={16} className="text-blue-400" />
              예약 확정까지 1-2일 소요될 수 있어요.
            </p>
            <div className="mb-[20px]">
              <div className="flex items-start justify-between mb-[6px] px-[16px] text-sm">
                <span className="text-gray-500">픽업장소</span>
                <span className="text-gray-900 text-end">
                  {snapshot.productNoticeProducer}
                  <br />
                  <span className="text-gray-400 text-2sm">{snapshot.productNoticeAddress}</span>
                </span>
              </div>
              <div className="flex items-center justify-between mb-[6px] px-[16px] text-sm">
                <span className="text-gray-500">결제방식</span>
                <span className="text-gray-900">현장결제</span>
              </div>
              <div className="flex items-center justify-between px-[16px] text-sm">
                <span className="text-gray-500">총 결제금액</span>
                <span className="text-gray-900">{snapshot.totalPrice.toLocaleString()}원</span>
              </div>
            </div>
            <div className="flex flex-col gap-[20px]">
              {snapshot.items.map((item, index) => {
                const isOpen = openIndexes.has(index);
                const itemPrice = snapshot.price + item.sizePrice + item.flavorPrice;
                return (
                  <div
                    key={index}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className="pt-[12px] border border-gray-100 rounded-lg"
                  >
                    <span className="inline-flex items-center ml-[12px] px-[6px] py-[4px] text-xs text-gray-700 font-bold bg-gray-50 rounded-lg">
                      <Icon
                        name="takeout"
                        width={16}
                        height={16}
                        className="mr-[2px] text-gray-700"
                      />
                      픽업 {formatDateTime(item.date)}
                    </span>
                    <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-gray-100">
                      <div className="flex flex-col gap-[4px]">
                        <span className="text-xs text-gray-500">예약상품</span>
                        <span className="flex items-center gap-[2px] text-sm text-gray-900">
                          {snapshot.cakeTitle}
                          <Icon name="quantity" width="8px" height="8px" />
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex flex-col gap-[4px] items-end">
                        <span className="text-xs text-gray-500">금액</span>
                        <span className="text-sm text-gray-900">
                          {itemPrice.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="flex flex-col gap-[8px] py-[12px] px-[16px] bg-gray-50 border-b border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">상품명</span>
                          <p className="flex items-center justify-between text-2sm text-gray-900">
                            <span>{snapshot.cakeTitle}</span>
                            <span>{snapshot.price.toLocaleString()}원</span>
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">사이즈</span>
                          <p className="flex items-center justify-between text-2sm text-gray-900">
                            <span>{item.size}</span>
                            {item.sizePrice > 0 && (
                              <span>+{item.sizePrice.toLocaleString()}원</span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">맛</span>
                          <p className="flex items-center justify-between text-2sm text-gray-900">
                            <span>{item.flavor}</span>
                            {item.flavorPrice > 0 && (
                              <span>+{item.flavorPrice.toLocaleString()}원</span>
                            )}
                          </p>
                        </div>
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
          </div>
          <div className="fixed bottom-0 left-0 right-0 px-[20px] py-[12px] bg-white">
            <div className="flex gap-[8px]">
              <Link href="/store" className="flex-1">
                <Button variant="outline">예약 상세보기</Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline">홈으로 가기</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <button className="absolute top-[14px] right-[20px]" onClick={() => router.push("/")}>
        <Icon name="close" width={24} height={24} className="text-white" />
      </button>
    </div>
  );
}
