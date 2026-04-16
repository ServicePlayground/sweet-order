import { useEffect, useMemo, useState } from "react";
import { PAYMENT_PENDING_VALIDITY_MS } from "@/apps/web-seller/features/order/constants/order-lifecycle.constant";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

interface PaymentPendingCountdownProps {
  /** 서버가 계산한 입금 마감 시각(권장) */
  deadlineAt?: Date | string | null;
  /** 마감 미제공 시 폴백: 입금대기 진입 시각 + 최대 12시간 */
  windowStartAt: Date | string;
}

/**
 * 입금대기 주문: 서버 마감 시각까지 남은 시간을 1초 단위로 표시
 */
export function PaymentPendingCountdown({
  deadlineAt,
  windowStartAt,
}: PaymentPendingCountdownProps) {
  const deadlineMs = useMemo(() => {
    if (deadlineAt) {
      return new Date(deadlineAt).getTime();
    }
    return new Date(windowStartAt).getTime() + PAYMENT_PENDING_VALIDITY_MS;
  }, [deadlineAt, windowStartAt]);

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
    <div className="rounded-md border border-amber-200/90 bg-amber-50/95 px-3 py-2.5 text-[13px] leading-snug">
      <div className="font-semibold text-amber-950">입금 유효 시간 (마감 시각까지)</div>
      {expired ? (
        <p className="mt-1.5 text-[13px] leading-relaxed text-amber-950">
          유효 시간이 지났습니다. 서버에서는 자동으로 취소완료 처리될 수 있어요. 화면이 맞지 않으면
          새로고침해 주세요.
        </p>
      ) : (
        <>
          <p className="mt-2 font-mono text-2xl font-bold tabular-nums tracking-tight text-amber-950">
            {pad2(hours)}:{pad2(minutes)}:{pad2(seconds)}
            <span className="ml-2 align-middle text-[13px] font-semibold text-amber-900">남음</span>
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-amber-900/95">
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
