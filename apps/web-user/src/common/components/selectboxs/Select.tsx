import React from "react";

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

interface SelectProps<T = string> extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value"
> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  label?: string;
  error?: string;
}

export const Select = <T extends string | number = string>({
  value,
  onChange,
  options,
  label,
  error,
  style,
  ...props
}: SelectProps<T>) => {
  // style에서 width를 추출하여 최상위 div와 select에 적용
  const containerWidth = style?.width || (label ? "100%" : "auto");
  const selectWidth = style?.width || "100%";

  return (
    <div style={{ width: containerWidth }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}
      <select
        {...props}
        value={value}
        onChange={(e) => {
          const selectedValue = e.target.value as T;
          onChange(selectedValue);
        }}
        style={{
          width: selectWidth,
          padding: "8px 12px",
          fontSize: "14px",
          border: `1px solid ${error ? "#e74c3c" : "#e5e7eb"}`,
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          color: "#374151",
          cursor: "pointer",
          outline: "none",
          transition: "border-color 0.2s ease",
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? "#e74c3c" : "#007bff";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#e74c3c" : "#e5e7eb";
        }}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p
          style={{
            marginTop: "6px",
            fontSize: "12px",
            color: "#e74c3c",
            marginBottom: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
