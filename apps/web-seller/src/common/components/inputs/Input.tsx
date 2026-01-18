import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: "100%",
          height: "48px",
          padding: "0 16px",
          border: `1px solid ${error ? "#e74c3c" : "#e0e0e0"}`,
          borderRadius: "6px",
          fontSize: "16px",
          outline: "none",
          transition: "border-color 0.2s ease",
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? "#e74c3c" : "#007bff";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#e74c3c" : "#e0e0e0";
        }}
      />
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

