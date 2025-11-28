import React, { useState, KeyboardEvent } from "react";
import { Input } from "@/apps/web-seller/common/components/ui/input";
import { Label } from "@/apps/web-seller/common/components/ui/label";
import { Badge } from "@/apps/web-seller/common/components/ui/badge";
import { X } from "lucide-react";

export interface HashtagInputProps {
  value?: string[];
  onChange?: (hashtags: string[]) => void;
  error?: string;
  label?: string;
  required?: boolean;
  maxTags?: number;
}

export const HashtagInput: React.FC<HashtagInputProps> = ({
  value = [],
  onChange,
  error,
  label = "해시태그",
  required = false,
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addHashtag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      // 백스페이스로 마지막 해시태그 삭제
      removeHashtag(value.length - 1);
    }
  };

  const addHashtag = () => {
    const trimmed = inputValue.trim().replace(/^#/, ""); // # 제거
    if (!trimmed) return;

    if (value.length >= maxTags) {
      return;
    }

    // 중복 체크
    if (value.includes(trimmed)) {
      setInputValue("");
      return;
    }

    const newHashtags = [...value, trimmed];
    onChange?.(newHashtags);
    setInputValue("");
  };

  const removeHashtag = (index: number) => {
    const newHashtags = value.filter((_, i) => i !== index);
    onChange?.(newHashtags);
  };

  return (
    <div className="w-full">
      {label && (
        <Label className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive mb-1" : "mb-1"}>
          {label}
        </Label>
      )}

      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addHashtag}
        placeholder={`해시태그를 입력하고 Enter 또는 쉼표(,)를 누르세요 (최대 ${maxTags}개)`}
        className={error ? "border-destructive" : ""}
      />

      {(error || value.length > 0) && (
        <p className="text-sm text-muted-foreground mt-1">
          {error ? <span className="text-destructive">{error}</span> : `${value.length}/${maxTags}개`}
        </p>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((hashtag, index) => (
            <Badge key={index} variant="outline" className="gap-1">
              #{hashtag}
              <button
                type="button"
                onClick={() => removeHashtag(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
