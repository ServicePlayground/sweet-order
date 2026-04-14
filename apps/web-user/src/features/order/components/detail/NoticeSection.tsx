import { OrderDetailSectionTitle } from "./OrderDetailSectionTitle";

const REFUND_RULES = [
  { period: "~ 픽업 3일 전", rule: "취소 시 전액 환불" },
  { period: "픽업 2일 전", rule: "취소 시 50% 환불" },
  { period: "픽업 1일 전", rule: "취소 불가 / 환불 불가" },
  { period: "픽업 당일", rule: "취소 불가 / 환불 불가" },
];

export function NoticeSection() {
  return (
    <section className="px-5 py-6">
      <OrderDetailSectionTitle>안내 사항</OrderDetailSectionTitle>

      <h3 className="text-sm font-bold text-gray-900 mb-2">환불/취소 규정</h3>
      <div className="rounded-lg border border-gray-100 overflow-hidden mb-5">
        {REFUND_RULES.map(({ period, rule }) => (
          <div
            key={period}
            className="flex items-center text-xs text-gray-900 border-b border-gray-100 last:border-b-0"
          >
            <span className="w-[100px] px-3 py-2.5 bg-gray-25 text-gray-700 shrink-0">
              {period}
            </span>
            <span className="px-3 py-2.5">{rule}</span>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-1.5">노쇼 정책</h3>
      <p className="text-xs text-gray-700 mb-5">노쇼 시 서비스 이용에 제한이 있을 수 있습니다.</p>

      <h3 className="text-sm font-bold text-gray-900 mb-1.5">날짜 및 옵션 변경 규정</h3>
      <p className="text-xs text-gray-700">옵션 변경은 예약신청 상태에서만 가능합니다.</p>
      <p className="text-xs text-gray-700 mb-5">
        예약 상태: 예약신청 → 입금대기 → 입금완료 → 예약확정
      </p>

      <h3 className="text-sm font-bold text-gray-900 mb-1.5">기타 안내</h3>
      <p className="text-xs text-gray-700">주문 제작 소요시간: 2 ~ 3일</p>
    </section>
  );
}
