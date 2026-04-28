"use client";

import { SelectTrigger } from "@/apps/web-user/common/components/selectboxs/SelectTrigger";

/**
 * DatePickerInput - 날짜 선택 버튼 (입력 부분만)
 * 클릭 시 onOpen 콜백 호출, 부모에서 캘린더 화면 전환 처리
 * - 시각적 베이스는 SelectTrigger를 그대로 사용하며, 아이콘만 calendar로 다름
 *
 * @example
 * <DatePickerInput
 *   value={selectedDate}
 *   label="픽업 날짜"
 *   onOpen={() => setView("calendar")}
 * />
 */
interface DatePickerInputProps {
  /** 선택된 날짜 */
  value: Date | null;
  /** 라벨 텍스트 */
  label?: string;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 클릭 시 호출되는 콜백 */
  onOpen: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 라벨 하단 힌트 텍스트 */
  hint?: string;
}

function formatDate(date: Date): string {
  const dateStr = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  // 시간이 설정되어 있으면 (00:00이 아니면) 시간도 표시
  const hour = date.getHours();
  const minute = date.getMinutes();
  if (hour !== 0 || minute !== 0) {
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${dateStr} ${period} ${displayHour}:${displayMinute}`;
  }

  return dateStr;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  label,
  placeholder = "날짜를 선택해주세요",
  onOpen,
  disabled = false,
  hint,
}) => {
  return (
    <SelectTrigger
      value={value ? formatDate(value) : null}
      onClick={onOpen}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      hint={hint}
      iconName="calendar"
      iconRotate={false}
    />
  );
};
