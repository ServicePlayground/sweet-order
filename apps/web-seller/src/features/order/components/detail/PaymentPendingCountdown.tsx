import { useEffect, useMemo, useState } from "react";
import { PAYMENT_PENDING_VALIDITY_MS } from "@/apps/web-seller/features/order/constants/order-lifecycle.constant";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

interface PaymentPendingCountdownProps {
  createdAt: Date | string;
}

/**
 * 입금대기 주문: 주문 생성 시각 기준 12시간 남은 시간을 1초 단위로 표시
 */
export function PaymentPendingCountdown({ createdAt }: PaymentPendingCountdownProps) {
  const deadlineMs = useMemo(
    () => new Date(createdAt).getTime() + PAYMENT_PENDING_VALIDITY_MS,
    [createdAt],
  );

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, deadlineMs - Date.now());
  const expired = remainingMs <= 0;
  const totalSec = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return (
    <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-sm">
      <div className="font-semibold text-amber-900">입금 유효 시간 (주문 시각 기준 +12시간)</div>
      {expired ? (
        <p className="mt-1 leading-relaxed text-amber-900">
          유효 시간이 지났습니다. 서버에서는 자동으로 취소완료 처리될 수 있어요. 화면이 맞지 않으면
          새로고침해 주세요.
        </p>
      ) : (
        <>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-amber-950">
            {pad2(hours)}:{pad2(minutes)}:{pad2(seconds)}
            <span className="ml-2 align-middle text-base font-semibold text-amber-800">남음</span>
          </p>
          <p className="mt-1 text-xs text-amber-800/90">
            마감 시각:{" "}
            {new Date(deadlineMs).toLocaleString("ko-KR", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </>
      )}
    </div>
  );
}
