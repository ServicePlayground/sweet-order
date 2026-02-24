"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/apps/web-user/common/constants/paths.constant";
import { Icon } from "../icons";

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
  placeholder = "어떤 케이크를 찾으시나요?",
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
    <form onSubmit={handleSubmit} className="w-full max-w-full">
      <div className="flex gap-2 w-full h-10 px-4 border border-gray-100 rounded-full text-base bg-white text-gray-900 outline-none shadow-[0px_3px_10px_0px_rgba(0,0,0,0.04)]">
        <Icon name="search" width={20} height={20} className="text-gray-800" />
        <input
          type="search"
          enterKeyHint="search"
          value={searchTerm}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />
      </div>
    </form>
  );
}
