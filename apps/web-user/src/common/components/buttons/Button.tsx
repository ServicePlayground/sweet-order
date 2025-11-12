import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, style, disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        border: "none",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        fontWeight: "600",
        ...style,
      }}
    >
      {children}
    </button>
  );
};
