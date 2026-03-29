"use client";

import { useState } from "react";
import Header from "@/apps/web-user/common/components/headers/Header";
import { Icon } from "@/apps/web-user/common/components/icons";

interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
}

// TODO: API 연결 후 제거
const DUMMY_NOTICES: Notice[] = [
  {
    id: "1",
    title: "공지사항입니다",
    date: "2026.02.16",
    content: "안녕하세요. 스윗오더입니다.\n서비스 이용에 참고 부탁드립니다.",
  },
  {
    id: "2",
    title: "업데이트 예정입니다",
    date: "2026.03.01",
    content: "새로운 기능이 곧 업데이트될 예정입니다.\n많은 관심 부탁드립니다.",
  },
  {
    id: "3",
    title: "정기 점검 안내",
    date: "2026.03.15",
    content: "서비스 안정화를 위한 정기 점검이 예정되어 있습니다.\n점검 시간: 02:00 ~ 06:00",
  },
  {
    id: "4",
    title: "이벤트 개최 안내",
    date: "2026.04.01",
    content: "봄맞이 특별 이벤트를 진행합니다.\n자세한 내용은 이벤트 페이지를 확인해주세요.",
  },
  {
    id: "5",
    title: "서비스 개선 소식",
    date: "2026.04.20",
    content: "고객 여러분의 피드백을 반영하여 서비스가 개선되었습니다.",
  },
  {
    id: "6",
    title: "신규 기능 출시",
    date: "2026.05.01",
    content: "새로운 기능이 추가되었습니다.\n더욱 편리한 서비스를 이용해보세요.",
  },
];

export default function NoticePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <Header variant="back-title" title="공지사항" />
      <ul className="pt-4">
        {DUMMY_NOTICES.map((notice) => (
          <li key={notice.id} className={expandedId === notice.id ? "" : "border-b border-gray-100"}>
            <button
              type="button"
              onClick={() => handleToggle(notice.id)}
              className="w-full flex items-center gap-[10px] py-4 px-5"
            >
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-gray-900">{notice.title}</p>
                <p className="text-xs text-gray-400">{notice.date}</p>
              </div>
              <Icon
                name="arrow"
                width={20}
                height={20}
                className={`text-gray-900 shrink-0 transition-transform ${expandedId === notice.id ? "rotate-0" : "rotate-180"}`}
              />
            </button>
            {expandedId === notice.id && (
              <div className="px-5">
                <p className="px-3 py-4 text-sm text-gray-900 bg-gray-50 rounded-lg leading-[160%] whitespace-pre-line">
                  {notice.content}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
