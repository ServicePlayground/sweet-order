"use client";

import { Calendar } from "@/apps/web-user/common/components/calendars/Calendar";
import { TimePicker } from "@/apps/web-user/common/components/timepickers/TimePicker";
import { cn } from "@/apps/web-user/common/lib/utils";
import type { MapPickupPeriodKind } from "@/apps/web-user/features/store/utils/map.util";

interface ReservationCalendarViewProps {
  tempSelectedDate: Date | null;
  setTempSelectedDate: (date: Date | null) => void;
  tempSelectedTime: Date | null;
  setTempSelectedTime: (time: Date | null) => void;
  /** true면 TimePicker 대신 지도용 구간(하루종일·오전·오후) 선택 */
  pickupPeriodMode?: boolean;
  selectedPickupPeriod?: MapPickupPeriodKind | null;
  onPickupPeriodChange?: (period: MapPickupPeriodKind) => void;
}

const PERIOD_LABELS: Record<MapPickupPeriodKind, string> = {
  fullday: "하루종일",
  morning: "오전",
  afternoon: "오후",
};

/** PillTabs와 동일한 회색 세로 구분선 */
function PickupPeriodDivider() {
  return <div className="h-3 w-px shrink-0 bg-[var(--grayscale-gr-100,#EBEBEA)]" aria-hidden />;
}

export function ReservationCalendarView({
  tempSelectedDate,
  setTempSelectedDate,
  tempSelectedTime,
  setTempSelectedTime,
  pickupPeriodMode = false,
  selectedPickupPeriod,
  onPickupPeriodChange,
}: ReservationCalendarViewProps) {
  return (
    <div className="px-[20px] py-[16px] flex flex-col gap-[48px]">
      <Calendar
        selectedDate={tempSelectedDate}
        onDateSelect={setTempSelectedDate}
        minDate={new Date()}
        className="border-0 shadow-none p-0"
      />
      {pickupPeriodMode ? (
        <div className="w-full max-w-sm mx-auto shrink-0 pb-[40px]">
          <div className="flex h-10 w-full items-center" style={{ gap: 12 }}>
            {(["fullday", "morning", "afternoon"] as const).map((key, index) => {
              const selected = selectedPickupPeriod === key;
              return (
                <span key={key} className="contents">
                  {index === 1 ? <PickupPeriodDivider /> : null}
                  <button
                    type="button"
                    onClick={() => onPickupPeriodChange?.(key)}
                    className={cn(
                      "box-border flex shrink-0 items-center justify-center text-center transition-colors",
                      selected
                        ? "bg-[var(--primary-or-50,#FFEFEB)] text-[var(--primary-or-400,#FF653E)]"
                        : "bg-[var(--grayscale-gr-00,#FFFFFF)] text-[var(--grayscale-gr-900,#1F1F1E)]",
                    )}
                    style={{
                      height: 40,
                      boxSizing: "border-box",
                      borderRadius: 6,
                      border: selected
                        ? "1px solid var(--primary-or-100, #FFD2C7)"
                        : "1px solid var(--grayscale-gr-100, #EBEBEA)",
                      padding: "10px 12px",
                      fontSize: 14,
                      lineHeight: "18px",
                      fontWeight: selected ? 700 : 400,
                    }}
                  >
                    {PERIOD_LABELS[key]}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="pb-[40px]">
          <TimePicker
            selectedTime={tempSelectedTime}
            onTimeSelect={setTempSelectedTime}
            interval={30}
            timeFormat="12h"
          />
        </div>
      )}
    </div>
  );
}
