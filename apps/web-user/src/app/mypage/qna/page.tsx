"use client";

import { useState } from "react";
import Header from "@/apps/web-user/common/components/headers/Header";
import { Icon } from "@/apps/web-user/common/components/icons";

interface QnaItem {
  id: string;
  question: string;
  answer: string;
}

interface QnaCategory {
  category: string;
  items: QnaItem[];
}

// TODO: API 연결 후 제거
const DUMMY_QNA: QnaCategory[] = [
  {
    category: "주문/예약",
    items: [
      {
        id: "1",
        question: "주문은 어떻게 하나요?",
        answer: "원하시는 상품을 선택한 후 예약하기 버튼을 눌러 예약을 진행하실 수 있습니다.",
      },
      {
        id: "2",
        question: "예약 취소는 어떻게 하나요?",
        answer:
          "마이페이지 > 내 예약에서 취소하실 수 있습니다.\n픽업일 기준 2일 전까지 취소가 가능합니다.",
      },
      {
        id: "3",
        question: "주문 후 변경이 가능한가요?",
        answer: "주문 확정 전까지는 변경이 가능합니다.\n스토어에 문의해 주세요.",
      },
      {
        id: "4",
        question: "픽업 시간을 변경하고 싶어요",
        answer: "스토어에 직접 문의해 주시면 변경 가능 여부를 안내받으실 수 있습니다.",
      },
      {
        id: "5",
        question: "결제는 어떤 방법으로 할 수 있나요?",
        answer: "현재 카카오페이, 토스페이, 신용/체크카드 결제를 지원하고 있습니다.",
      },
      {
        id: "6",
        question: "환불은 언제 처리되나요?",
        answer: "취소 후 영업일 기준 3~5일 이내에 환불이 완료됩니다.",
      },
    ],
  },
  {
    category: "서비스 이용",
    items: [
      {
        id: "7",
        question: "회원가입은 어떻게 하나요?",
        answer: "앱 설치 후 카카오, 구글, 네이버 계정으로 간편하게 가입하실 수 있습니다.",
      },
      {
        id: "8",
        question: "알림은 어떻게 설정하나요?",
        answer: "마이페이지 > 설정에서 알림 수신 여부를 변경하실 수 있습니다.",
      },
      {
        id: "9",
        question: "후기는 어떻게 작성하나요?",
        answer: "픽업 완료 후 마이페이지 > 내 예약에서 후기를 작성하실 수 있습니다.",
      },
      {
        id: "10",
        question: "스토어에 직접 문의하고 싶어요",
        answer: "스토어 상세 페이지에서 제공되는 연락 수단으로 문의해 주세요.",
      },
      {
        id: "11",
        question: "앱에서 지원하는 언어는 무엇인가요?",
        answer: "현재 한국어만 지원하고 있으며, 추후 다국어 지원 예정입니다.",
      },
    ],
  },
];

export default function QnaPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <Header variant="back-title" title="Q&A" />
      <div className="pt-4">
        {DUMMY_QNA.map((section) => (
          <section key={section.category} className="pb-6">
            <p className="px-5 py-2 text-xs text-gray-500">{section.category}</p>
            <ul>
              {section.items.map((item) => (
                <li
                  key={item.id}
                  className={expandedId === item.id ? "" : "border-b border-gray-100"}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(item.id)}
                    className="w-full flex items-center gap-[10px] py-4 px-5"
                  >
                    <p className="flex-1 text-left text-sm font-bold text-gray-900">
                      Q. {item.question}
                    </p>
                    <Icon
                      name="arrow"
                      width={20}
                      height={20}
                      className={`text-gray-900 shrink-0 transition-transform ${expandedId === item.id ? "rotate-0" : "rotate-180"}`}
                    />
                  </button>
                  {expandedId === item.id && (
                    <div className="px-5">
                      <p className="px-3 py-4 text-sm text-gray-900 bg-gray-50 rounded-lg leading-[160%] whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
