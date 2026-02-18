import React, { useState, KeyboardEvent } from "react";
import { Label } from "@/apps/web-seller/common/components/labels/Label";
import { BaseInput as Input } from "@/apps/web-seller/common/components/inputs/BaseInput";
import { BaseButton as Button } from "@/apps/web-seller/common/components/buttons/BaseButton";
import { X } from "lucide-react";

export interface ProductCreationSearchTagSectionProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

/** 검색 태그 설정 */
export const ProductCreationSearchTagSection: React.FC<ProductCreationSearchTagSectionProps> = ({
  value = [],
  onChange,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (!inputValue.trim() || disabled) return;

    // 입력값에서 # 제거 (자동으로 추가할 예정이므로)
    const tagText = inputValue.trim().replace(/^#+/, "");
    if (!tagText) return;

    // 이미 존재하는 태그인지 확인
    const tagWithHash = `#${tagText}`;
    if (value.includes(tagWithHash)) {
      setInputValue("");
      return;
    }

    // 새 태그 추가
    onChange([...value, tagWithHash]);
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (disabled) return;
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-base font-medium text-foreground">검색 태그 설정</Label>
        <p className="text-sm text-muted-foreground">
          고객이 검색할 때 이 상품을 찾기 쉽도록 태그를 추가하세요. (예: #커스텀케이크, #생일파티,
          #조카선물)
        </p>
      </div>

      {/* 기존 태그 표시 */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/60 text-sm text-foreground border border-border/80"
            >
              <span>{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
                  aria-label={`${tag} 태그 제거`}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 태그 입력 필드 */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="태그 입력 후 Enter(#자동추가)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={disabled || !inputValue.trim()}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          확인
        </Button>
      </div>
    </div>
  );
};
