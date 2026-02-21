import * as React from "react";
import { BaseInput } from "@/apps/web-seller/common/components/inputs/BaseInput";
import { cn } from "@/apps/web-seller/common/utils/classname.util";

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  /** undefined면 빈 칸 표시(필터 등 선택 입력용) */
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, className, integer = true, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.valueAsNumber;
      if (Number.isNaN(raw) || e.target.value.trim() === "") {
        onChange(undefined); // 비어 있는 값은 undefined로 전달, 상위에서 변환
        return;
      }
      const next = integer ? Math.floor(raw) : raw;
      onChange(next); // 숫자 값은 그대로 전달
    };

    const displayValue = value === undefined ? "" : String(value);

    return (
      <BaseInput
        ref={ref}
        type="number"
        className={cn(className)}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
