"use client";

import { Icon } from "@/apps/web-user/common/components/icons";

/**
 * DatePickerInput - 날짜 선택 버튼 (입력 부분만)
 * 클릭 시 onOpen 콜백 호출, 부모에서 캘린더 화면 전환 처리
 *
 * @example
 * // 바텀시트 내에서 view 전환 방식으로 사용
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

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  label,
  placeholder = "날짜를 선택해주세요",
  onOpen,
  disabled = false,
  hint,
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return placeholder;

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
  };

  return (
    <div className="w-full">
      {label && (
        <div className="mb-[4px]">
          <label
            className={`block text-sm font-bold text-gray-900 ${hint ? "pb-[10px]" : "pb-[6px]"}`}
          >
            {label}
          </label>
          {hint && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={onOpen}
        disabled={disabled}
        aria-label={label || placeholder}
        className=" relative pl-[12px] pr-[42px] w-full h-[42px] text-left text-sm border border-gray-100 rounded-lg bg-white transition-colors"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>{formatDate(value)}</span>
        <Icon
          name="calendar"
          width={20}
          height={20}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400"
        />
      </button>
    </div>
  );
};
