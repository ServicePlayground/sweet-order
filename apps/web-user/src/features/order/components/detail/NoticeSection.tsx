import { OrderDetailSectionTitle } from "./OrderDetailSectionTitle";

const REFUND_RULES = [
  { period: "~ 픽업 3일 전", rule: "취소 시 전액 환불" },
  { period: "픽업 2일 전", rule: "취소 시 50% 환불" },
  { period: "픽업 1일 전", rule: "취소 불가 / 환불 불가" },
  { period: "픽업 당일", rule: "취소 불가 / 환불 불가" },
];

export function NoticeSection() {
  return (
    <section className="px-5">
      <OrderDetailSectionTitle>안내 사항</OrderDetailSectionTitle>
      <div className="flex flex-col gap-5 mb-16 p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="text-2sm font-bold text-gray-900 mb-2.5">환불/취소 규정</h3>
          <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
            {REFUND_RULES.map(({ period, rule }) => (
              <div
                key={period}
                className="flex items-center text-2sm text-gray-900 border-b border-gray-100 last:border-b-0"
              >
                <span className="w-[110px] px-4 py-3 text-gray-500 border-r border-gray-100 shrink-0">
                  {period}
                </span>
                <span className="px-4 py-3 text-gray-900">{rule}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2sm font-bold text-gray-900 mb-1">노쇼 정책</h3>
          <p className="text-2sm text-gray-900">노쇼 시 서비스 이용에 제한이 있을 수 있습니다.</p>
        </div>
        <div>
          <h3 className="text-2sm font-bold text-gray-900 mb-1">날짜 및 옵션 변경 규정</h3>
          <p className="text-2sm text-gray-900">옵션 변경은 예약신청 상태에서만 가능합니다.</p>
          <p className="text-2sm text-gray-900">
            예약 상태: 예약신청 → 입금대기 → 입금완료 → 예약확정
          </p>
        </div>
        <div>
          <h3 className="text-2sm font-bold text-gray-900 mb-1">기타 안내</h3>
          <p className="text-2sm text-gray-900">주문 제작 소요시간: 2 ~ 3일</p>
        </div>
      </div>
    </section>
  );
}
