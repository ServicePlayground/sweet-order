import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  flex?: boolean;
  width?: string | number;
  height?: string | number;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-gray-200 text-gray-900",
  outline: "bg-white text-gray-900 border border-gray-300",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-[40px] text-sm",
  md: "h-[48px] text-base",
  lg: "h-[52px] text-base",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  disabled,
  variant = "primary",
  size = "lg",
  fullWidth = false,
  flex = false,
  width,
  height,
  style,
  ...props
}) => {
  const customStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === "number" ? `${height}px` : height }),
  };

  return (
    <button
      {...props}
      disabled={disabled}
      style={customStyle}
      className={`
        font-bold rounded-xl transition-all duration-200
        ${variantStyles[variant]}
        ${height === undefined ? sizeStyles[size] : ""}
        ${fullWidth ? "w-full" : ""}
        ${flex ? "flex-1" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {children}
    </button>
  );
};
