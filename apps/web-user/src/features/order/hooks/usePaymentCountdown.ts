import { useEffect, useState } from "react";

const HOUR = 60 * 60 * 1000;

/**
 * 입금대기 카운트다운 유효 시간 계산
 * - 입금대기 전환 시점(paymentPendingAt) 기준으로 pickupDate까지 남은 시간을 보고 결정
 *   - 12시간 초과 남음 → 12시간
 *   - 6시간 초과 ~ 12시간 이하 → 6시간
 *   - 6시간 이하 → 1시간
 */
function resolveValidityMs(paymentPendingAt: string, pickupDate: string): number {
  const pending = new Date(paymentPendingAt).getTime();
  const pickup = new Date(pickupDate).getTime();
  const remainingToPickup = pickup - pending;

  if (remainingToPickup > 12 * HOUR) return 12 * HOUR;
  if (remainingToPickup > 6 * HOUR) return 6 * HOUR;
  return 1 * HOUR;
}

/**
 * paymentPendingAt + 동적 유효시간(12/6/1h) 기준 카운트다운
 * - text: HH:MM:SS
 * - isExpired: 남은 시간이 0 이하
 */
export function usePaymentCountdown(paymentPendingAt?: string, pickupDate?: string) {
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!paymentPendingAt || !pickupDate) return;

    const validityMs = resolveValidityMs(paymentPendingAt, pickupDate);
    const deadline = new Date(paymentPendingAt).getTime() + validityMs;

    function update() {
      setRemainingMs(Math.max(0, deadline - Date.now()));
    }

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [paymentPendingAt, pickupDate]);

  const h = String(Math.floor(remainingMs / 3600000)).padStart(2, "0");
  const m = String(Math.floor((remainingMs % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, "0");

  return {
    text: `${h}:${m}:${s}`,
    isExpired: !!paymentPendingAt && !!pickupDate && remainingMs <= 0,
  };
}
