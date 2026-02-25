"use client";

import { useState } from "react";
import Image from "next/image";
import { useAlarmList } from "@/apps/web-user/features/alarm/hooks/queries/useAlarmList";
import { Icon } from "../../common/components/icons";

export default function AlarmPage() {
  const { data: alarms = [] } = useAlarmList();
  const [showAlarms, setShowAlarms] = useState(true);

  return (
    <div className="flex flex-col min-h-[calc(100vh-52px)]">
      {/* TODO: 테스트용 토글 - API 연결 후 제거 */}
      <div className="flex flex-col items-center py-2 gap-1">
        <span className="text-[10px] text-yellow-500 font-bold">테스트용 토글버튼 · API 연결 후 제거예정</span>
        <button
          type="button"
          onClick={() => setShowAlarms((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${showAlarms ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"}`}
        >
          <span className={`w-2 h-2 rounded-full ${showAlarms ? "bg-primary" : "bg-gray-300"}`} />
          {showAlarms ? "알림 있음" : "알림 없음"}
        </button>
      </div>

      {/* 알림 리스트 */}
      <main className="flex-1 flex flex-col px-5">
        {!showAlarms || alarms.length === 0 ? (
          <div className="flex-1 flex flex-col gap-[10px] items-center justify-center mb-[52px]">
            <Icon name="alarm" width={60} height={40} className="text-gray-200" />
            <p className="text-sm text-gray-700 text-center">아직 알림이 없어요</p>
          </div>
        ) : (
          <ul>
            {alarms.map((alarm) => (
              <li key={alarm.id} className="flex items-center gap-[10px] py-[14px] ">
                {/* 이미지 */}
                <div className="w-[42px] h-[42px] rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={alarm.imageUrl ?? "/images/contents/none_alarm_user.png"}
                    alt={alarm.title}
                    width={42}
                    height={42}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>

                {/* 제목 + 내용 */}
                <div className="flex-1 flex flex-col gap-[6px] min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{alarm.title}</p>
                  <p className="text-sm text-gray-700 truncate">{alarm.content}</p>
                </div>

                {/* 날짜 + 시간 */}
                <div className="flex gap-[2px] self-start shrink-0 text-xs text-gray-400">
                  <span>{alarm.date}</span>
                  <span>{alarm.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
