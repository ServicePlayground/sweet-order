"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (searchTerm: string) => void;
  onChange?: (searchTerm: string) => void;
  placeholder?: string;
}

export function SearchBar({
  initialValue = "",
  onSearch,
  onChange,
  placeholder = "상품을 검색해보세요",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();

  // initialValue가 변경되면 searchTerm 업데이트
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  const handleChange = (value: string) => {
    setSearchTerm(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      if (onSearch) {
        onSearch(trimmedSearchTerm);
      } else {
        router.push(`${PATHS.SEARCH}?q=${encodeURIComponent(trimmedSearchTerm)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            height: "48px",
            padding: "0 20px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.2s ease",
            backgroundColor: "#ffffff",
            color: "#111827",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#007bff";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e5e7eb";
          }}
        />
        <button
          type="submit"
          style={{
            height: "48px",
            padding: "0 24px",
            backgroundColor: "#000000",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#333333";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#000000";
          }}
        >
          검색
        </button>
      </div>
    </form>
  );
}
