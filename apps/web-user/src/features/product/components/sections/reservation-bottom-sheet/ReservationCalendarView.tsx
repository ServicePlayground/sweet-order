"use client";

import { Calendar } from "@/apps/web-user/common/components/calendars/Calendar";
import { TimePicker } from "@/apps/web-user/common/components/timepickers/TimePicker";

interface ReservationCalendarViewProps {
  tempSelectedDate: Date | null;
  setTempSelectedDate: (date: Date | null) => void;
  tempSelectedTime: Date | null;
  setTempSelectedTime: (time: Date | null) => void;
}

export function ReservationCalendarView({
  tempSelectedDate,
  setTempSelectedDate,
  tempSelectedTime,
  setTempSelectedTime,
}: ReservationCalendarViewProps) {
  return (
    <div className="px-[20px] py-[16px] flex flex-col gap-[16px]">
      <Calendar
        selectedDate={tempSelectedDate}
        onDateSelect={setTempSelectedDate}
        minDate={new Date()}
        className="border-0 shadow-none p-0"
      />
      <TimePicker
        selectedTime={tempSelectedTime}
        onTimeSelect={setTempSelectedTime}
        interval={30}
        timeFormat="12h"
      />
    </div>
  );
}
