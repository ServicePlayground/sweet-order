import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, style, disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        border: "none",
        backgroundColor: disabled ? "#f5f5f5" : "#000",
        color: disabled ? "#999" : "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        fontWeight: "600",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = "#333";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = "#000";
        }
      }}
    >
      {children}
    </button>
  );
};
