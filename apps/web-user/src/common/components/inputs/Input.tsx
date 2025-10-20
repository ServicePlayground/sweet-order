import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...props} />
      {error && <p>{error}</p>}
    </div>
  );
};
