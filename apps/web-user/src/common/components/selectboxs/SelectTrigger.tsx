"use client";

import { Icon, iconTypes } from "@/apps/web-user/common/components/icons";

/**
 * 클릭 시 부모에서 바텀시트(또는 외부 picker)를 열어 선택하도록 위임하는 셀렉트 트리거.
 * - 자체적으로 드롭다운을 열지 않음 (Select 컴포넌트와 다름)
 * - DatePickerInput도 내부적으로 이 컴포넌트를 사용
 *
 * @example
 * <SelectTrigger
 *   label="은행 선택"
 *   value={selectedBank?.label ?? null}
 *   placeholder="은행을 선택해주세요."
 *   onClick={() => setIsBankSheetOpen(true)}
 * />
 *
 * @example 달력 아이콘 사용
 * <SelectTrigger
 *   value={formattedDate}
 *   onClick={openCalendar}
 *   iconName="calendar"
 *   iconRotate={false}
 * />
 */
interface SelectTriggerProps {
  /** 선택된 값의 표시 텍스트 (null이면 placeholder 노출) */
  value: string | null;
  /** 클릭 시 호출 — 부모에서 바텀시트를 열도록 처리 */
  onClick: () => void;
  /** 라벨 텍스트 (있으면 트리거 위에 표시) */
  label?: string;
  /** placeholder 텍스트 (기본: "선택해주세요") */
  placeholder?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 에러 메시지 (있으면 트리거 아래 빨간 텍스트) */
  error?: string;
  /** 라벨 하단 안내 힌트 */
  hint?: string;
  /** 우측 아이콘 (기본: "selectArrow") */
  iconName?: keyof typeof iconTypes;
  /** 아이콘 180도 회전 여부 (selectArrow처럼 ⌃→⌄ 전환이 필요한 경우) */
  iconRotate?: boolean;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  value,
  onClick,
  label,
  placeholder = "선택해주세요",
  disabled = false,
  error,
  hint,
  iconName = "selectArrow",
  iconRotate = true,
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className={hint ? "mb-[10px]" : "mb-[10px]"}>
          <label className={`block text-sm font-bold text-gray-900 ${hint ? "pb-[6px]" : ""}`}>
            {label}
          </label>
          {hint && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full h-[42px] px-3 flex items-center justify-between border border-gray-100 rounded-lg text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value ?? placeholder}</span>
        <Icon
          name={iconName}
          width={20}
          height={20}
          className={`text-gray-400 ${iconRotate ? "rotate-180" : ""}`}
        />
      </button>
      {error && <p className="mt-[6px] text-xs text-red-400">{error}</p>}
    </div>
  );
};
