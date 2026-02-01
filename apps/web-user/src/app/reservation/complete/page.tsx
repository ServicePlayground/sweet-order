"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/apps/web-user/common/components/buttons/Button";

interface ReservationItemSnapshot {
  date: string | null;
  size: string;
  flavor: string;
  cream: string;
  letteringMessage: string;
  requestMessage: string;
  quantity: number;
}

interface ReservationSnapshot {
  items: ReservationItemSnapshot[];
  totalQuantity: number;
  totalPrice: number;
  cakeTitle: string;
  cakeImageUrl: string;
  price: number;
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
  const [snapshot, setSnapshot] = useState<ReservationSnapshot | null>(null);

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
    <div className="min-h-screen px-[20px] py-[32px]">
      <div className="text-2xl font-bold text-gray-900 mb-[8px]">예약이 완료됐어요</div>
      <div className="text-sm text-gray-600 mb-[24px]">
        예약 내역은 마이페이지에서 확인할 수 있어요.
      </div>

      {!snapshot ? (
        <div className="text-sm text-gray-500 mb-[24px]">예약 정보가 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-[16px] mb-[28px]">
          <div className="flex items-center justify-between p-[16px] border border-gray-100 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">상품</div>
              <div className="text-base font-bold text-gray-900">{snapshot.cakeTitle}</div>
            </div>
            <div className="text-base font-bold text-gray-900">
              {snapshot.totalPrice.toLocaleString()}원
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            {snapshot.items.map((item, index) => (
              <div key={index} className="p-[14px] border border-gray-100 rounded-lg">
                <div className="text-sm text-gray-700 mb-[8px]">{formatDateTime(item.date)}</div>
                <div className="text-sm text-gray-900 mb-[6px]">
                  사이즈: {item.size} / 맛: {item.flavor}
                </div>
                <div className="text-sm text-gray-900 mb-[6px]">
                  레터링: {item.letteringMessage}
                </div>
                {item.requestMessage && (
                  <div className="text-sm text-gray-900 mb-[6px]">
                    요청사항: {item.requestMessage}
                  </div>
                )}
                <div className="text-sm text-gray-700">수량: {item.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-[8px]">
        <Link href="/" className="flex-1">
          <Button>홈으로 돌아가기</Button>
        </Link>
        <Link href="/store" className="flex-1">
          <Button variant="outline">스토어 둘러보기</Button>
        </Link>
      </div>
    </div>
  );
}
